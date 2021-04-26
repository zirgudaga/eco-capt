// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
 
import "../node_modules/@openZeppelin/contracts/token/ERC20/ERC20.sol";

contract ECPToken is ERC20 {

    address public owner;
    address public ledger;

    modifier onlyOwner() {
        require(owner == msg.sender, "Acces Token Denied");
        _;
    }

    modifier onlyLedger() {
        require((owner == msg.sender || ledger == msg.sender), "Acces Token Denied");
        _;
    }

    constructor() ERC20("Eco-capt", "ECP") {
        owner = msg.sender;
    }

    function setLedgerAddress ( 
        address _ledger)
        onlyOwner() external{
        ledger=_ledger;
    }
    
    function ownerMint ( 
        address _customerContract,
        uint amount)
        onlyLedger() external returns (bool){
  
        _mint(_customerContract, amount);
        return true;
    }

}