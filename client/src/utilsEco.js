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
const measureToObject = (stringValue) => { 


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

    // struct mesure en-tête (32) { 
    //   //V0.1     XX.XX.XX    00.01.00
    //   Version : bytes8;
    //   Date : YYYYmmddHHii : byte12 
    //   Code de mesure : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
    //   Code temporel : bytes1 (Horaire, Journalier) Y m d H i
    //   Nb temporel : bytes3 
    // }
    
    let nbTime  = "00000"+service.nbTime;
    let objectHeader = 
    '0x'+service.version.substr(-8)+
    stringToHex(fakeDateWithSeed(seed))+
    service.measureType.substr(-16)+
    service.timeCode.substr(-2)+
    stringToHex(nbTime.substr(-3));
    
    // struct mesure donnée (32) { 
    //   Valeur 1 Max : bytes8
    //   Valeur 2 Moyenne : bytes8
    //   Valeur 3 Médiane : bytes8
    //   Valeur 4 Min : bytes8

    let tabFakeLine = [60, 76, 92, 88, 70, 62];

    let objectBody = 
    '0x'+stringToHex(("00000000"+(tabFakeLine[seed%6]*1.5)).substr(-8))+
    stringToHex(("00000000"+(tabFakeLine[seed%6]*1)).substr(-8))+
    stringToHex(("00000000"+(tabFakeLine[seed%6]*0.9)).substr(-8))+
    stringToHex(("00000000"+(tabFakeLine[seed%6]*0.70)).substr(-8));
   
    return [objectHeader, objectBody];
};

/**
 * @dev Table to selector
 * @param stringValue : String to transfort in Object
 * @return Hex
 */
const getTabtSelect = (nameSelector) => {

    switch(nameSelector){
        case "addServiceVersion" : return [
            {code:'00.01.00', aff:'Version 0.1'},
            {code:'00.02.00', aff:'Version 0.2'}
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
  