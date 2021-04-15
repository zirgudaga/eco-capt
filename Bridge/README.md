# **eco-capt-bridge**
**Bridge for eco-capt project**

**Here we have the 3 parts of the Bridge dev :**
- **The Sensors part**
- **The Storage part**
- **The Certification part**


## **Sensors Part**
*Here we don't read nore write data in the blockchain.*   

It's the flow about how to use the sensors plugged in the raspberry pi.  
And then how to push thoses measures into the Storage part of the Bridge.  
  
Our sensors for the tests are measuring the temperature and humidity.  
We use a Raspberry Pi 3, and DHT sensors.  

<img alt="Connect Sensors" src="https://www.circuitbasics.com/wp-content/uploads/2015/12/How-to-Setup-the-DHT11-on-the-Raspberry-Pi-Three-pin-DHT11-Wiring-Diagram.png" width=600, height=300>

<img alt="Sensors" src="https://www.circuitbasics.com/wp-content/uploads/2015/12/DHT11-Pinout-for-three-pin-and-four-pin-types-2.jpg" width=600, height=300 />

## **Storage Part**
*Here we only read the data in the blockchain.*   
  
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


## **Certification Part**
*Here we interact with the smart-contract to write data in the blockchain.*   
  
It's the flow that bring security in our project and justify the usage of a blockchain technology.  
Regarding of the data measured, treated and compared we send message to the smart-contract with a predefine frequency stored in the blockchain.  
The Bridge has his own address to sign the transaction.  

