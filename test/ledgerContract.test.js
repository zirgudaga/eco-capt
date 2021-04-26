const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const LedgerContract = artifacts.require('LedgerContract.sol');
const ECPToken = artifacts.require('ECPToken.sol')

contract('LedgerContract', function (accounts) {

    const owner = accounts[0];    
    const other = accounts[1];    
    const _customerAddress = accounts[2];
    const _contractAddress = accounts[3];
    const _techMasterAddress = accounts[4];
    const _legislatorAddress = accounts[5];
    const _bridgeAddress = accounts[6];
    const _siretNumber1 = new BN(12345678910111);
    const _siretNumber2 = new BN(12345678910141);
    const address0 = "0x0000000000000000000000000000000000000000";
    const _customer = 'Alan';
    const _legislator = 'Thierry';    
    const _techMaster = 'Patrick';
    const _bridgeName1 = 'Bridge1';
    const _bridgeName2 = 'Bridge2';
    const _url = '56.98.44.12';
    const _infoBridge = 'Server Nodes, model 41';           
    const _typeMeasure = 'eau air feu';
    const _infoMeasure1 = 'tous les jours';
    const _infoMeasure2 = 'toutes les heures';
    const _codeMeasure = "0xABCD123400000000";

    let _tokenAddress;
    let _ledgerAddress;


    beforeEach(async function () {
        this.ECPToken = await ECPToken.new({from: owner});
        _tokenAddress = this.ECPToken.address;

        this.LedgerContract = await LedgerContract.new(_tokenAddress, {from: owner});
        _ledgerAddress = this.LedgerContract.address;

        await this.ECPToken.setLedgerAddress(_ledgerAddress, {from: owner});
    });

    describe("setCustomer", function() {

        it('Revert if other : onlyOwner', async function () { 

            await (expectRevert(this.LedgerContract.setCustomer(
                _customer,
                _customerAddress,
                _contractAddress,         
                _siretNumber1,
                true, 
                {from: other}), "Ownable: caller is not the owner"));  
        });

        it('New customer properly set', async function () { 

            await this.LedgerContract.setCustomer(
                _customer,
                _customerAddress,
                _contractAddress,         
                _siretNumber1,
                true, 
                {from: owner});
            let myCustomer = await this.LedgerContract._customers(_customerAddress);   
            expect(myCustomer.description).to.equal(_customer); 
            expect(myCustomer.contractAddress).to.equal(_contractAddress); 
            expect(myCustomer.siretNumber).to.be.bignumber.equal(_siretNumber1); 
            expect(myCustomer.isActive).to.equal(true);  
            expect(myCustomer.exist).to.equal(true);              
        });   
    });
    
    describe('setLegislator', function () {

        it('Revert if other : onlyOwner', async function () { 

            await (expectRevert(this.LedgerContract.setLegislator(
                _legislator,
                _legislatorAddress,         
                _siretNumber1,
                true, 
                {from: other}), "Ownable: caller is not the owner"));  
        });

        it('New legislator properly set', async function () { 

            let receipt = await this.LedgerContract.setLegislator(
                _legislator,
                _legislatorAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            expectEvent(receipt, "LedgerUpdate", {_message: 'New Legislator', _author: owner });

            let myLegislator = await this.LedgerContract._legislators(_legislatorAddress);   
            expect(myLegislator.description).to.equal(_legislator);  
            expect(myLegislator.siretNumber).to.be.bignumber.equal(_siretNumber1); 
            expect(myLegislator.isActive).to.equal(true);   
            expect(myLegislator.exist).to.equal(true); 
        });  
        
        it('Legislator properly updated', async function () { 

            await this.LedgerContract.setLegislator(
                _legislator,
                _legislatorAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            let receipt = await this.LedgerContract.setLegislator(
                _legislator,
                _legislatorAddress,         
                _siretNumber2,
                true, 
                {from: owner});

            expectEvent(receipt, "LedgerUpdate", {_message: 'Update Legislator', _author: owner });

            let myLegislator = await this.LedgerContract._legislators(_legislatorAddress);   
            expect(myLegislator.siretNumber).to.be.bignumber.equal(_siretNumber2); 
        });          
    });
   
    describe('setTechMaster', function () {

        it('Revert if other : onlyOwner', async function () { 

            await (expectRevert(this.LedgerContract.setTechMaster(
                _techMaster,
                _techMasterAddress,       
                _siretNumber1,
                true, 
                {from: other}), "Ownable: caller is not the owner"));  
        });

        it('New techMaster properly set', async function () { 

            let receipt = await this.LedgerContract.setTechMaster(
                _techMaster,
                _techMasterAddress,   
                _siretNumber1,
                true, 
                {from: owner});

            expectEvent(receipt, "LedgerUpdate", {_message: 'New TechMaster', _author: owner });    

            let myTechMaster = await this.LedgerContract._techMasters(_techMasterAddress);   
            expect(myTechMaster.description).to.equal(_techMaster); 
            expect(myTechMaster.siretNumber).to.be.bignumber.equal(_siretNumber1); 
            expect(myTechMaster.isActive).to.equal(true);   
            expect(myTechMaster.exist).to.equal(true);   
        });   

        it('TechMaster properly updated', async function () { 

            await this.LedgerContract.setTechMaster(
                _techMaster,
                _techMasterAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            let receipt = await this.LedgerContract.setTechMaster(
                _techMaster,
                _techMasterAddress,         
                _siretNumber2,
                true, 
                {from: owner});

            expectEvent(receipt, "LedgerUpdate", {_message: 'Update TechMaster', _author: owner });

            let myTechMaster = await this.LedgerContract._techMasters(_techMasterAddress);   
            expect(myTechMaster.siretNumber).to.be.bignumber.equal(_siretNumber2); 
        });      
    });

    describe('setBridge', function () {

        it('Revert if other : onlyTechMaster', async function () { 

            await (expectRevert(this.LedgerContract.setBridge(
                _bridgeName1 ,
                _url,       
                _infoBridge,
                _bridgeAddress,
                _techMasterAddress,
                true, 
                {from: other}), "Access denied"));  
        });

        it('New bridge properly set', async function () { 

            await this.LedgerContract.setTechMaster(
                _techMaster,
                _techMasterAddress,   
                _siretNumber1,
                true, 
                {from: owner});

            let receipt = await this.LedgerContract.setBridge(
                _bridgeName1,
                _url,       
                _infoBridge,
                _bridgeAddress,
                _techMasterAddress,                
                true, 
                {from: _techMasterAddress});

            expectEvent(receipt, "LedgerUpdate", {_message: 'New Bridge', _author: _techMasterAddress });

            let myBridge = await this.LedgerContract._bridges(_bridgeAddress);   
            expect(myBridge.description).to.equal(_bridgeName1); 
            expect(myBridge.url).to.equal(_url); 
            expect(myBridge.info).to.equal(_infoBridge); 
            expect(myBridge.techMasterAddress).to.equal(_techMasterAddress); 
            expect(myBridge.isActive).to.equal(true);  
            expect(myBridge.exist).to.equal(true);              
        });   

        it('Bridge properly updated', async function () { 

            await this.LedgerContract.setTechMaster(
                _techMaster,
                _techMasterAddress,   
                _siretNumber1,
                true, 
                {from: owner});

            await this.LedgerContract.setBridge(
                _bridgeName1,
                _url,       
                _infoBridge,
                _bridgeAddress,
                _techMasterAddress,                
                true,
                {from: owner});

            let receipt = await this.LedgerContract.setBridge(
                _bridgeName2,
                _url,       
                _infoBridge,
                _bridgeAddress,
                _techMasterAddress,                
                true,
                {from: _techMasterAddress});

            expectEvent(receipt, "LedgerUpdate", {_message: 'Update Bridge', _author: _techMasterAddress });

            let myBridge = await this.LedgerContract._bridges(_bridgeAddress);   
            expect(myBridge.description).to.equal(_bridgeName2); 
        });     

    });

    describe('setTypeMeasure', function () {

        it('Revert if other : onlyOwner', async function () { 
            // On vérifie bien que l'ajout provoque un revert !
            await (expectRevert(this.LedgerContract.setTypeMeasure(
                _typeMeasure,      
                _infoMeasure1,
                _codeMeasure,
                true,
                true, 
                {from: other}), "Ownable: caller is not the owner"));  
        });

        it('New measure properly set', async function () { 
            // On procède à l'ajout d'un Customer
            let receipt = await this.LedgerContract.setTypeMeasure(
                _typeMeasure, 
                _infoMeasure1,
                _codeMeasure,
                true,
                true, 
                {from: owner});

            expectEvent(receipt, "TypeMeasureUpdate", {_message: 'New TypeMeasure', _author: owner });

            let myTechMaster = await this.LedgerContract._typeMeasures(_codeMeasure);   
            expect(myTechMaster.description).to.equal(_typeMeasure); 
            expect(myTechMaster.info).to.equal(_infoMeasure1); 
            expect(myTechMaster.isActive).to.equal(true);  
            expect(myTechMaster.isAllowed).to.equal(true);
            expect(myTechMaster.exist).to.equal(true);
        });   

        it('TypeMeasure properly updated', async function () { 
            // On procède à l'ajout d'un Customer
            await this.LedgerContract.setTypeMeasure(
                _typeMeasure, 
                _infoMeasure1,
                _codeMeasure,
                true,
                true, 
                {from: owner});

            let receipt = await this.LedgerContract.setTypeMeasure(
                _typeMeasure, 
                _infoMeasure2,
                _codeMeasure,
                true,
                true, 
                {from: owner});

            expectEvent(receipt, "TypeMeasureUpdate", {_message: 'Update TypeMeasure', _author: owner });

            let myBridge = await this.LedgerContract._typeMeasures(_codeMeasure);   
            expect(myBridge.info).to.equal(_infoMeasure2); 
        });    
    }); 
    
    describe('rootingApps', function () {

        const adminTypeUser = new BN(1);
        const customerTypeUser = new BN(2);
        const lesgislatorTypeUser = new BN(3);
        const technmasterTypeUser = new BN(4);
        const publicTypeUser = new BN(5);

        // Check administrator detected
        it('Detect Administrator', async function () { 
            let returnRootingApps = await this.LedgerContract.rootingApps({from: owner});
            expect(returnRootingApps).to.be.bignumber.equal(adminTypeUser);
        });
        
        // Check administrator detected
        it('Detect Customer', async function () { 
            await this.LedgerContract.setCustomer(
                _customer,
                _customerAddress,
                _contractAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            let returnRootingApps = await this.LedgerContract.rootingApps({from: _customerAddress});
            expect(returnRootingApps).to.be.bignumber.equal(customerTypeUser);
        });

        // Check administrator detected
        it('Detect Legislator', async function () { 
            await this.LedgerContract.setLegislator(
                _legislator,
                _legislatorAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            let returnRootingApps = await this.LedgerContract.rootingApps({from: _legislatorAddress});
            expect(returnRootingApps).to.be.bignumber.equal(lesgislatorTypeUser);
        });

        // Check Techmaster detected
        it('Detect Techmaster', async function () { 
            await this.LedgerContract.setTechMaster(
                _techMaster,
                _techMasterAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            let returnRootingApps = await this.LedgerContract.rootingApps({from: _techMasterAddress});
            expect(returnRootingApps).to.be.bignumber.equal(technmasterTypeUser);
        });

        it('Detect Public', async function () { 
            let returnRootingApps = await this.LedgerContract.rootingApps({from: other});
            expect(returnRootingApps).to.be.bignumber.equal(publicTypeUser);
        });        

    });     

    describe('mintECP', function () {

        const token_0 = new BN(0);
        const token_100 = new BN(100);

        it('Revert if other : onlyOwner', async function () { 
            // On vérifie bien que l'ajout provoque un revert !
            await (expectRevert(this.LedgerContract.mintECP(
                _customerAddress,      
                100, 
                {from: other}), "Ownable: caller is not the owner"));  
        });        

        it('Mint is correctly success', async function () { 
            await this.LedgerContract.setCustomer(
                _customer,
                _customerAddress,
                _contractAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            let balanceOfCustomer = await this.ECPToken.balanceOf(_customerAddress);
            
            expect(balanceOfCustomer).to.be.bignumber.equal(token_0);

            await this.LedgerContract.mintECP(
                _customerAddress,      
                100, 
                {from: owner});  

            balanceOfCustomer = await this.ECPToken.balanceOf(_customerAddress);    
            expect(balanceOfCustomer).to.be.bignumber.equal(token_100);
        });
    }); 

    describe('sendClientToken', function () {

        const token_0 = new BN(0);
        const token_100 = new BN(100);

        it('Revert if other : onlyOwner', async function () { 
            // On vérifie bien que l'ajout provoque un revert !
            await (expectRevert(this.LedgerContract.sendClientToken(
                _customerAddress,      
                100, 
                {from: other}), "Ownable: caller is not the owner"));  
        });     
        
        it('Revert if other : Customer not exist', async function () { 
            // On vérifie bien que l'ajout provoque un revert !
            await (expectRevert(this.LedgerContract.sendClientToken(
                _customerAddress,      
                100, 
                {from: owner}), "Customer not exist"));  
        });   

        it('SendClientToken is correctly success with Mint', async function () { 
            await this.LedgerContract.setCustomer(
                _customer,
                _customerAddress,
                _contractAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            let balanceOfLedger = await this.ECPToken.balanceOf(_ledgerAddress);
            expect(balanceOfLedger).to.be.bignumber.equal(token_0);

            let myCustomer = await this.LedgerContract._customers(_customerAddress);  
            let balanceOfCustomer = await this.ECPToken.balanceOf(myCustomer.contractAddress);
            expect(balanceOfCustomer).to.be.bignumber.equal(token_0);

            await this.LedgerContract.sendClientToken(
                _customerAddress,      
                100, 
                {from: owner});  

            balanceOfCustomer = await this.ECPToken.balanceOf(myCustomer.contractAddress);    
            expect(balanceOfCustomer).to.be.bignumber.equal(token_100);
        });

        it('SendClientToken is correctly success with Transfert', async function () { 
            await this.LedgerContract.setCustomer(
                _customer,
                _customerAddress,
                _contractAddress,         
                _siretNumber1,
                true, 
                {from: owner});

            await this.LedgerContract.mintECP(
                _ledgerAddress,      
                100, 
                {from: owner});  

            let balanceOfLedger = await this.ECPToken.balanceOf(_ledgerAddress);
            expect(balanceOfLedger).to.be.bignumber.equal(token_100);

            let myCustomer = await this.LedgerContract._customers(_customerAddress);  
            let balanceOfCustomer = await this.ECPToken.balanceOf(myCustomer.contractAddress);
            expect(balanceOfCustomer).to.be.bignumber.equal(token_0);

            await this.LedgerContract.sendClientToken(
                _customerAddress,      
                100, 
                {from: owner});  

            balanceOfCustomer = await this.ECPToken.balanceOf(myCustomer.contractAddress);    
            expect(balanceOfCustomer).to.be.bignumber.equal(token_100);

            balanceOfLedger = await this.ECPToken.balanceOf(_ledgerAddress);    
            expect(balanceOfLedger).to.be.bignumber.equal(token_0);
        });
    }); 
});