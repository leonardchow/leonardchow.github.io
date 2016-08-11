//To fix:
//Populate button should clear all contents of page.
//Maybe can parse info, write to localStorage, then refresh?

function htmlRun() {
  //First thing to run, called by HTML page.
  checkLocalStorage();
  if (loadListInject(retrieveInfo)) {
  } else {
    listChangeNew();
  }
}

var iterNum = 1;
var itemArray = [];
var retrieveInfo = "";
var localStoreName = "modCheck";
var webStore = false;

var modCodes = ["NM", "CS"];
var modInfoArray = modInfoPack;

var reqMCs = 100;

function checkLocalStorage() {
  if (typeof(Storage) !== "undefined") {
    webStore = true;
    if (localStorage.getItem(localStoreName) !== null) {
      retrieveInfo = localStorage.getItem(localStoreName);
      console.log(retrieveInfo);
    }
  }
}

function clearLocalStorage() {
  if (webStore) {
    localStorage.removeItem(localStoreName);
  }
  location.reload();
}

function saveToLocalStorage(saveItem) {
  if (webStore) {
    localStorage.setItem(localStoreName, saveItem);
  }
}

function concArray(arr, empty, suffix) {
  if (empty === undefined) { empty = ""; }
  if (suffix === undefined) { suffix = ""; }

  var retString = empty + suffix;

  if (arr.length == 1) {
    retString = arr[0] + suffix;
  } else if (arr.length > 1) {
    retString = arr.join(", ");
    retString += suffix;
  }
  return retString;
}

function modGet(inputVal, id) {
  try {
    var getModDetails = modInfoArray[inputVal][id];
  }
  catch(err) {
    console.log("modGet error: " + err);
    console.log(typeof(inputVal) +" "+ typeof(id));
  }
  return getModDetails;
}

function modGetIdArr(arr, idType) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    var newName = modGet(arr[i], idType);
    if (newName != "") {
      newArr.push(newName);
    }
  }
  return newArr;
}

function getCoreMods() {
  var coreModArr = [];
  for (var i = 0; i < modInfoArray.length; i++) {
    if (modGet(i, "isCoreMod") == 'TRUE') {
      coreModArr.push(i);
    }
  }
  return coreModArr;
}

function getArrayOutput(doCompress) {
  var returnStr;
  var compressedStr;
  var itArr = itemArray;
  if (itArr[(itArr.length-1)] == 0) {
    itArr.pop(); //Remove the last item in itArr if it's 0.
  }
  var itArrMax = String(Math.max.apply(null, itArr));

  //If max is more than single digit, add zeroes:
  if (itArrMax.length > 1) {
    for (var i = 0; i < itArr.length; i++) { //For each item in itArr
      //Is there a need to pad it?: (digitDiff > 0)
      digitDiff = parseInt(itArrMax.length - String(itArr[i]).length);
      if (digitDiff > 0) {
        var diffItem = String(itArr[i]);
        for (var k = digitDiff; k > 0; k--) { //Pad it:
          diffItem = "0" + diffItem;
        }
        itArr[i] = diffItem;
      }
    }
  }

  returnStr = itArrMax.length + ":" + itArr.join("") + "END";
  if (doCompress) {
    compressedStr = LZString.compress(returnStr);
    return compressedStr;
  } else {
    return returnStr;
  }
}

function addNew(_initSel) {
  if (_initSel === undefined) {
    _initSel = 0;
    var isNew = true; //There's no initial selection.
  } else {
    var isNew = false;
  }
  // Get the main Div in which all the other divs will be added
  var mainContainer = document.getElementById('mainContainer');

  // Create a new div for holding text and button input elements
  var newDiv = document.createElement('div');
  iterNum += 1;
  newDiv.id = "div"+ iterNum;

  // Create a new text input
  var newDropdown = document.createElement('select');
  newDropdown.className = "listSel"
  newDropdown.id = "sel"+ iterNum;

  newDropdown.onchange = function(){
    if (isNew) {
      listChangeNew();
      isNew = !isNew;
    }
    listUpdate();
  };

  // Populate options with an array. Third arg is optional.
  populateOptions(newDropdown, modInfoArray, _initSel);

  // Append new text input to the newDiv
  newDiv.appendChild(newDropdown);

  // Append newDiv input to the mainContainer div
  mainContainer.appendChild(newDiv);

}

function populateOptions(selectObj, infoArray, _initialSelect) {
  if (_initialSelect === undefined) {
    initialSelect = 0;
  } else {
    initialSelect = parseInt(_initialSelect);
  }

  for (var i = 0; i < infoArray.length; i++) {
    var bitObj = document.createElement("option");
    bitObj.text = modGet(i, "code") + " - " + modGet(i, "name");
    bitObj.value = i;

    selectObj.add(bitObj);
  }
  selectObj.value = initialSelect;
}

function addDelButton() {
  var selects = document.getElementsByClassName("listSel");

  var newDelButton = document.createElement('input');
  newDelButton.type = "button";
  newDelButton.value = " X ";
  newDelButton.onclick = function() {
    this.parentElement.remove();
    listUpdate();
  };
  if (iterNum > 2) {
    //console.log("added " + divs.length + ", " + iterNum);
    selects[(selects.length-2)].parentElement.appendChild(newDelButton);
  }
}

