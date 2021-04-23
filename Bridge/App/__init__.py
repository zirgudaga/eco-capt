import json
import os
import sys

sys.path.append('./App')
import datetime as dt
import time

import numpy as np
from flask import Flask, jsonify, redirect, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy
from web3.contract import Contract

from scripts.sensors_funct import (choose_one_measure, generate_alertBody,
                                   generate_measureBody,
                                   generate_measureHeader,
                                   load_measure_config_example,
                                   generate_one_measure,generate_one_alert)

from scripts.show_data_req_funct import addAlertPost_v0, addMeasurePost_v0

from scripts.smart_contract_funct import (addAlertFunct, addMeasureFunct,
                                          connectWeb3, createBridgeWallet,
                                          generateContract,
                                          getFrequencyServiceById,
                                          getValueAlertServiceRuleById,
                                          getCodeAlertServiceRuleById,
                                          setBridgeAddressFunct,
                                          setTechMasterAddressFunct)

from scripts.utils import (convertFrequencyToSec, detect_strptime,
                           readSensorsDatabase,detectEachFrequency,statsSensorsData)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']="sqlite:///sensors_data.db"

# Initialize Database
db = SQLAlchemy(app)

# Create Database Model
class SensorsDatabase(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=dt.datetime.utcnow)
        
    # Create fonction to return a string when we add something
    def __repr__(self):
        return "<Name %r>" % self.id

# Verify Env Variable exists
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

app.config["_serviceId"] = 1
app.config["frequency"] = 3600 # by default 1H = 3600s
app.config["dateLastQuery"] = "2021-04-01 10:10:00" 

def get_frequency(current_frequency:int,contract:Contract,_serviceId:int):
    frequency = getFrequencyServiceById(contract,_serviceId)
    frequency = convertFrequencyToSec(frequency)
    if frequency != current_frequency:
        app.config["frequency"] = frequency
    return frequency

def get_value_alert(contract:Contract, _serviceId:int):
    return getValueAlertServiceRuleById(contract,_serviceId)

def map_serviceId_to_measure(_serviceId:int,humidity,temperature):
    if _serviceId == 0: 
        dataMeasured = humidity
    elif _serviceId == 1:
        dataMeasured = temperature
    
    return dataMeasured

@app.route('/')
def index():
    title = "Eco-Capt-Bridge - Home"
    return render_template("index.html",title=title)

############# OWNER & TECHMASTER PART #############
@app.route('/registerRole', methods=['GET', 'POST'])
def registerRole():
    title = "Eco-Capt-Bridge - Register Role Address"
    if request.method == "POST":
        infura_id = app.config["INFURA_ID"]
        seed = app.config["SEED"]
        contract_address = app.config["CONTRACT_ADRESS"]
        abi_str = app.config["ABI"]
        web3 = connectWeb3(infura_id=infura_id)
        bridgeAddress, private_key = createBridgeWallet(mnemonic=seed)
        contract = generateContract(web3, contract_address, abi_str)
        
        if "setTechMaster" in request.form:

            _serviceId = int(request.form["serviceId"])
            _techMasterAddress = request.form["techMasterAdress"]

            setTechMasterAddressFunct(
                web3=web3,
                contract=contract,
                addressFrom=bridgeAddress,
                private_key=private_key,
                _serviceId=_serviceId,
                _techMasterAddress=_techMasterAddress
            )
        
        elif "bridgeAddress" in request.form:
            
            _serviceId = int(request.form["serviceId"])
            _techMasterAddress = request.form["bridgeAddress"]

            setBridgeAddressFunct(
                web3=web3,
                contract=contract,
                addressFrom=bridgeAddress,
                private_key=private_key,
                _serviceId=_serviceId,
                _techMasterAddress=_techMasterAddress
            )
        return render_template("registerRole.html", title=title)
        
    else:
        return render_template("registerRole.html", title=title)

