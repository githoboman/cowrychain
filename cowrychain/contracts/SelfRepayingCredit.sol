// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SelfRepayingCredit
 * @dev The core logic for Alchemix-style self-repaying loans built on top of YO Protocol.
 * Users lock yield-bearing collateral (yoUSD / yoETH) and mint/borrow a stablecoin debt token.
 * Since the collateral is yield-bearing, its inherent value grows over time relative to 
 * the base debt, causing the LTV (Loan-to-Value) to drop naturally until the debt is 0.
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SelfRepayingCredit {
    IERC20 public yieldBearingCollateral; // e.g., yoUSD
    IERC20 public borrowableStablecoin;   // e.g., USDC or a synthetic internal token (crUSD)

    uint256 public constant MAX_LTV = 5000; // 50% LTV, represented in basis points (10000 = 100%)

    struct UserCreditLine {
        uint256 lockedCollateral; // Amount of yoUSD locked
        uint256 debtBalance;      // Amount of stablecoin owed
    }

    mapping(address => UserCreditLine) public creditLines;

    event CollateralDeposited(address indexed user, uint256 amount);
    event DebtBorrowed(address indexed user, uint256 amount);
    event DebtRepaid(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);

    constructor(address _yieldBearingCollateral, address _borrowableStablecoin) {
        yieldBearingCollateral = IERC20(_yieldBearingCollateral);
        borrowableStablecoin = IERC20(_borrowableStablecoin);
    }

    /**
     * @notice Locks yield-bearing collateral into the credit module.
     * @param amount The amount of yoUSD or yoETH to deposit.
     */
    function depositCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        require(
            yieldBearingCollateral.transferFrom(msg.sender, address(this), amount),
            "Collateral transfer failed"
        );

        creditLines[msg.sender].lockedCollateral += amount;

        emit CollateralDeposited(msg.sender, amount);
    }

    /**
     * @notice Borrow a stable token against your locked collateral.
     * @param amount The requested debt token amount.
     */
    function borrow(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        
        // Calculate max borrow limit based on collateral
        // In reality, this requires an Oracle to convert yoUSD collateral value -> USD debt value.
        // Assuming 1 yoUSD ~= 1 USD for simplicity in this structural example.
        uint256 userCollateral = creditLines[msg.sender].lockedCollateral;
        uint256 currentDebt = creditLines[msg.sender].debtBalance;

        // Formula: Max Debt = Collateral * 50%
        uint256 maxDebtAllowed = (userCollateral * MAX_LTV) / 10000;
        uint256 newTotalDebt = currentDebt + amount;
        
        require(newTotalDebt <= maxDebtAllowed, "LTV too high: borrowing exceeds 50% limit");

        creditLines[msg.sender].debtBalance += amount;

        // Deliver the borrowed stablecoin to the user
        require(
            borrowableStablecoin.transfer(msg.sender, amount),
            "Failed to dispense borrowed token"
        );

        emit DebtBorrowed(msg.sender, amount);
    }

    /**
     * @notice Manual debt repayment using stablecoins.
     */
    function repayDebt(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(creditLines[msg.sender].debtBalance >= amount, "Repaying more than owed");

        require(
            borrowableStablecoin.transferFrom(msg.sender, address(this), amount),
            "Repayment transfer failed"
        );

        creditLines[msg.sender].debtBalance -= amount;

        emit DebtRepaid(msg.sender, amount);
    }

    /**
     * @notice Reclaim collateral. 
     * @dev As the yield-bearing collateral natively expands in value, the user can
     *      withdraw the "yield" generated without needing to repay debt, OR withdraw
     *      everything if debt is naturally fully offset by yield.
     * @param amount The amount of yoUSD to claim back.
     */
    function withdrawCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(creditLines[msg.sender].lockedCollateral >= amount, "Insufficient collateral");

        // Calculate if post-withdrawal LTV is safe
        uint256 remainingCollateral = creditLines[msg.sender].lockedCollateral - amount;
        uint256 currentDebt = creditLines[msg.sender].debtBalance;

        // If user still has debt, withdrawing cannot push them above MAX_LTV (50%)
        if (currentDebt > 0) {
            uint256 maxDebtAllowed = (remainingCollateral * MAX_LTV) / 10000;
            require(currentDebt <= maxDebtAllowed, "Withdrawal pushes LTV above 50%");
        }

        creditLines[msg.sender].lockedCollateral -= amount;

        require(
            yieldBearingCollateral.transfer(msg.sender, amount),
            "Withdrawal transfer failed"
        );

        emit CollateralWithdrawn(msg.sender, amount);
    }
}
