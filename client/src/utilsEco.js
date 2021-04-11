/**
* @title Utils
* @dev Some tools very useful to ecoCapt project
* @author Hélène Bunel
* @author Edouard Vahanian
* @author Daniel Villa Monteiro
* @package EDH_LIBS
* @copyright 2021 EDH
*/
  
/**
 * @dev Recolt measures
 * @param hexValue : Hexa value to transfort
 * @return String
 */
const hexToString = (hexInput) => {
    let hexValue = hexInput.toString();
    let stringValue = '';
    for (let i=0; i<hexValue.length; i+=2) {
        stringValue += String.fromCharCode(parseInt(hexValue.substr(i, 2), 16));
    }
    return stringValue; 
};

/**
 * @dev Recolt measures
 * @param stringValue : String to transfort in Hex
 * @return Hexa
 */
const stringToHex = (stringValue) => {
    let hexValue = '';
    for(let i=0; i<stringValue.length; i++) {
        hexValue += '' + stringValue.charCodeAt(i).toString(16);
    }
    return hexValue;
};

/**
 * @dev String to Object Measure
 * @param stringValue : String to transfort in Object
 * @return Hex
 */
const measureToObject = (hexHeader, hexBody) => { 

    hexHeader = hexHeader.substr(-64);
    hexBody = hexBody.substr(-64);

    let version = hexToString(hexHeader.substr(0,16));

    switch(version){
        case '00.01.00': return _measureToObject_V_00_01_00(hexHeader, hexBody);
        default : return [{},{}];
    }
};

/**
 * @dev String to Object Measure
 * @param stringValue : String to transfort in Object
 * @return Hex
 */
 const _measureToObject_V_00_01_00 = (hexHeader, hexBody) => { 

    hexHeader = hexHeader.substr(-64);
    hexBody = hexBody.substr(-64);

    //   Date : YYYYmmddHHii : byte12 
    //   Code de mesure : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
    //   Code temporel : bytes1 (Horaire, Journalier) Y m d H i
    //   Nb temporel : bytes3 
    let objHeader = {};
    objHeader.version = hexToString(hexHeader.substr(0,16));
    objHeader.date = hexToString(hexHeader.substr(16,24));
    objHeader.measureType = hexToString(hexHeader.substr(40,16));   
    objHeader.timeCode = hexToString(hexHeader.substr(56,2)); 
    objHeader.nbTime = parseInt(hexToString(hexHeader.substr(58,6)),10); 

    //   Valeur 1 Max : bytes8
    //   Valeur 2 Moyenne : bytes8
    //   Valeur 3 Médiane : bytes8
    //   Valeur 4 Min : bytes8
    let objBody = {};
    objBody.val1 = parseFloat(hexToString(hexBody.substr(0,16)));
    objBody.val2 = parseFloat(hexToString(hexBody.substr(16,16)));
    objBody.val3 = parseFloat(hexToString(hexBody.substr(32,16)));
    objBody.val4 = parseFloat(hexToString(hexBody.substr(48,16)));
    
    return [objHeader, objBody];
};

const fakeDateWithSeed = (seed) => {
    let date = new Date();
    let year = date.getFullYear();
    let month  = "0"+(date.getMonth()+1);
    let day  = "0"+date.getDate();
    let hours = "0"+date.getHours();
    let minutes = "0"+(date.getMinutes()+seed);

    // Date : YYYYmmddHHii 
    let formattedTime = year+month.substr(-2)+day.substr(-2)+hours.substr(-2)+minutes.substr(-2);

    return formattedTime;
}

/**
 * @dev Make a fake list of measure
 * @param seed : Integer of seed
 * @return 2 size array
 */
const fakeMeasure = (seed, service) => {

    //   Version : bytes8;
    //   Date : YYYYmmddHHii : byte12 
    //   Code de mesure : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
    //   Code temporel : bytes1 (Horaire, Journalier) Y m d H i
    //   Nb temporel : bytes3  
    let hexHeader = 
    '0x'+service.version.substr(-16)+
    stringToHex(fakeDateWithSeed(seed))+
    service.measureType.substr(-16)+
    service.timeCode.substr(-2)+
    stringToHex(("00000"+service.nbTime).substr(-3));
    
    //   Valeur 1 Max : bytes8
    //   Valeur 2 Moyenne : bytes8
    //   Valeur 3 Médiane : bytes8
    //   Valeur 4 Min : bytes8
    let tabFakeLine = [60, 76, 92, 88, 70, 62];
    let hexBody = 
    '0x'+stringToHex(("00000000"+(parseInt(tabFakeLine[seed%6]*1.50,10))).substr(-8))+
    stringToHex(("00000000"+(parseInt(tabFakeLine[seed%6]*1.00,10))).substr(-8))+
    stringToHex(("00000000"+(parseInt(tabFakeLine[seed%6]*0.90,10))).substr(-8))+
    stringToHex(("00000000"+(parseInt(tabFakeLine[seed%6]*0.70,10))).substr(-8));

    return [hexHeader, hexBody];
};

/**
 * @dev Table to selector
 * @param stringValue : String to transfort in Object
 * @return Hex
 */
const getTabtSelect = (nameSelector) => {

    switch(nameSelector){
        case "addServiceVersion" : return [
            {code:'00.01.00', aff:'Version 0.1'}
        ];

        case "addServiceMeasureType" : return [
            {code:'SON_0001', aff:'Accoustique version 1'},
            {code:'SOUF0001', aff:'Emission de soufre version 1'},   
            {code:'SOUF0002', aff:'Emission de soufre version 2'}   
        ];

        case "addServiceTimeType" : return [
            {code:'Y', aff:'Année'},
            {code:'m', aff:'Mois'},
            {code:'d', aff:'Journée'},
            {code:'H', aff:'Heure'},                                
            {code:'i', aff:'Minutes'},  
        ];
    
        default : return [];
    }
}  
  
export { hexToString, stringToHex, measureToObject, getTabtSelect, fakeMeasure };
  