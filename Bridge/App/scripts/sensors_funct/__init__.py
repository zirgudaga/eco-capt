import json
from typing import List
import random
import datetime as dt
from scripts.utils import stringToHex, hexToString

def load_measure_config_example(path_measure_config="App/scripts/sensors_funct/measures_config.json"):
    with open(path_measure_config,"r") as f:
        measure_config = json.loads(f.read())
    return measure_config

def choose_one_measure(measure_config:List[dict]):
    one_measure = random.choice(measure_config)
    return one_measure 
    
def generate_one_measure(maxValue:int,minValue:int,meanValue:int,medianValue:int,timestamp,version:str="00.01.00",measureType:str="SON_0001",timeCode:str="i",nbTime:str="001"):
    maxValue = str(maxValue)
    minValue = str(minValue)
    meanValue = str(meanValue)
    medianValue = str(medianValue)

    while len(maxValue)!=8:
        maxValue = "0"+maxValue
    while len(minValue)!=8:
        minValue = "0"+minValue
    while len(meanValue)!=8:
        meanValue = "0"+meanValue
    while len(medianValue)!=8:
        medianValue = "0"+medianValue
    one_measure = {
        "_measureHeader": {
            "version": version,
            "date": timestamp,
            "measureType":measureType ,
            "timeCode": timeCode,
            "nbTime": nbTime
        },
        "_measureBody": {
            "maxValue": maxValue,
            "minValue": minValue,
            "meanValue": meanValue,
            "medianValue": medianValue
        }
    }

    return one_measure

def generate_one_alert(codeAlert,valueAlert,timestamp,version:str="00.01.00"):
    one_alert = {
        "_alertBody": {
            "version": version,
            "codeAlert": codeAlert,
            "date": timestamp,
            "valueAlert":valueAlert
        }
    }
    return one_alert

    

def generate_measureHeader(one_measure:dict)->str:
    _measureHeader = one_measure["_measureHeader"]
    version = _measureHeader["version"]
    date = _measureHeader["date"]
    measureType = _measureHeader["measureType"]
    timeCode = _measureHeader["timeCode"]
    nbTime = _measureHeader["nbTime"]
    
    _measureHeader_hex = stringToHex(f"{version}{date}{measureType}{timeCode}{nbTime}")
    assert len(_measureHeader_hex) == 66,_measureHeader_hex
    return _measureHeader_hex

def generate_measureBody(one_measure:dict)->str:
    _measureBody = one_measure["_measureBody"]
    maxValue = _measureBody["maxValue"]
    minValue = _measureBody["minValue"]
    meanValue = _measureBody["meanValue"]
    medianValue = _measureBody["medianValue"]
    
    _measureBody_hex = stringToHex(f"{maxValue}{minValue}{meanValue}{medianValue}")
    assert len(_measureBody_hex) == 66,_measureBody_hex
    return _measureBody_hex

def generate_alertBody(one_alert: dict) -> str:
    _alertBody = one_alert["_alertBody"]
    version = _alertBody["version"]
    codeAlert = _alertBody["codeAlert"]
    date = _alertBody["date"]
    valueAlert = _alertBody["valueAlert"]
    
    _alerteConfig_hex = stringToHex(f"{version}{codeAlert}{date}{valueAlert}")
    assert len(_alerteConfig_hex) == 66,_alerteConfig_hex
    return _alerteConfig_hex

