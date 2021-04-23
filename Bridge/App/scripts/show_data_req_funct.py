## FUNCTIONS TO SHOW EXAMPLES OF MEASURES AND ALERTS
import requests

def addMeasurePost_v0(endpoint:str,_serviceId:int,_measureHeader:str,_measureBody:str):
    headers = {
        'Content-Type': 'application/json',
    }

    data = {
        "_serviceId":_serviceId, 
        "_measureHeader":_measureHeader,
        "_measureBody":_measureBody
        }

    response = requests.post(f'http://127.0.0.1:5000/{endpoint}', headers=headers, json=data)
    assert response.status_code == 200,response.status_code
    return response

def addMeasurePost(endpoint:str,_serviceId:int,_measureHeader:str,_measureBody:str):
    headers = {
        'Content-Type': 'application/json',
    }
    
    data = {
        "_serviceId":_serviceId, 
        "_measureHeader":_measureHeader,
        "_measureBody":_measureBody
        }
    response = requests.post(f'https://eco-capt-bridge.herokuapp.com/{endpoint}', headers=headers, json=data)
    assert response.status_code == 200,response.status_code
    return response


def addAlertPost_v0(endpoint:str, _serviceId:int, _ruleId :int, _alertBody:str):
    headers = {
        'Content-Type': 'application/json',
    }

    data = {
         "_serviceId":_serviceId,
         "_ruleId": _ruleId,
          "_alertBody":_alertBody
         }

    response = requests.post(f'http://127.0.0.1:5000/{endpoint}', headers=headers, json=data)

    assert response.status_code == 200,response.status_code
    return response

def addAlertPost(endpoint:str, _serviceId:int,_ruleId:int, _alertBody:str):
    headers = {
        'Content-Type': 'application/json',
    }

    data = {
         "_serviceId":_serviceId,
         "_ruleId":_ruleId,
          "_alertBody":_alertBody
         }

    response = requests.post(f'https://eco-capt-bridge.herokuapp.com/{endpoint}', headers=headers, json=data)

    assert response.status_code == 200,response.status_code
    return response

    