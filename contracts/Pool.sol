// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SyntheticToken.sol";

// Interface for the Rootstock Attestation Service (RAS) Portal
interface IPortal {
    function attest(uint256 schemaId, bytes calldata data) external;
}

/**
 * @title Pool
 * @notice A token swapping pool integrated with the Rootstock Attestation Service.
 * @dev This contract is HARDCODED for the Rootstock TESTNET environment.
 */
contract Pool {
    mcBTC public btc;
    mcETH public eth;
    mcLTC public ltc;

    uint256 public initialLiquidity = 10000 ether;

    // --- Attestation Service Constants (Hardcoded for Rootstock Testnet) ---

    // The official Portal contract address for the Rootstock Testnet.
    // Corrected checksum casing to match your compiler's expectation.
    address public constant RAS_PORTAL_ADDRESS = 0x187a5390753443171122A222858590B1bdD02339;

    // Your pre-registered schema UID.
    uint256 public constant SWAP_SCHEMA_UID = 0xec6920595cfb31cea7f3cf5e6705669ed9a637ef7b616ea3438b671d31ff85b2;

    IPortal public immutable portal;

    constructor() {
        portal = IPortal(RAS_PORTAL_ADDRESS);
        
        btc = new mcBTC(initialLiquidity, address(this));
        eth = new mcETH(initialLiquidity, address(this));
        ltc = new mcLTC(initialLiquidity, address(this));
    }

    function swapMint(address tokenIn, address tokenOut, uint256 amountIn, uint256 rate) external {
        require(amountIn > 0, "Invalid amount");
        require(tokenIn != tokenOut, "Same token");

        uint256 poolBalance = ERC20(tokenIn).balanceOf(address(this));
        require(poolBalance >= amountIn, "Tokens not sent to pool");

        uint256 amountOut = (amountIn * rate) / 1e18;

        if (tokenOut == address(btc)) btc.mintToken(msg.sender, amountOut);
        else if (tokenOut == address(eth)) eth.mintToken(msg.sender, amountOut);
        else if (tokenOut == address(ltc)) ltc.mintToken(msg.sender, amountOut);
        else revert("Invalid output token");

        bytes memory attestationData = abi.encode(tokenIn, tokenOut, amountIn, amountOut, rate);
        portal.attest(SWAP_SCHEMA_UID, attestationData);

        _checkAndReplenish(tokenIn);
    }

    function _checkAndReplenish(address token) internal {
        uint256 threshold = (initialLiquidity * 20) / 100;
        if (ERC20(token).balanceOf(address(this)) < threshold) {
            uint256 replenishAmount = initialLiquidity / 2;
            if (token == address(btc)) btc.mintToken(address(this), replenishAmount);
            else if (token == address(eth)) eth.mintToken(address(this), replenishAmount);
            else if (token == address(ltc)) ltc.mintToken(address(this), replenishAmount);
        }
    }

    function getBalances() external view returns (uint256, uint256, uint256) {
        return (
            btc.balanceOf(address(this)),
            eth.balanceOf(address(this)),
            ltc.balanceOf(address(this))
        );
    }
}