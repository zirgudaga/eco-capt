// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
 
import "../node_modules/@openZeppelin/contracts/token/ERC20/ERC20.sol";

contract ECPToken is ERC20 {

    address private _owner;

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    constructor() ERC20("Eco-capt", "ECP") {
        _owner = msg.sender;
    }
    
    function sendSubscription ( 
        address _customerContract,
        uint amount)
        onlyOwner() external {
  
        _mint(_customerContract, amount);
    }

}