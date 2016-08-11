//=====Variables=====
var webStore = false;
var retrieveInfo = "";
var localStoreName = "FuelMinder";
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
      retrieveInfo = localStorage.getItem(localStoreName);
      console.log(retrieveInfo);
    }
  }
}

function initNumBox(newBox, step) {
  if (step === undefined) {
    step = "0.1";
  }
  newBox.setAttribute("type", "number");
  newBox.setAttribute("placeholder", "0");
  newBox.setAttribute("max", "100");
  newBox.setAttribute("min", "0");
  newBox.setAttribute("step", step);
  newBox.setAttribute("style", "font-size:12pt; width:50px");
  newBox.setAttribute("oninput", "numBoxChange()");
}

function addLine() {
  var numOfLines = dataArray.length;
  var mainContainer = document.getElementById('mainContainer');

  //==Table stuff==
  var newTable = document.createElement('table');
  newTable.id = "table" + numOfLines;
  newTable.setAttribute("width", "50%");
  newTable.setAttribute("style", "border:1px solid lightgray; padding:15px; padding-left:30px; padding-right:30px; border-radius:10px");

  //Distance Row
  var newRowDist = newTable.insertRow(0);

  var newCellDistLabel = newRowDist.insertCell(0);
  newCellDistLabel.innerHTML = "Distance: ";
  newCellDistLabel.setAttribute("align", "right");

  var newDistBox = document.createElement('input');
  newDistBox.id = "distBox" + numOfLines;
  initNumBox(newDistBox, "1");

  var newCellDistItem = newRowDist.insertCell(1);
  newCellDistItem.appendChild(newDistBox);
  newCellDistItem.innerHTML += " km";
  newCellDistItem.setAttribute("align", "left");

  //Litres Row
  var newRowLitres = newTable.insertRow(1);

  var newCellLitresLabel = newRowLitres.insertCell(0);
  newCellLitresLabel.innerHTML = "Litres: ";
  newCellLitresLabel.setAttribute("align", "right");

  var newLitresBox = document.createElement('input');
  newLitresBox.id = "litresBox" + numOfLines;
  initNumBox(newLitresBox, 0.1);

  var newCellLitresItem = newRowLitres.insertCell(1);
  newCellLitresItem.appendChild(newLitresBox);
  newCellLitresItem.innerHTML += " L";
  newCellLitresItem.setAttribute("align", "left");

  //Price Row
  var newRowPrice = newTable.insertRow(2);

  var newCellPriceLabel = newRowPrice.insertCell(0);
  newCellPriceLabel.innerHTML = "Price: $";
  newCellPriceLabel.setAttribute("align", "right");

  var newPriceBox = document.createElement('input');
  newPriceBox.id = "priceBox" + numOfLines;
  initNumBox(newPriceBox, 0.1);

  var newCellPriceItem = newRowPrice.insertCell(1);
  newCellPriceItem.appendChild(newPriceBox);
  //newCellPriceItem.innerHTML += " in Dollars";
  newCellPriceItem.setAttribute("align", "left");

  //Results Row
  var newRowResults = newTable.insertRow(3);

  var newCellResultsLabel = newRowResults.insertCell(0);
  newCellResultsLabel.id = "resultsBox" + numOfLines;
  newCellResultsLabel.className = "resultsBox";
  newCellResultsLabel.innerHTML = "Results:";
  newCellResultsLabel.setAttribute("align", "center");
  newCellResultsLabel.setAttribute("colspan", "2");

  //==End of Table stuff==

  var newDiv = document.createElement('div');
  newDiv.id = "div" + numOfLines;
  newDiv.appendChild(newTable);
  newDiv.setAttribute("style", "font-family:sans-serif; height:200px");

  mainContainer.appendChild(newDiv);
  dataArray.push([0,0,0]);
}

function numBoxChange() {
  //console.log("input Change");
  var updateBox = document.getElementsByClassName('resultsBox');
  //console.log("updateBox.length: " + updateBox.length);
  //console.log("dataArray.length " + dataArray.length);
  var distData = document.getElementById('distBox' + 0).value;
  var litresData = document.getElementById('litresBox' + 0).value;
  var priceData = document.getElementById('priceBox' + 0).value;

  var fuelConsumption = (litresData/distData*100).toFixed(2);
  var pricePerLitre = (priceData/litresData).toFixed(2);

  updateBox[0].innerHTML = "Results: </br>";
  updateBox[0].innerHTML += fuelConsumption + " L/100km </br>";
  updateBox[0].innerHTML += pricePerLitre + " $/L";

  for (var i = 0; i < dataArray.length; i++) {
    //dataArray[i] = [];

  }
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