############# ADD PART MANUALLY #############
@app.route('/send_tx',methods=['GET','POST'])
def send_tx():
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
        return render_template("send_tx.html", title=title)

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
    
    while n < 1:
        app.logger.info("Sending Data...")
        data = request.get_json()
        if data == None:
            measure_config = load_measure_config_example()
            one_measure = choose_one_measure(measure_config)
            _measureHeader = generate_measureHeader(one_measure)
            _measureBody = generate_measureBody(one_measure)
            _serviceId = app.config["_serviceId"]
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
        time.sleep(30)
        try:
            web3.eth.waitForTransactionReceipt(tx_hash)
        except:
            time.sleep(30)
        n += 1

    return redirect(url_for("send_tx"))

@app.route('/addAlert',methods=['GET','POST'])
def addAlert():
    infura_id = app.config["INFURA_ID"]
    seed = app.config["SEED"]
    contract_address = app.config["CONTRACT_ADRESS"]
    abi_str = app.config["ABI"]
    web3 = connectWeb3(infura_id=infura_id)
    bridgeAddress, private_key = createBridgeWallet(mnemonic=seed)
    contract = generateContract(web3, contract_address, abi_str)
 
    app.logger.info("Sending Alert...")
    data = request.get_json()
    if data == None:
        # measure_config = load_measure_config_example()
        # one_measure = choose_one_measure(measure_config)
        one_measure ={
            "_alertBody": {
                "version": "00.01.00",
                "codeAlert": "0001",
                "date": dt.datetime.now().strftime('%Y%m%d%H%M'),
                "valueAlert": "00000030"
            }
        }
        _alertBody = generate_alertBody(one_measure)
        _ruleId = 0
        _serviceId = app.config["_serviceId"]
    else :
        _serviceId = data["_serviceId"]
        _ruleId = data["_ruleId"]
        _alertBody = data["_alertBody"]

    tx_hash = addAlertFunct(
        web3=web3,
        contract=contract,
        bridgeAddress=bridgeAddress,
        private_key=private_key,
        _serviceId=_serviceId,
        _ruleId = _ruleId,
        _alertBody=_alertBody
    )

    app.logger.info("Alert Sent to the Blockchain")
    time.sleep(20)
    try:
        web3.eth.waitForTransactionReceipt(tx_hash)
    except:
        time.sleep(30)

    return redirect(url_for("send_tx"))

############# SHOW EXAMPLES PART #############
@app.route('/printMeasure',methods=['GET','POST'])
def printMeasure():
    app.logger.info("Show Measure")
    data = request.get_json()
    if data == None:
        measure_config = load_measure_config_example()
        one_measure = choose_one_measure(measure_config)
        _measureHeader = generate_measureHeader(one_measure)
        _measureBody = generate_measureBody(one_measure)

        resp = addMeasurePost_v0(endpoint='printMeasure',_serviceId=0,_measureHeader=_measureHeader,_measureBody=_measureBody)
        data = resp.json()

    return jsonify(data)

@app.route('/printAlert',methods=['GET','POST'])
def printAlert():
    app.logger.info("Show Alert")
    data = request.get_json()
    if data == None:
        measure_config = load_measure_config_example()
        one_measure = choose_one_measure(measure_config)
        _alertBody = generate_alertBody(one_measure)

        resp = addAlertPost_v0(endpoint='printAlert',_serviceId=0,_ruleId = 0,_alertBody=_alertBody)
        data = resp.json()

    return jsonify(data)

###############################################
############# SENSORS BRIDGE PART #############
###############################################

