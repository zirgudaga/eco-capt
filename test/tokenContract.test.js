const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const CustomerContract = artifacts.require('CustomerContract.sol');
const LedgerContract = artifacts.require('LedgerContract.sol');
const ECPToken = artifacts.require('ECPToken.sol')


contract('ECPToken', function (accounts) {
    const owner = accounts[0]; 
    const legislator = accounts[1];
    const techmaster = accounts[2];
    const customer1 = accounts[3];      
    const customer2 = accounts[4];
    const other = accounts[5];
    const prevContrat = accounts[6];
    const bridge = accounts[7];

    const address0 = "0x0000000000000000000000000000000000000000";
    const _serviceId = '0';
    const _version = "0x0102030405060708";   
    const _description = "Description de test";
    const _measureType = "0x1112131415161718";            
    const _timeCode = "0x21";
    const _nbTime = "6";   
    const _measureHeader = "0x0102030405060708091011121314151601020304050607080910111213141516";
    const _measurebody = "0x0102030405060708091011121314151601020304050607080910111213141516";

    const _ruleId = '0';

    const _codeAlert = "0x11223344";
    const _valueAlert = "0x1112131415161718";     
    const _alertBody = "0x0102030405060708091011121314151601020304050607080910111213141516";

    let BN0 = new BN(0);
    let BN1 = new BN(1);

    let _tokenAddress = "0x0000000000000000000000000000000000000000";
    let _ledgerAddress = "0x0000000000000000000000000000000000000000";
    let _contractAddress = "0x0000000000000000000000000000000000000000";    

    const token_0 = new BN(0);
    const token_99 = new BN(99);
    const token_100 = new BN(100);

    beforeEach(async function () {

        this.ECPToken = await ECPToken.new({from: owner});
        _tokenAddress = this.ECPToken.address;

        this.LedgerContract = await LedgerContract.new(_tokenAddress, {from: owner});
        _ledgerAddress = this.LedgerContract.address;

        await this.ECPToken.setLedgerAddress(_ledgerAddress, {from: owner});

        this.CustomerContract = await CustomerContract.new(
            _version, 
            _ledgerAddress,
            _tokenAddress,
            customer1,
            prevContrat,
            0,
            {from: owner}
        );

        _contractAddress = this.CustomerContract.address;

        this.LedgerContract.setCustomer(
            "Client Test",
            customer1,
            _contractAddress,         
            1,
            true, 
            {from: owner});
    });

    describe('setLedgerAddress', function () {

        let testAccessMessage= ['Client', 'Legislator', 'TechMaster', 'Bridge', 'Other'];
        let testAccessAddress= [customer1 , legislator , techmaster, bridge , other ];
            
        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () {      
                await(expectRevert(this.ECPToken.setLedgerAddress(_ledgerAddress, {from: testAccessAddress[i]}), "Acces Token Denied"));     
            });
        }

        it('Set Ledger Address is properly', async function () {     
            await this.ECPToken.setLedgerAddress(_ledgerAddress, {from: owner});           
          
            let myReturn = await this.ECPToken.ledger(); 

            expect(myReturn).to.equal(_ledgerAddress);    
        });
    });

    describe('ownerMint', function () {      

        let testAccessMessage= ['Client', 'Legislator', 'TechMaster', 'Bridge', 'Other'];
        let testAccessAddress= [customer1 , legislator , techmaster, bridge , other ];
            
        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () {      
                await(expectRevert(this.ECPToken.ownerMint(customer1, 100, {from: testAccessAddress[i]}), "Acces Token Denied"));     
            });
        }

        it('Mint is properly - Owner', async function () {     

            let beforeBalance = await this.ECPToken.balanceOf(customer1);
            expect(beforeBalance).to.be.bignumber.equal(token_0);            

            await this.ECPToken.ownerMint(customer1, 100, {from: owner});           
          
            let afterBalance = await this.ECPToken.balanceOf(customer1);
            expect(afterBalance).to.be.bignumber.equal(token_100);     
        });
   
    });



    

    
});