function checkDuplicates() {
  //get array of selected options
  //iterate through array
  //check if my value matches current item in array
  //if not, disable the corresponding item in my dropdown
  //exit loop
  var selects = document.getElementsByClassName("listSel");
  //console.log(selects);
  itemArray = [];
  for (var i = 0; i < selects.length; i++) {
    //Get array of current option selections.
    itemArray.push(parseInt(selects[i].value));
  }

  for (var k = 0; k < selects.length; k++) { //for every dropdown
    var tempSelectItem = selects[k];

    for (var j = 0; j < tempSelectItem.length; j++) { //for every option inside

      if (tempSelectItem.selectedIndex != tempSelectItem[j].value) {
        //Reset option to be enabled
        tempSelectItem[j].disabled = false;
        //If the current iteration is != to the currently selected option:
        for (var l = 0; l < itemArray.length; l++) { //for each in itemArray
          //if option is already selected elsewhere (itemArray), disable it:
          if (tempSelectItem[j].value == itemArray[l]) {
            tempSelectItem[j].disabled = true;
          }
        }
      }
    }
  }
}

function listChangeNew(item) {
  addNew(item);
  addDelButton();
}
function listUpdate() {
  checkDuplicates();
  updateTextArea("textAreaList");
}
function listInject(arrPut, toRemove) {
  var selects = document.getElementsByClassName("listSel");
  var divPop = document.getElementById("divPopulate");

  for (var i = 0; i < arrPut.length; i++) {
    listChangeNew(arrPut[i]);
  }
  listChangeNew(); //Add a new unselected dropdown
  divPop.remove();
  if (toRemove) {
    console.log("removing");
    selects[0].parentElement.remove();
  }
  listUpdate();
}

function chunk(str, size) { //Divide the string into array
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}

function loadListInject(dataRaw, btnPress) {
  var dataIsValid = false;

  if (btnPress) { //If populate button was pressed, don't decompress
    var data = dataRaw;
  } else {
    var data = LZString.decompress(dataRaw);
  }

  if (dataRaw != "") { //Do data checks.
    var dataCheckEND = data.slice((data.length - 3));
    console.log(data, dataCheckEND);
    if (dataCheckEND == "END") { //Data has "END".
      dataCheckBody = data.split("END");
      if (data.indexOf(":") == 1) { //Colon is at the right place.
        dataCheckColon = dataCheckBody[0].split(":");
        if (dataCheckColon[1].length > 0) { //And there's module info.
          console.log("Data is valid");
          dataIsValid = true;
          var dataUse = dataCheckColon;
        }
      }
    }
  }

  if (dataIsValid) {
    console.log("subs: " + dataUse[0]);

    var output = chunk(dataUse[1], dataUse[0]);

    console.log("output: ");
    console.log(output);

    listInject(output, btnPress);
  }
  return dataIsValid;
}

function updateTextArea(textAreaID) {
  var modArray = [];
  var MCArray = [];
  var modValues = [];
  var newText = "";
  var coreModArray = getCoreMods();

  //Get selected module names and MCs.
  for (var i = 0; i < itemArray.length; i++) {
    if (itemArray[i] != 0) {
      var modAdd = modGet(itemArray[i], "code");
      var MCAdd = parseInt(modGet(itemArray[i], "MCs"));
      var addItem = modAdd + "(" + MCAdd + ")";

      modValues.push(addItem);
      modArray.push(modAdd);
      MCArray.push(MCAdd);
    }
  }

  //Check against core mods
  var sortedItemArray = modGetIdArr(itemArray.concat().sort(), "name");
  var remCoreMod = modGetIdArr(coreModArray, "code");
  //Compare names of mods to see which to remove
  for (var k = 0; k < sortedItemArray.length; k++) {
    //Get index number of item in array
    var arrIndex = remCoreMod.indexOf(sortedItemArray[k]);
    if (arrIndex != -1) { //indexOf returns -1 if it can't find anything
      //Remove mods using splice()
      remCoreMod.splice(arrIndex, 1);
    }
  }
  //End check

  //Sum the array
  var sumValue = MCArray.reduce(function (prev, curr) {return prev + curr}, 0);

  //Figuring out the itemArray output
  var arrayOutput = getArrayOutput();
  saveToLocalStorage(getArrayOutput(true));

  newText += concArray(modValues, "No modules", ".");
  newText += "\n";
  newText += "Completed MCs: " + sumValue;
  newText += "\n";
  newText += "Remaining MCs: " + (reqMCs - sumValue);
  newText += "\n";
  newText += "Core modules remaining: " + concArray(remCoreMod, "None remaining", ".");
  newText += "\n";
  newText += "Copy below:";
  newText += "\n";
  newText += arrayOutput;
  document.getElementById(textAreaID).value = newText;
}

function executeListInject() {
  var textAreaDataRaw = document.getElementById("textAreaInput").value;
  loadListInject(textAreaDataRaw, true);
}
