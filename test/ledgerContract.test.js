const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CustomerContract = artifacts.require('CustomerContract');
const LedgerContract = artifacts.require('LedgerContract');


contract('setCustomer', function (accounts) {

    const owner = accounts[0];    
    const other = accounts[1];    
    const _customerAddress = accounts[2];
    const _contractAddress = accounts[3];
    const _techMasterAddress = accounts[4];
    const _legislatorAddress = accounts[5];
    const _siretNumber = new BN(12345678910111);
    const address0 = "0x0000000000000000000000000000000000000000";
    const _customer1 = 'Alan';

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new({from: owner});
    });

    it('Revert if other : onlyOwner', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        await (expectRevert(this.LedgerContract.setCustomer(
            _customer1,
            _customerAddress,
            _contractAddress,         
            _siretNumber,
            true, 
            {from: other}), "Ownable: caller is not the owner"));  
    });

    it('Customer properly set', async function () { 
        // On procède à l'ajout d'un Customer
        await this.LedgerContract.setCustomer(
            _customer1,
            _customerAddress,
            _contractAddress,         
            _siretNumber,
            true, 
            {from: owner});
        let myCustomer = await this.LedgerContract._customers(_customerAddress);   
        expect(myCustomer.description).to.equal(_customer1); 
        expect(myCustomer.contractAddress).to.equal(_contractAddress); 
        expect(myCustomer.siretNumber).to.be.bignumber.equal(_siretNumber); 
        expect(myCustomer.isActive).to.equal(true);   
    });   

});

contract('setLegislator', function (accounts) {

    const owner = accounts[0];    
    const other = accounts[1];    
    const _customerAddress = accounts[2];
    const _contractAddress = accounts[3];
    const _techMasterAddress = accounts[4];
    const _legislatorAddress = accounts[5];
    const _siretNumber = new BN(12345678910111);
    const address0 = "0x0000000000000000000000000000000000000000";
    const _customer1 = 'Alan';
    const _legislator1 = 'Thierry';

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new({from: owner});
    });

    it('Revert if other : onlyOwner', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        await (expectRevert(this.LedgerContract.setLegislator(
            _legislator1,
            _legislatorAddress,         
            _siretNumber,
            true, 
            {from: other}), "Ownable: caller is not the owner"));  
    });

    it('Legislator properly set', async function () { 
        // On procède à l'ajout d'un Customer
        await this.LedgerContract.setLegislator(
            _legislator1,
            _legislatorAddress,         
            _siretNumber,
            true, 
            {from: owner});
        let myLegislator = await this.LedgerContract._legislators(_legislatorAddress);   
        expect(myLegislator.description).to.equal(_legislator1);  
        expect(myLegislator.siretNumber).to.be.bignumber.equal(_siretNumber); 
        expect(myLegislator.isActive).to.equal(true);   
    });   

});

contract('setTechMaster', function (accounts) {

    const owner = accounts[0];    
    const other = accounts[1];    
    const _customerAddress = accounts[2];
    const _contractAddress = accounts[3];
    const _techMasterAddress = accounts[4];
    const _legislatorAddress = accounts[5];
    const _siretNumber = new BN(12345678910111);
    const address0 = "0x0000000000000000000000000000000000000000";
    const _customer1 = 'Alan';
    const _legislator1 = 'Thierry';
    const _techMaster1 = 'Patrick';

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new({from: owner});
    });

    it('Revert if other : onlyOwner', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        await (expectRevert(this.LedgerContract.setTechMaster(
            _techMaster1,
            _techMasterAddress,       
            _siretNumber,
            true, 
            {from: other}), "Ownable: caller is not the owner"));  
    });

    it('TechMaster properly set', async function () { 
        // On procède à l'ajout d'un Customer
        await this.LedgerContract.setTechMaster(
            _techMaster1,
            _techMasterAddress,   
            _siretNumber,
            true, 
            {from: owner});
        let myTechMaster = await this.LedgerContract._techMasters(_techMasterAddress);   
        expect(myTechMaster.description).to.equal(_techMaster1); 
        expect(myTechMaster.siretNumber).to.be.bignumber.equal(_siretNumber); 
        expect(myTechMaster.isActive).to.equal(true);   
    });   

});

contract('setTypeMeasure', function (accounts) {

    const owner = accounts[0];    
    const other = accounts[1];    
    const _customerAddress = accounts[2];
    const _contractAddress = accounts[3];
    const _techMasterAddress = accounts[4];
    const _legislatorAddress = accounts[5];
    const _siretNumber = new BN(12345678910111);
    const address0 = "0x0000000000000000000000000000000000000000";
    const _customer1 = 'Alan';
    const _legislator1 = 'Thierry';
    const _techMaster1 = 'Patrick';
    const _typeMeasure1 = 'eau air feu';
    const _info = 'tous les jours'
    const _codeMeasure = "0xABCD123400000000";

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new({from: owner});
    });

    it('Revert if other : onlyOwner', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        await (expectRevert(this.LedgerContract.setTypeMeasure(
            _typeMeasure1,      
            _info,
            _codeMeasure,
            true,
            true, 
            {from: other}), "Ownable: caller is not the owner"));  
    });

    it('Measure properly set', async function () { 
        // On procède à l'ajout d'un Customer
        await this.LedgerContract.setTypeMeasure(
            _typeMeasure1, 
            _info,
            _codeMeasure,
            true,
            true, 
            {from: owner});
        let myTechMaster = await this.LedgerContract._typeMeasures(_codeMeasure);   
        expect(myTechMaster.description).to.equal(_typeMeasure1); 
        expect(myTechMaster.info).to.equal(_info); 
        expect(myTechMaster.isActive).to.equal(true);  
        expect(myTechMaster.isAllowed).to.equal(true);
    });   

});