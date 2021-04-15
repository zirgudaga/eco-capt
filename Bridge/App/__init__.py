import sys
import os
import json
sys.path.append('./App')
import time 
from flask import Flask,render_template
from flask import jsonify, request, url_for, redirect

from scripts.get_rpi_capteurs import load_measure_config_example, choose_one_measure
from scripts.get_rpi_capteurs import generate_alertBody,generate_measureBody,generate_measureHeader
from scripts.request_functions import addMeasurePost, addAlertPost

from scripts.tx_functions import createBridgeWallet, connectWeb3, generateContract, addAlertFunct, addMeasureFunct, setTechMasterAddress

app = Flask(__name__)

try :
    app.config["INFURA_ID"] = os.getenv("INFURA_ID")
    app.config["SEED"] = os.getenv("SEED")
    app.config["CONTRACT_ADRESS"] = os.getenv("CONTRACT_ADRESS")
    app.config["ABI"] = os.getenv("ABI")
    assert app.config["INFURA_ID"] != None and app.config["SEED"] != None
    assert app.config["CONTRACT_ADRESS"] != None and app.config["ABI"] != None
except :
    try :
        app.config["INFURA_ID"] = os.environ["INFURA_ID"]
        app.config["SEED"] = os.environ["SEED"]
        app.config["CONTRACT_ADRESS"] = os.environ["CONTRACT_ADRESS"]
        app.config["ABI"] = os.environ["ABI"]
        assert app.config["INFURA_ID"] != None and app.config["SEED"] != None
        assert app.config["CONTRACT_ADRESS"] != None and app.config["ABI"] != None
    except :
        print("error")
        assert False 


@app.route('/')
def index():
    title = "Eco-Capt-Bridge - Home"
    return render_template("index.html",title=title)


@app.route('/ownerPage', methods=['GET', 'POST'])
def ownerPage():
    title = "Eco-Capt-Bridge - Owner Page"
    if request.method == "POST":

        if "setTechMaster" in request.form:
            infura_id = app.config["INFURA_ID"]
            seed = app.config["SEED"]
            contract_address = app.config["CONTRACT_ADRESS"]
            abi_str = app.config["ABI"]
            web3 = connectWeb3(infura_id=infura_id)
            bridgeAddress, private_key = createBridgeWallet(mnemonic=seed)
            contract = generateContract(web3, contract_address, abi_str)

            _serviceId = int(request.form["serviceId"])
            _techMasterAddress = request.form["techMasterAdress"]

            setTechMasterAddress(
                web3=web3,
                contract=contract,
                addressFrom=bridgeAddress,
                private_key=private_key,
                _serviceId=_serviceId,
                _techMasterAddress=_techMasterAddress
            )
        return render_template("ownerPage.html", title=title)
    else:
        return render_template("ownerPage.html", title=title)


@app.route('/techMasterPage', methods=['GET', 'POST'])
def techMasterPage():
    title = "Eco-Capt-Bridge - techMasterPage"
    
    if request.method == "POST":
        if "bridgeAddress" in request.form:
            infura_id = app.config["INFURA_ID"]
            seed = app.config["SEED"]
            contract_address = app.config["CONTRACT_ADRESS"]
            abi_str = app.config["ABI"]
            web3 = connectWeb3(infura_id=infura_id)
            bridgeAddress, private_key = createBridgeWallet(mnemonic=seed)
            contract = generateContract(web3, contract_address, abi_str)

            _serviceId = int(request.form["serviceId"])
            _techMasterAddress = request.form["bridgeAddress"]

            setTechMasterAddress(
                web3=web3,
                contract=contract,
                addressFrom=bridgeAddress,
                private_key=private_key,
                _serviceId=_serviceId,
                _techMasterAddress=_techMasterAddress
            )
        return render_template("techMasterPage.html", title=title)
    else:
        return render_template("techMasterPage.html", title=title)

