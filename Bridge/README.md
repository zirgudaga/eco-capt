# **eco-capt-bridge**
**Bridge for eco-capt project**

**Here we have the 3 parts of the Bridge dev :**
- **The Sensors part**
- **The Storage part**
- **The Certification part**


## **Sensors Part = IoT Part of the Project**
*Here we don't read nore write data in the blockchain.* 

It's the flow about how to use the sensors plugged in the raspberry pi.  
And then how to push thoses measures into the Storage part of the Bridge. 
The code run in the Rapsberry Pi is the file App/scripts/get_rpi_sensors.py  

Our sensors for the tests are measuring the temperature and humidity.  
We use a DHT sensors and a Raspberry Pi.  

<br/>
<img alt="Sensors" src="https://www.circuitbasics.com/wp-content/uploads/2015/12/DHT11-Pinout-for-three-pin-and-four-pin-types-2.jpg" width=600, height=300 />
<br><br/>
<img alt="Connect Sensors" src="https://www.circuitbasics.com/wp-content/uploads/2015/12/How-to-Setup-the-DHT11-on-the-Raspberry-Pi-Three-pin-DHT11-Wiring-Diagram.png" width=600, height=300>
<br/>

## **Bridge**
The Bridge is a server that treat the data sent each seconds by the sensors. The Blockchain is not built to store so many data.  
The goal of the Bridge is to be an intermediary between the IoT part and the Blockchain.  
The Bridge treats all those infos in real time and send only measure reports and alerts to the Blockchain instead of all the data.  
The Bridge has a "intelligent part" (which is in the roadmap and not in the dev already done) that will predict in real time thanks to IA models the value of the sensors.  
Then the Bridge will compare this expected value and the actual one measured by the sensors and trigger alert if the gap is too high.  


## Storage Part = Bridge Role 1
*Here we only read data in the blockchain and apply treatment to the data sent by the sensors.*   

It's the flow that receives all the data. 
The data include :
- the measures sent by the sensors
- the timestamp/frequency written in the blockchain
- the threshold written in the blockchain
- ...

This part also deals with the treatment of all thoses data in order to :  
- make stats/aggregation
- make prediction on futures data
- trigger the alerts in real time when a threshold is exceeded


## Certification Part = Bridge Role 2
*Here we interact with the smart-contract to write data in the blockchain.*   

It's the flow that bring security in our project and justify the usage of a blockchain technology.  
Regarding of the data measured, treated and compared we send message to the smart-contract with a predefine frequency stored in the blockchain.  
The Bridge has his own address to sign the transaction.  

The measures are sent through 2 variables : 
- _measureHeader (bytes32) is a structure :   
    ```json
    {
        // "version": bytes8,
        // "date": YYYYmmddHHii : byte12,
        // "measureType":bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version ,
        // "timeCode": (Horaire, Journalier) Y m d H i : bytes1 
        // "nbTime": bytes3 
    }
    ```
- _measureBody (bytes32) is a structure :  
    ```json
    {
        // "maxValue": bytes8,
        // "minValue": bytes8,
        // "meanValue": bytes8,
        // "medianValue": bytes8
    }
    ```

The alert is sent through the _alertBody variable :  
- _alertBody (bytes32) is a structure
    ```json
    {
        // "version": bytes8,
        // "codeAlert": bytes4,
        // "date": YYYYmmddHHii : byte12,
        // "valueAlert":bytes8
    }
    ```