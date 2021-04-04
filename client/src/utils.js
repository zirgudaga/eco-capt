/**
* @title Utils
* @dev Some tools very useful to manipulate list
* @author Hélène Bunel
* @author Edouard Vahanian
* @author Daniel Villa Monteiro
* @package EDH_LIBS
* @copyright 2021 EDH
*/

/**
 * @dev Add/replace a object in this array
 * @param myList : Array used
 * @param myObject : Element to add
 * @notice key parameter is used to find element in myList
 * @return index of adding or remplacing
 */
const addToList = (myList, myObject) => {
  var index = myList.findIndex(x => x.key === myObject.key);

  if(index === -1){
    return myList.push(myObject)-1;
  }

  myList.splice(index, 1, myObject);
  return index;
};


/**
 * @dev Search a key object in this array
 * @param myList : Array used
 * @param key : Element key to search
 * @return true is element with this key is present in myList
 */
const isInList = (myList, key) => {
  var index = myList.findIndex(x => x.key === key);
  if(index === -1){
    return false;
  }
  return true;
};


/**
 * @dev Remove a object in this array
 * @param myList : Array used
 * @param myObject : Element to remove
 * @notice key parameter is used to find element in myList
 * @return index of removing index, -1 if element is not found
 */
const removeToList = (myList, key) => {
  var index = myList.findIndex(x => x.key === key);

  if(index === -1){
    return -1;
  }

  myList.splice(index, 1);
  return index; 
};










export {addToList, isInList, removeToList };