@app.route('/capteurs_v2',methods=['GET','POST'])
def capteurs_v2():
    title = "Eco-Capt-Bridge - Send Data"
    if request.method == "POST" :
        if "addMeasure" in request.form :
            return redirect(url_for("addMeasure"))
        elif "addAlert" in request.form:
            return redirect(url_for("addAlert"))
        
        elif "printMeasure" in request.form :
            return redirect(url_for("printMeasure"))
        elif "printAlert" in request.form :
            return redirect(url_for("printAlert"))

    else :
        return render_template("capteurs_v2.html", title=title)

@app.route('/addMeasure',methods=['GET','POST'])
def addMeasure():
    n=0
    infura_id = app.config["INFURA_ID"]
    seed = app.config["SEED"]
    contract_address = app.config["CONTRACT_ADRESS"]
    abi_str = app.config["ABI"]
    web3 = connectWeb3(infura_id=infura_id)
    bridgeAddress, private_key = createBridgeWallet(mnemonic=seed)
    contract = generateContract(web3, contract_address, abi_str)
    
    while n < 5:
        app.logger.info("Sending Data...")
        data = request.get_json()
        if data == None:
            measure_config = load_measure_config_example()
            one_measure = choose_one_measure(measure_config)
            _measureHeader = generate_measureHeader(one_measure)
            _measureBody = generate_measureBody(one_measure)
            _serviceId = 2
        else :
            _serviceId = data["_serviceId"]
            _measureHeader = data["_measureHeader"]
            _measureBody = data["_measureBody"]
        

        tx_hash = addMeasureFunct(
            web3=web3,
            contract=contract,
            bridgeAddress=bridgeAddress,
            private_key=private_key,
            _serviceId=_serviceId,
            _measureHeader=_measureHeader,
            _measurebody=_measureBody
            )
        app.logger.info("Data Sent to the Blockchain")
        time.sleep(20)
        try:
            web3.eth.waitForTransactionReceipt(tx_hash)
        except:
            time.sleep(30)
        n += 1

    return redirect(url_for("capteurs_v2"))

@app.route('/addAlert',methods=['GET','POST'])
def addAlert():
    n=0
    infura_id = app.config["INFURA_ID"]
    seed = app.config["SEED"]
    contract_address = app.config["CONTRACT_ADRESS"]
    abi_str = app.config["ABI"]
    web3 = connectWeb3(infura_id=infura_id)
    bridgeAddress, private_key = createBridgeWallet(mnemonic=seed)
    contract = generateContract(web3, contract_address, abi_str)
 
    while n < 5:
        app.logger.info("Sending Data...")
        data = request.get_json()
        if data == None:
            measure_config = load_measure_config_example()
            one_measure = choose_one_measure(measure_config)
            _alertBody = generate_alertBody(one_measure)
            _serviceId = 2
        else :
            _serviceId = data["_serviceId"]
            _alertBody = data["_alerteConfig"]

        tx_hash = addAlertFunct(
            web3=web3,
            contract=contract,
            bridgeAddress=bridgeAddress,
            private_key=private_key,
            _serviceId=_serviceId,
            _alertBody=_alertBody
        )

        app.logger.info("Data Sent to the Blockchain")
        time.sleep(20)
        try:
            web3.eth.waitForTransactionReceipt(tx_hash)
        except:
            time.sleep(30)

        n += 1

    return redirect(url_for("capteurs_v2"))

@app.route('/printMeasure',methods=['GET','POST'])
def printMeasure():
    app.logger.info("Show Measure")
    data = request.get_json()
    if data == None:
        measure_config = load_measure_config_example()
        one_measure = choose_one_measure(measure_config)
        _measureHeader = generate_measureHeader(one_measure)
        _measureBody = generate_measureBody(one_measure)

        resp = addMeasurePost(endpoint='printMeasure',_serviceId=0,_measureHeader=_measureHeader,_measureBody=_measureBody)
        data = resp.json()

    return jsonify(data)


@app.route('/printAlert',methods=['GET','POST'])
def printAlert():
    app.logger.info("Show Alert")
    data = request.get_json()
    if data == None:
        measure_config = load_measure_config_example()
        one_measure = choose_one_measure(measure_config)
        _alerteConfig = generate_alertBody(one_measure)

        resp = addAlertPost(endpoint='printAlert',_serviceId=0,_alerteConfig=_alerteConfig)
        data = resp.json()

    return jsonify(data)


