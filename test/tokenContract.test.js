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
    const prevContrat = accounts[6];
    const bridge = accounts[7];

    const _version = "0x0102030405060708";   

    let BN0 = new BN(0);
    let BN1 = new BN(1);

    let _tokenAddress = "0x0000000000000000000000000000000000000000";
    let _ledgerAddress = "0x0000000000000000000000000000000000000000";
    let _contractAddress = "0x0000000000000000000000000000000000000000";    

    const token_0 = new BN(0);
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

        let testAccessMessage= ['Client', 'Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [customer1 , legislator , techmaster, bridge ];
            
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

        let testAccessMessage= ['Client', 'Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [customer1 , legislator , techmaster, bridge];
            
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