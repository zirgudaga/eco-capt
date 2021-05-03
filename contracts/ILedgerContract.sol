// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ILedgerContract standard as defined in the eco-capt consortium.
 */
interface ILedgerContract {
    /**
     * @dev Returns the userType of a address
     */
    function rootingApps(address _userAddress) external view returns(uint);
    /*
        1 : Admin
        2 : Client
        3 : Législateur
        4 : Techmaster
        5 : Bridge
        9 : Public
    */
    
}
