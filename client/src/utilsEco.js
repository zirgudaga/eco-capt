/**
* @title Utils
* @dev Some tools very useful to ecoCapt project
* @author Hélène Bunel
* @author Edouard Vahanian
* @author Daniel Villa Monteiro
* @package EDH_LIBS
* @copyright 2021 EDH
*/

// struct mesure en-tête (32) { 
//   //V0.1     XX.XX.XX    00.01.00
//   Version : bytes8;
//   Date : YYYYmmddHHii : byte12
//   Type de mesureID : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
//   Type temporel : bytes1 (Horaire, Journalier) Y m d H i
//   Nb temporel : bytes3 
// }

// struct mesure donnée (32) { 
//   Valeur Max : bytes8
//   Valeur Moyenne : bytes8
//   Valeur Médiane : bytes8
//   Valeur Min : bytes8
// }

/**
 * @dev Recolt measures
 * @param myList : Array of hexa_header
 * @param myObject : Array of hexa_body
 * @return array of string
 */
const recoltMeasures = (tabInputHeader, tabInputBody) => {
    

};
  
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
    return '0x'+hexValue;
};

/**
 * @dev String to Object Measure
 * @param stringValue : String to transfort in Object
 * @return Hex
 */
const hexToObject = (stringValue) => { 


};





/**
 * @dev String to Object Measure
 * @param stringValue : String to transfort in Object
 * @return Hex
 */
const ObjectToHex = (stringValue) => {
    

};


  
  
  
  
  
  
  
  
export { recoltMeasures, hexToString, stringToHex, hexToObject, ObjectToHex };
  