@app.route('/sensors', methods=['GET','POST'])
def sensors():
    title = title = "Eco-Capt-Bridge - Sensors Data"

    ## Blockchain tx
    infura_id = app.config["INFURA_ID"]
    seed = app.config["SEED"]
    contract_address = app.config["CONTRACT_ADRESS"]
    abi_str = app.config["ABI"]
    
    ## Infos for Sensors
    dateLastQuery = app.config["dateLastQuery"]
    date_to = dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')    
    frequency = app.config["frequency"]
    app.logger.info(
        f"\n\ndateLastQuery: {dateLastQuery}\ndate_to: {date_to}\nfrequency: {frequency}\n")
    
    if request.method == "POST":

        ##### STORAGE DATA PART #####
        data = request.get_json()
        if data == None:
            data = request.form
        app.logger.info(f"\n\n{data}\n")
        
        if "clear_db" in data :
            try:
                num_rows_deleted = db.session.query(SensorsDatabase).delete()
                app.logger.info(f"\n\n{num_rows_deleted}\n")
                db.session.commit()
            except:
                db.session.rollback()

            return redirect(url_for("sensors"))
    
        else:
            # add_to_db
            _serviceId = int(data["_serviceId"])
            humidity = float(data["humidity"])
            temperature = float(data["temperature"])
            timestamp= data["timestamp"]
            assert humidity != None and temperature != None and timestamp != None
            try:
                timestamp = detect_strptime(timestamp)  # '%Y-%m-%d %H:%M:%S' format
            except:
                return "THE DATE FORMAT IS NOT GOOD"          

            news_sensors_data = SensorsDatabase(temperature=temperature,humidity=humidity,timestamp=timestamp)
            try :
                db.session.add(news_sensors_data)
                db.session.commit()
            except:
                return "<h1> ERROR WITH THE ADDING TO DATABASE <h1/>"
            
            ## TX INFO
            web3 = connectWeb3(infura_id=infura_id)
            contract = generateContract(web3, contract_address, abi_str)
            bridgeAddress, private_key = createBridgeWallet(mnemonic=seed)
            timestamp = timestamp.strftime('%Y%m%d%H%M')

            ## MAPPING SERVICE Id TO MEASURES ##
            dataMeasured = map_serviceId_to_measure(_serviceId,humidity,temperature)

            ##### CERTIFICATION (ALERT) PART #####
            current_value_alert = getValueAlertServiceRuleById(contract,_serviceId)
            app.logger.info(f"\n{current_value_alert}\n")

            if dataMeasured > current_value_alert :
                
                app.logger.info("\n\nSending Alert...\n")
                
                codeAlert = getCodeAlertServiceRuleById(contract,_serviceId)
                one_alert = generate_one_alert(codeAlert=codeAlert,valueAlert=dataMeasured,timestamp=timestamp)
                _ruleId = 0
                _alertBody = generate_alertBody(one_alert)

                tx_hash = addAlertFunct(
                    web3=web3,
                    contract=contract,
                    bridgeAddress=bridgeAddress,
                    private_key=private_key,
                    _serviceId=_serviceId,
                    _ruleId = _ruleId,
                    _alertBody=_alertBody
                )

                app.logger.info("\n\nAlert Sent to the Blockchain\n")
                time.sleep(10)
                try:
                    web3.eth.waitForTransactionReceipt(tx_hash)
                except:
                    time.sleep(30)

            ##### CERTIFICATION (MEASURES) PART #####
            timeSendMeasure = detectEachFrequency(dateLastQuery,frequency)
            app.logger.info(f"\n\ntimeSendMeasure:{timeSendMeasure}\n")
            
            if timeSendMeasure :

                sensors_data = readSensorsDatabase(SensorsDatabase,date_from=dateLastQuery,date_to=date_to)
                temperature_data = [d.temperature for d in sensors_data]

                maxValue,minValue,meanValue,medianValue = statsSensorsData(temperature_data)
                # measureType = 
                # timeCode = 
                # nbTime = 
                one_measure = generate_one_measure(maxValue,minValue,meanValue,medianValue,timestamp)
                _measureHeader = generate_measureHeader(one_measure)
                _measureBody = generate_measureBody(one_measure)


                app.logger.info(f"\n\nSend tx To Blockchain\n")
        
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
                time.sleep(10)
                try:
                    web3.eth.waitForTransactionReceipt(tx_hash)
                except:
                    time.sleep(10)

                app.config["dateLastQuery"] = date_to
                app.logger.info(
                    f"\n\napp.config['dateLastQuery']: {app.config['dateLastQuery']}\n")
            
            ##### READ INFOS FROM BLOCKCHAIN PART #####
        
        
        return redirect(url_for("sensors"))
    
    else: 
        # GET
        # sensors_data = db.session.query(SensorsDatabase).order_by(SensorsDatabase.timestamp)
        sensors_data = readSensorsDatabase(SensorsDatabase,date_from=dateLastQuery,date_to=date_to)
        temperature_data = [d.temperature for d in sensors_data]
        return render_template("sensors.html",title=title,sensors_data=sensors_data)


