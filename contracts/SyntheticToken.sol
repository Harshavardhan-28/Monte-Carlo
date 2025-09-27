// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mcBTC is ERC20 {
    constructor(uint256 initialSupply, address pool) ERC20("Monte Carlo Bitcoin", "mcBTC") {
        _mint(pool, initialSupply); // initial supply goes to pool
    }
    function mintToken(address to, uint256 supply) external {
        _mint(to, supply);
    }
}

contract mcETH is ERC20 {
    constructor(uint256 initialSupply, address pool) ERC20("Monte Carlo Ethereum", "mcETH") {
        _mint(pool, initialSupply);
    }
    function mintToken(address to, uint256 supply) external {
        _mint(to, supply);
    }
}

contract mcLTC is ERC20 {
    constructor(uint256 initialSupply, address pool) ERC20("Monte Carlo Litecoin", "mcLTC") {
        _mint(pool, initialSupply);
    }
    function mintToken(address to, uint256 supply) external {
        _mint(to, supply);
    }
}
