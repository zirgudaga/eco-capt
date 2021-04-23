import json
import os
import sys
from pprint import pprint
from typing import List, Optional

from dotenv import load_dotenv
from eth_utils import event_abi_to_log_topic
from hdwallet import BIP44HDWallet
from hdwallet.cryptocurrencies import EthereumMainnet
from hdwallet.derivations import BIP44Derivation
from hdwallet.utils import generate_mnemonic, is_mnemonic
from web3 import Web3
from web3._utils.events import get_event_data
from web3.contract import Contract

############# Env Variables #############

load_dotenv('.env')
INFURA_ID = os.getenv("INFURA_ID")
MNEMONIC = os.getenv("MNEMONIC")
SEED = os.getenv("SEED")
ABI = os.getenv("ABI")

############# HD WALLET #############


def generate_mnemonic_phrase(strength: int = 128, language: str = "english"):
    """ 
    strength : choose strength 128 (Default), 160, 192, 224 or 256
    language : choose language english (Default), french, italian, spanish, chinese_simplified, 
            chinese_traditional,japanese or korean
    """
    mnemonic = generate_mnemonic(language=LANGUAGE, strength=STRENGTH)
    return mnemonic


def generate_hdwallet(mnemonic: str = MNEMONIC, cryptocurrency=EthereumMainnet, passphrase: Optional[str] = None) -> BIP44HDWallet:
    """[summary]
    Args:
        cryptocurrency (hdwallet.cryptocurrencies, optional): crypto of the wallet. Defaults to EthereumMainnet.
        mnemonic (str, optional): mnemonic phrase from where we generate the wallet. Defaults to MNEMONIC.
        passphrase (Optional[str], optional): Secret passphrase/password for mnemonic. Defaults to None.
    Returns:
        BIP44HDWallet : wallet generate from mnemonic
    """

    ## Initialize Ethereum mainnet BIP44HDWallet
    bip44_hdwallet = BIP44HDWallet(cryptocurrency=EthereumMainnet)
    ## Get Ethereum BIP44HDWallet from mnemonic
    bip44_hdwallet.from_mnemonic(
        mnemonic=mnemonic, passphrase=passphrase
    )
    # print("Mnemonic:", bip44_hdwallet.mnemonic())

    ## Clean default BIP44 derivation indexes/paths
    bip44_hdwallet.clean_derivation()

    return bip44_hdwallet


def generate_list_adresses_keys(bip44_hdwallet: BIP44HDWallet, n_address: int) -> List[str]:
    list_of_addresses_keys = []
    for address_index in range(n_address):
        ## Derivation from Ethereum BIP44 derivation path
        bip44_derivation = BIP44Derivation(
            cryptocurrency=EthereumMainnet, account=0, change=False, address=address_index
        )
        ## Drive Ethereum HDWallet
        bip44_hdwallet.from_path(path=bip44_derivation)

        ## Append public and private key to the list
        list_of_addresses_keys.append(
            (bip44_hdwallet.address(), bip44_hdwallet.private_key()))

        # Clean derivation indexes/paths
        bip44_hdwallet.clean_derivation()

    return list_of_addresses_keys


def createBridgeWallet(mnemonic: str):
    hd_wallet = generate_hdwallet(mnemonic=mnemonic)
    account_infos = generate_list_adresses_keys(hd_wallet, 1)
    assert isinstance(account_infos, list)
    assert len(account_infos) == 1
    account_infos = account_infos[0]
    assert isinstance(account_infos, tuple)
    bridgeAddress = account_infos[0]
    private_key = account_infos[1]
    return bridgeAddress, private_key

############# WEB 3 #############


def generate_ganache_url() -> str:
    return "HTTP://127.0.0.1:7545"


def generate_ropsten_url(infura_id: str = INFURA_ID):
    return f"https://ropsten.infura.io/v3/{INFURA_ID}"


def create_web3_connection(url: str) -> Web3:
    web3 = Web3(Web3.HTTPProvider(url))
    return web3


def connectWeb3(infura_id: Optional[str] = None):
    if infura_id == None:
        url = generate_ganache_url()
    else:
        url = generate_ropsten_url(infura_id=infura_id)
    web3 = Web3(Web3.HTTPProvider(url))
    web3 = create_web3_connection(url)
    assert web3.isConnected()
    return web3

############# TRANSACTIONS #############


def generateContract(web3, contract_address: str, abi_str: str):
    contract_address = web3.toChecksumAddress(contract_address)
    abi = json.loads(abi_str)
    contract = web3.eth.contract(address=contract_address, abi=abi)
    return contract


def generate_tx_data_transfer(web3, addressFrom: str, addressTo: str, value: int, gas: int, gasPrice: int):
    nonce = web3.eth.get_transactionCount(addressFrom)
    tx_data_transfer = {
        "nonce": nonce,
        "to": addressTo,
        "value": web3.toWei(value, "ether"),
        "gas": gas,
        "gasPrice": web3.toWei(gasPrice, "gwei")
    }
    return tx_data_transfer


def generate_tx_data(web3, addressFrom: str):
    nonce = web3.eth.getTransactionCount(addressFrom)
    tx_data = {
        'nonce': nonce,
        'gas': 600000,
        'gasPrice': web3.toWei(3, 'gwei'),
    }
    return tx_data


def make_signed_transaction(web3: Web3, tx_data: dict, private_key: str):
    return web3.eth.account.signTransaction(tx_data, private_key)

############# CONTRACT FUNCTIONS #############

## SERVICE PART


