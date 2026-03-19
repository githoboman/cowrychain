// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SquadVault
 * @dev A massively multiplayer yield-bearing vault proxy designed for Base L2.
 * Users deposit underlying assets (e.g. USDC), which are instantly pooled and 
 * staked into the ultimate YO Protocol Vault. This contract precisely tracks 
 * each member's equity share of the pooled yield.
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IYoVault {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);
    function previewDeposit(uint256 assets) external view returns (uint256);
}

contract SquadVault {
    string public squadName;
    address public creator;
    
    IERC20 public underlyingAsset; // e.g., USDC
    IYoVault public yoVault;       // e.g., yoUSD

    // Tracks internal share accounting for each member of the squad
    mapping(address => uint256) public memberShares;
    uint256 public totalSquadShares;

    event SquadDeposit(address indexed member, uint256 assets, uint256 sharesMinted);
    event SquadWithdrawal(address indexed member, uint256 assets, uint256 sharesBurned);

    constructor(
        string memory _name,
        address _underlyingAsset,
        address _yoVault,
        address _creator
    ) {
        squadName = _name;
        underlyingAsset = IERC20(_underlyingAsset);
        yoVault = IYoVault(_yoVault);
        creator = _creator;

        // Max approve the YO Vault to continuously sweep funds
        underlyingAsset.approve(_yoVault, type(uint256).max);
    }

    /**
     * @notice Deposit assets into the collective Squad pool.
     * @param amount The amount of underlying assets (e.g., USDC) to deposit.
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        // 1. Pull user collateral to this Squad Vault
        require(
            underlyingAsset.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // 2. Deposit the gathered collateral into the YO Vault, earning yo-shares back to THIS vault
        uint256 prevShares = yoVault.balanceOf(address(this));
        yoVault.deposit(amount, address(this));
        uint256 newShares = yoVault.balanceOf(address(this));

        uint256 mintedShares = newShares - prevShares;

        // 3. Track equity internally for the user
        memberShares[msg.sender] += mintedShares;
        totalSquadShares += mintedShares;

        emit SquadDeposit(msg.sender, amount, mintedShares);
    }

    /**
     * @notice Redeem an exact amount of internal shares back into underlying assets.
     */
    function withdraw(uint256 shares) external {
        require(memberShares[msg.sender] >= shares, "Insufficient squad shares");
        require(shares > 0, "Shares must be > 0");

        // 1. Burn user equity
        memberShares[msg.sender] -= shares;
        totalSquadShares -= shares;

        // 2. Withdraw from YO Vault
        uint256 assetsRecovered = yoVault.redeem(shares, address(this), address(this));

        // 3. Send underlying back to the user
        require(
            underlyingAsset.transfer(msg.sender, assetsRecovered),
            "Transfer failed"
        );

        emit SquadWithdrawal(msg.sender, assetsRecovered, shares);
    }

    /**
     * @notice Get estimating value of a user's holdings inside this Squad
     */
    function getMemberValue(address member) external view returns (uint256) {
        // Real logic would calculate conversion rate using yoVault.convertToAssets(memberShares[member])
        return memberShares[member];
    }
}
