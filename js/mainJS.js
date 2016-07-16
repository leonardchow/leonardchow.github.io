var iterNum = 1;
var itemArray = [];

var modCodes = ["NM", "CS"];
var modInfoArray = modInfoPack;

var reqMCs = 100;

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

function getArrayOutput() {
  var returnStr;
  var compressedStr;
  var itArr = itemArray;
  itArr.pop(); //Remove the last item in itArr (Should be '0')
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

  returnStr = itArrMax.length + ":" + itArr.join("");

  compressedStr = LZString.compress(returnStr);
  return compressedStr;
}

function addNew(_initSel) {
  if (_initSel === undefined) {
    _initSel = 0;
    var isNew = true;
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
    listChange();
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
    listChange();
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
function listChange() {
  checkDuplicates();
  updateTextArea("textAreaList");
}
function listInject(arrPut) {
  var selects = document.getElementsByClassName("listSel");
  var btn = document.getElementById("populateBtn");

  for (var i = 0; i < arrPut.length; i++) {
    listChangeNew(arrPut[i]);
  }
  listChangeNew();
  btn.parentElement.remove();
  selects[0].parentElement.remove();
  listChange();
}

function chunk(str, size) {
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}

function executeListInject() {
  var textAreaDataRaw = document.getElementById("textAreaInput").value;
  if (textAreaDataRaw != "") {
    var textAreaData = LZString.decompress(textAreaDataRaw);
    console.log(textAreaData);
    if (textAreaData.indexOf(":") == 1) {
      var primeSplit = textAreaData.split(":");
      var subs = primeSplit[0];
      console.log("subs: " + subs);

      var output = chunk(primeSplit[1], subs);

      console.log("output: ");
      console.log(output);

      listInject(output);
    } else {
      var newText = "Please enter a valid string to populate with.";
      document.getElementById("textAreaList").value = newText;
    }
  } else {
    var newText = "Please enter a data to repopulate with.";
    document.getElementById("textAreaList").value = newText;
  }
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
