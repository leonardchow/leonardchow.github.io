//=====Variables=====
var webStore = false;
var retrieveInfo = [];
var localStoreName = "fuelMinder";
var dataArray = [];

//=====Variables=====

function htmlRun() {
  //First thing to run, called by HTML page.
  checkLocalStorage();
  addLine();
  addButton();
}

function checkLocalStorage() {
  if (typeof(Storage) !== "undefined") {
    webStore = true;
    if (localStorage.getItem(localStoreName) !== null) {
      retrieveInfo = JSON.parse(localStorage.getItem(localStoreName));
      console.log(retrieveInfo);
      dataArray = retrieveInfo;
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
    localStorage.setItem(localStoreName, JSON.stringify(saveItem));
  }
}

function initNumBox(newBox, step, initVal, max) {
  if (step === undefined) {
    step = "0.1";
  }
  if (initVal === undefined || initVal == "0") {
    initVal = "0";
  } else {
    newBox.setAttribute("value", initVal);
  }
  if (max === undefined) {
    max = "1000";
  }
  newBox.setAttribute("type", "number");
  newBox.setAttribute("placeholder", initVal);
  newBox.setAttribute("max", max);
  newBox.setAttribute("min", initVal);
  newBox.setAttribute("step", step);
  newBox.setAttribute("oninput", "numBoxChange()");
}

function addLine() {
  dataArray.push([0,0,0]);
  var numOfLines = dataArray.length;
  var mainContainer = document.getElementById('mainContainer');

  if (dataArray.length > 1) {
    var odometerReading = dataArray[dataArray.length-2][0];
  }

  //==Table stuff==
  var newTable = document.createElement('table');
  newTable.id = "dataTable" + numOfLines;
  newTable.className = "dataTable";

  //Distance Row
  var newRowDist = newTable.insertRow(0);

  var newCellDistLabel = newRowDist.insertCell(0);
  newCellDistLabel.innerHTML = "Odometer: ";
  newCellDistLabel.className = "labelCell";

  var newDistBox = document.createElement('input');
  newDistBox.id = "distBox" + numOfLines;
  newDistBox.className = "distBox numBox";
  initNumBox(newDistBox, "1", odometerReading, "999999");

  var newCellDistItem = newRowDist.insertCell(1);
  newCellDistItem.appendChild(newDistBox);
  newCellDistItem.innerHTML += " km";
  newCellDistItem.className = "itemCell";

  //Litres Row
  var newRowLitres = newTable.insertRow(1);

  var newCellLitresLabel = newRowLitres.insertCell(0);
  newCellLitresLabel.innerHTML = "Petrol pumped: ";
  newCellLitresLabel.className = "labelCell";

  var newLitresBox = document.createElement('input');
  newLitresBox.id = "litresBox" + numOfLines;
  newLitresBox.className = "litresBox numBox";
  initNumBox(newLitresBox, "0.1");

  var newCellLitresItem = newRowLitres.insertCell(1);
  newCellLitresItem.appendChild(newLitresBox);
  newCellLitresItem.innerHTML += " L";
  newCellLitresItem.className = "itemCell";

  //Price Row
  var newRowPrice = newTable.insertRow(2);

  var newCellPriceLabel = newRowPrice.insertCell(0);
  newCellPriceLabel.innerHTML = "Cost: $";
  newCellPriceLabel.className = "labelCell";

  var newPriceBox = document.createElement('input');
  newPriceBox.id = "priceBox" + numOfLines;
  newPriceBox.className = "priceBox numBox";
  initNumBox(newPriceBox, "0.1");

  var newCellPriceItem = newRowPrice.insertCell(1);
  newCellPriceItem.appendChild(newPriceBox);
  newCellPriceItem.className = "itemCell";

  //Results Row
  var newRowResults = newTable.insertRow(3);

  var newCellResultsLabel = newRowResults.insertCell(0);
  newCellResultsLabel.id = "resultsBox" + numOfLines;
  newCellResultsLabel.className = "resultsBox centerCell";
  newCellResultsLabel.innerHTML = "Results:";
  newCellResultsLabel.setAttribute("colspan", "2");

  //Delete Button Row
  var newDelButton = document.createElement('input');
  newDelButton.type = "button";
  newDelButton.value = " Remove Entry ";
  newDelButton.onclick = function() {
    this.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
    numBoxChange();
  }

  var newRowButton = newTable.insertRow(4);

  var newCellRemoveButton = newRowButton.insertCell(0);
  newCellRemoveButton.id = "removeButton" + numOfLines;
  newCellRemoveButton.className = "removeButton centerCell";
  newCellRemoveButton.appendChild(newDelButton);
  newCellRemoveButton.setAttribute("colspan", "2");

  //==End of Table stuff==

  var newLabel = document.createElement('span');
  newLabel.className = "tableLabel";
  newLabel.innerHTML = "Entry " + numOfLines;


  var newDiv = document.createElement('div');
  newDiv.id = "div" + numOfLines;
  newDiv.className = "tableContainerDiv"
  newDiv.appendChild(newTable);

  mainContainer.appendChild(newLabel);
  mainContainer.appendChild(newDiv);
  numBoxChange();
}

function checkValueIsPresent(inputValue) {
  if (inputValue == "") {
    inputValue = "0";
  }
  return inputValue;
}

function divideValues(a, b) {
  if (a == "0" || b == "0") {
    return 0;
  } else {
    return a/b;
  }
}

function numBoxChange() {
  //console.log("input Change");
  var distBox = document.getElementsByClassName('distBox');
  var litresBox = document.getElementsByClassName('litresBox');
  var priceBox = document.getElementsByClassName('priceBox');
  var resultsBox = document.getElementsByClassName('resultsBox');
  var tableLabel = document.getElementsByClassName('tableLabel');
  var dataTable = document.getElementsByClassName('dataTable');

  //console.log("updateBox.length: " + updateBox.length);
  //console.log("dataArray.length " + dataArray.length);

  var workingArray = [];

  for (var i = 0; i < resultsBox.length; i++) {
    tableLabel[i].innerHTML = "Entry " + (i+1);

    if (i % 2 == 0) {
      //is Even. First table is always Even!
      dataTable[i].style.backgroundColor = "rgba(255,255,255, 0.5)";
    } else {
      dataTable[i].style.backgroundColor = "rgba(211, 211, 211, 0.3)";
    }

    var distData = checkValueIsPresent(distBox[i].value);
    var litresData = checkValueIsPresent(litresBox[i].value);
    var priceData = checkValueIsPresent(priceBox[i].value);

    var fuelConsumption = (divideValues(litresData,distData)*100).toFixed(2);
    var pricePerLitre = divideValues(priceData,litresData).toFixed(2);

    resultsBox[i].innerHTML = "Results: </br>";
    resultsBox[i].innerHTML += fuelConsumption + " L/100km </br>";
    resultsBox[i].innerHTML += pricePerLitre + " $/L";

    workingArray[i] = [distData, litresData, priceData];
  }

  dataArray = workingArray.slice();

  //console.log(dataArray);
  saveToLocalStorage(dataArray);
}

function addButton() {
  var numOfLines = dataArray.length;
  var btnContainer = document.getElementById('btnContainer');

  var newButton = document.createElement('input');
  newButton.type = "button";
  newButton.value = " Add Entry ";
  newButton.onclick = function() {
    console.log("clicked");
    addLine();
  };

  btnContainer.appendChild(newButton);

}
