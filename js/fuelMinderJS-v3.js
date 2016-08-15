//=====Variables=====
var webStore;
var retrieveInfo;
var localStoreName;
var dataArray;

//=====Variables=====

function htmlRun() {
  webStore = false;
  retrieveInfo = [];
  localStoreName = "fuelMinder";
  dataArray = [];

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
  newBox.setAttribute("min", "0"); //Set this to initVal to prevent it from going lower
  newBox.setAttribute("step", step);
  newBox.setAttribute("oninput", "numBoxChange()");
}

function addLine() {
  dataArray.push([0,0,0]);
  var numOfLines = dataArray.length;
  var mainContainer = document.getElementById('mainContainer');

  if (dataArray.length > 1) {
    //Set up previous data
    var odometerReading = dataArray[dataArray.length-2][0];
    var petrolPrice = dataArray[dataArray.length-2][2];
  }

  //Distance Row
  var newDistBox = document.createElement('input');
  newDistBox.id = "distBox" + numOfLines;
  newDistBox.className = "distBox numBox";
  initNumBox(newDistBox, "1", odometerReading, "999999");

  var newRowDist = document.createElement('div');
  newRowDist.className = "flex-container";

  var newLabelDist = document.createElement('div');
  newLabelDist.className = "flex-label";
  newLabelDist.innerHTML = "Odometer: ";

  var newItemDist = document.createElement('div');
  newItemDist.className = "flex-item";
  newItemDist.appendChild(newDistBox);
  newItemDist.innerHTML += " km";

  newRowDist.appendChild(newLabelDist);
  newRowDist.appendChild(newItemDist);

  //Litres Row
  var newLitresBox = document.createElement('input');
  newLitresBox.id = "litresBox" + numOfLines;
  newLitresBox.className = "litresBox numBox";
  initNumBox(newLitresBox, "0.1");

  var newRowLitres = document.createElement('div');
  newRowLitres.className = "flex-container";

  var newLabelLitres = document.createElement('div');
  newLabelLitres.className = "flex-label";
  newLabelLitres.innerHTML = "Petrol pumped: ";

  var newItemLitres = document.createElement('div');
  newItemLitres.className = "flex-item";
  newItemLitres.appendChild(newLitresBox);
  newItemLitres.innerHTML += " L";

  newRowLitres.appendChild(newLabelLitres);
  newRowLitres.appendChild(newItemLitres);

  //Price Row
  var newPriceBox = document.createElement('input');
  newPriceBox.id = "priceBox" + numOfLines;
  newPriceBox.className = "priceBox numBox";
  initNumBox(newPriceBox, "0.1", petrolPrice);

  var newRowPrice = document.createElement('div');
  newRowPrice.className = "flex-container";

  var newLabelPrice = document.createElement('div');
  newLabelPrice.className = "flex-label";
  newLabelPrice.innerHTML = "Cost: $";

  var newItemPrice = document.createElement('div');
  newItemPrice.className = "flex-item";
  newItemPrice.appendChild(newPriceBox);

  newRowPrice.appendChild(newLabelPrice);
  newRowPrice.appendChild(newItemPrice);

  //Results Row
  var newRowResults = document.createElement('div');
  newRowResults.className = "flex-container";

  var newLabelResults = document.createElement('div');
  newLabelResults.className = "resultsBox flex-center";
  newLabelResults.innerHTML = "Results:";

  newRowResults.appendChild(newLabelResults);

  //Delete Button
  var newDelButton = document.createElement('input');
  newDelButton.type = "button";
  newDelButton.className = "button";
  newDelButton.value = " Remove Entry ";
  newDelButton.onclick = function() {
    var e = this.parentElement.parentElement;

    e.addEventListener("animationend", listener, false);
    e.classList.add('moveOut');

    function listener(f) {
      e.remove();
      numBoxChange();
    }
  }

  var newLabel = document.createElement('span');
  newLabel.className = "tableLabel";
  newLabel.innerHTML = "Entry " + numOfLines;

  var newDiv = document.createElement('div');
  newDiv.id = "div" + numOfLines;
  newDiv.className = "dataDiv";
  newDiv.appendChild(newRowDist);
  newDiv.appendChild(newRowLitres);
  newDiv.appendChild(newRowPrice);
  newDiv.appendChild(newRowResults);
  newDiv.appendChild(newDelButton);

  var newEntryDiv = document.createElement('div');
  newEntryDiv.className = "entryDiv moveIn";
  newEntryDiv.appendChild(newLabel);
  newEntryDiv.appendChild(newDiv);

  mainContainer.appendChild(newEntryDiv);

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
  //updates Labels and info.
  //console.log("input Change");
  var distBox = document.getElementsByClassName('distBox');
  var litresBox = document.getElementsByClassName('litresBox');
  var priceBox = document.getElementsByClassName('priceBox');
  var resultsBox = document.getElementsByClassName('resultsBox');
  var tableLabel = document.getElementsByClassName('tableLabel');
  var dataDiv = document.getElementsByClassName('dataDiv');

  var workingArray = [];

  for (var i = 0; i < resultsBox.length; i++) {
    tableLabel[i].innerHTML = "Entry " + (i+1);

    if (i % 2 == 0) {
      //is Even. First table is always Even!
      dataDiv[i].classList.remove('greyBG');
      dataDiv[i].classList.add('whiteBG');

    } else {
      dataDiv[i].classList.remove('whiteBG');
      dataDiv[i].classList.add('greyBG');
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
  newButton.className = "button";
  newButton.value = " Add Entry ";
  newButton.onclick = function() {
    console.log("clicked");
    addLine();
  };

  btnContainer.appendChild(newButton);

}