def getServiceCounter(contract:Contract):
    """get num of services"""
    return contract.functions._serviceIdCounter().call()

def getServiceById(contract:Contract,_serviceId):
    """get a specific Service"""
    return contract.functions._services(_serviceId).call()
     

def getAllServicesFunct(contract:Contract):
    """get all Services"""
    _serviceIdCounter = getServiceCounter(contract)
    allServices = []
    for i in range(_serviceIdCounter):
        oneService = getServiceById(contract, i)
        allServices.append(oneService)
    return allServices

def setTechMasterAddressFunct(web3, contract:Contract, addressFrom: str, private_key: str, _serviceId: int, _techMasterAddress: str):
    """set a TechMasterAddress"""
    tx_data = generate_tx_data(web3, addressFrom=addressFrom)
    tx_data_built = contract.functions.setTechMasterAddress(_serviceId,
                                                            _techMasterAddress).buildTransaction(tx_data)
    signed_tx = make_signed_transaction(
        web3, tx_data_built, private_key=private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return tx_hash

def setBridgeAddressFunct(web3, contract:Contract, addressFrom: str, private_key:str, _serviceId: int, bridgeAddress: str):
    """set a BridgeAdress"""
    tx_data = generate_tx_data(web3, addressFrom=addressFrom)
    tx_data_built = contract.functions.setBridgeAddress(_serviceId,
                                                        bridgeAddress).buildTransaction(tx_data)
    signed_tx = make_signed_transaction(
        web3, tx_data_built, private_key=private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return tx_hash

## MEASURE PART

def addMeasureFunct(web3, contract:Contract, bridgeAddress: str, private_key: str, _serviceId: int, _measureHeader: str, _measurebody: str):
    """add a Measure"""
    tx_data = generate_tx_data(web3, addressFrom=bridgeAddress)
    tx_data_built = contract.functions.addMeasure(
        _serviceId=_serviceId,
        _measureHeader=_measureHeader,
        _measurebody=_measurebody).buildTransaction(tx_data)

    signed_tx = make_signed_transaction(
        web3, tx_data_built, private_key=private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return tx_hash


## RULE (ALERT CONFIG) PART
def getRuleIdCounter(contract:Contract):
    """get num of rules"""
    return contract.functions._ruleIdCounter().call()

def getServicesRuleById(contract:Contract, _serviceId: int):
    """get Rule of a specific Service"""
    return contract.functions._serviceRules(_serviceId).call()

def getAllServiceRulesFunct(contract:Contract,_serviceId:int):
    """get all Services Rule"""
    _ruleIdCounter = getRuleIdCounter(contract)
    allServicesRule = []
    for i in range(_ruleIdCounter):
        oneServiceRule = getServicesRuleById(contract, i)
        allServicesRule.append(oneServiceRule)
    return allServicesRule

## ALERTS PART

def addAlertFunct(web3, contract:Contract, bridgeAddress: str, private_key: str, _serviceId: int, _ruleId: int, _alertBody: str):
    """add an alert"""
    tx_data = generate_tx_data(web3, addressFrom=bridgeAddress)
    tx_data_built = contract.functions.addAlert(
        _serviceId =_serviceId,
        _ruleId =_ruleId,
        _alertBody = _alertBody).buildTransaction(tx_data)

    signed_tx = make_signed_transaction(
        web3, tx_data_built, private_key=private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return tx_hash


def getAlertsFunct(contract:Contract,_serviceId:int)->list:
    """get all alerts of a specific alerteConfig"""
    _ruleId = contract.functions.getAlerts(_serviceId)
    return _ruleId


## FREQUENCY AND VALUE ALERT PART

def getFrequencyServiceById(contract:Contract,_serviceId:int)->str:
    oneService = getServiceById(contract,_serviceId)
    timeCode = oneService[2].decode('ascii')
    assert timeCode in ['i','H','d','m','Y']
    nbTime = oneService[3]
    return f"{nbTime} {timeCode}"

def getValueAlertServiceRuleById(contract:Contract,_serviceId:int)->int:
    oneServiceRule = getServicesRuleById(contract, _serviceId)
    valueAlert = oneServiceRule[7].decode('ascii')
    assert valueAlert.isnumeric()
    return int(valueAlert)

def getCodeAlertServiceRuleById(contract:Contract,_serviceId:int):
    oneServiceRule = getServicesRuleById(contract, _serviceId)
    codeAlert = oneServiceRule[6].decode('ascii')
    return codeAlert

############# EVENTS PART #############

def fetch_events(web3,contract: Contract, fromBlock, toBlock=None):
    topic2abi = {event_abi_to_log_topic(_): _
                    for _ in contract.abi if _['type'] == 'event'}

    logs = web3.eth.getLogs(dict(
        address=contract.address,
        fromBlock=fromBlock,
        toBlock=toBlock
    ))

    for entry in logs:
        topic0 = entry['topics'][0]
        if topic0 in topic2abi:
            yield get_event_data(web3.codec, topic2abi[topic0], entry)

def getAllEventByName(web3, contract:Contract, contractEventName, fromBlock=0, toBlock='latest'):
    assert contractEventName in ["ContractUpdate","ServiceUpdate","ServiceRulesUpdate","MeasureReceive","AlertReceive","ServiceIotUpdate"]
    event_generator = fetch_events(web3,contract,fromBlock,toBlock)
    list_all_event = []
    while True:
        try:
            event = next(event_generator)
            if event['event'] == contractEventName:
                list_all_event.append(event)
        except:
            break
    return list_all_event


