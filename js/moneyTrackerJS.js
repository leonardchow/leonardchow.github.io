// TO-DO 16 Aug morning:
// change white/grey BG back to how it was (always updating)
// Make it mandatory to enter something!
// Make it retain data!

// localStorage methods:
// retrieveLocalStorage(localStoreName) -> retrieved info
// clearLocalStorage(localStoreName) -> nothing
// saveToLocalStorage(localStoreName) -> nothing
var localStoreName;
var webStore;
var retrieveInfo;
var localStoreName;
var dataArray;

var modal;
var modalIsClosing;
var openBtn;
var closeBtn;
var textField;
var displayArea;
var headerText;
var modalBody;
var titleInput;
var locInput;
var timeInput;
var costInput;
var modalSender;
var modalOpenerArr;

var editTarget;
var editingNewEntry;

function initValues() {
  localStoreName = "moneyTracker";
  dataArray = retrieveLocalStorage(localStoreName);
  modalIsClosing = false;
  editingNewEntry = false;
}

function htmlRun() {
  initValues();
  //initDoc();
  createAddButton();
}

function createNewEntry() {
  addEntryItem();

}

function initDoc() {
  // Get the modal
  modal = document.getElementById('myModal');
  // Set a variable to determine what element fires the animation
  //???
  // Get the button that opens the modal
  modalOpenerArr = document.getElementsByClassName('addBtn');
  openBtn = modalOpenerArr[0];
  // Get the <span> element that closes the modal
  closeBtn = document.getElementById("closeBtn");
  displayArea = document.getElementById("displayArea");
  // Get the done button that commits the changes
  doneBtn = document.getElementById("doneBtn");

  // Text display areas
  headerText = document.getElementById("headerText");
  modalBody = document.getElementById("modalBody");

  // Text input areas
  titleInput = document.getElementById("titleInput");
  locInput = document.getElementById("locInput");
  timeInput = document.getElementById("timeInput");
  costInput = document.getElementById("costInput");

  // When the user clicks anywhere outside of the modal, close it
  // OR When the user clicks on <span> (x), close the modal
  window.onclick = function(event) {
    //console.log("btn:", openBtn);
    console.log("event.target:", event.target);

      if (event.target == modal || event.target == doneBtn) {
        // Modal was closed & Saved.
        closeModal();
        // & Save changes
        saveModalChanges(titleInput.value, locInput.value, timeInput.value, costInput.value);
      } else if (event.target == openBtn) {
        // Modal was opened!
        openModal("newEntry");
      } else if (event.target == closeBtn) {
        // Modal edit was cancelled!
        closeModal();
        if (editingNewEntry) {
          editTarget.remove();
        }
      }
  }
}

function openModal(status) {
  if (status == "newEntry") {
    editTarget = document.getElementsByClassName("entryDiv")[0];
    editingNewEntry = true;
    titleInput.value = "";
    locInput.value = "";
    timeInput.value = "";
    costInput.value = "";
  } else {
    editTarget = status;
    editingNewEntry = false;
    fillWithContent = getContentsFromParentAsArray(status);
    titleInput.value = fillWithContent[0].innerHTML;
    locInput.value = fillWithContent[1].innerHTML;
    timeInput.value = fillWithContent[2].innerHTML;
    costInput.value = fillWithContent[3].innerHTML;
  }
  //console.log("the sender was the modal opener button");
  modal.style.display = "block";
  headerText.innerHTML = "Button clicked";
  modalBody.innerHTML = "This is the inner content!";
  titleInput.focus();
}


function closeModal() {
  modal.addEventListener("animationend", listener, false);

  modal.classList.add("modalFade");

  modalIsClosing = true;
  function listener() {
    if (modalIsClosing) { //Check if the closeBtn button set off the animation
      modal.classList.remove("modalFade");
      modal.style.display = "none";
      modalIsClosing = false;
    }
  }
}

function getContentsFromParentAsArray(parentItem) {
  //console.log('parentItem', parentItem);
  var contentsArray = [];
  contentsArray[0] = parentItem.getElementsByClassName("titleContent")[0];
  contentsArray[1] = parentItem.getElementsByClassName("locContent")[0];
  contentsArray[2] = parentItem.getElementsByClassName("timeContent")[0];
  contentsArray[3] = parentItem.getElementsByClassName("costArea")[0];
  return contentsArray;
}

function saveModalChanges(titleValue, locValue, timeValue, costValue) {
  var latestContent = getContentsFromParentAsArray(editTarget);
  latestContent[0].innerHTML = titleValue;
  latestContent[1].innerHTML = locValue;
  latestContent[2].innerHTML = timeValue;
  latestContent[3].innerHTML = costValue;
}

function addEntryItem() {
  dataArray.push([0,0,0]);
  var numOfLines = dataArray.length;
  var mainContainer = document.getElementById('mainContainer');

  if (dataArray.length > 1) {
    //Set up previous data
    var odometerReading = dataArray[dataArray.length-2][0];
    var petrolPrice = dataArray[dataArray.length-2][2];
  }

  // Data Area, Title Row, Location Row
  var newDataArea = createDivWithClassAndID("dataArea", numOfLines);
  var newTitleLabel = createDivWithClassAndID("titleLabel", numOfLines);
  var newTitleContent = createDivWithClassAndID("titleContent", numOfLines);
  var newLocLabel = createDivWithClassAndID("locLabel", numOfLines);
  var newLocContent = createDivWithClassAndID("locContent", numOfLines);
  var newTimeLabel = createDivWithClassAndID("timeLabel", numOfLines);
  var newTimeContent = createDivWithClassAndID("timeContent", numOfLines);

  newTitleLabel.innerHTML = "Name of item"; //CSS >> text-transform:uppercase;
  newLocLabel.innerHTML = "Location";
  newTimeLabel.innerHTML = "Time";

  newDataArea.appendChild(newTitleLabel);
  newDataArea.appendChild(newTitleContent);
  newDataArea.appendChild(newLocLabel);
  newDataArea.appendChild(newLocContent);
  newDataArea.appendChild(newTimeLabel);
  newDataArea.appendChild(newTimeContent);

  // Price Area
  var newCostArea = createDivWithClassAndID("costArea", numOfLines);

  // Delete Button
  var newDelButton = createItemWithClassAndID('span', "button delButton", numOfLines);
  newDelButton.innerHTML = " Remove Entry ";
  newDelButton.onclick = function() {
    var e = this.parentElement.parentElement;

    e.addEventListener("animationend", listener, false);
    e.classList.add('moveOut');

    function listener(f) {
      e.remove();
      entryUpdate();
    }
  }

  // Edit button
  var newEditButton = createItemWithClassAndID('span', "button delButton", numOfLines);
  newEditButton.innerHTML = " Edit ";
  newEditButton.onclick = function() {
    var e = this.parentElement.parentElement;
    openModal(e);
    console.log("Edit this:", e);
  }

  var newLabel = createItemWithClassAndID('span', "entryLabel", numOfLines);
  newLabel.innerHTML = "Entry " + numOfLines;

  // Card Area
  var newCardArea = createDivWithClassAndID("cardArea", numOfLines);
  //remember to set to flex-container type thing!
  newCardArea.appendChild(newDataArea);
  newCardArea.appendChild(newCostArea);
  newCardArea.appendChild(newDelButton);
  newCardArea.appendChild(newEditButton);

  var newEntryDiv = createDivWithClassAndID("entryDiv", numOfLines);
  newEntryDiv.classList.add("moveIn");
  newEntryDiv.appendChild(newLabel);
  newEntryDiv.appendChild(newCardArea);

  var latestEntries = document.getElementsByClassName("entryDiv");

  if ((latestEntries.length % 2) == 0) {
    newEntryDiv.classList.add('whiteBG');
  } else {
    newEntryDiv.classList.add('greyBG');
  }

  mainContainer.insertBefore(newEntryDiv, latestEntries[0]);

  entryUpdate();
}

function entryUpdate() {
  //updates Labels and info.
  //console.log("input Change");
  var entryLabels = document.getElementsByClassName('entryLabel');
  var entryDivs = document.getElementsByClassName('entryDiv');

  var workingArray = [];

  console.log("entryDiv Length: " + entryDivs.length);
  //entryLabels[(entryLabels.length-1)].innerHTML = "Last Entry";

  for (var i = 0; i < entryDivs.length; i++) {
    console.log("i number: " + i);
    entryLabels[i].innerHTML = "Entry " + (entryDivs.length - i);

    // if (i % 2 == 0) {
    //   //is Even. First table is always Even!
    //   entryDivs[i].classList.remove('greyBG');
    //   entryDivs[i].classList.add('whiteBG');
    //
    // } else {
    //   entryDivs[i].classList.remove('whiteBG');
    //   entryDivs[i].classList.add('greyBG');
    // }
    // resultsBox[i].innerHTML = "Results: </br>";
    // resultsBox[i].innerHTML += fuelConsumption + " L/100km </br>";
    // resultsBox[i].innerHTML += pricePerLitre + " $/L";

    // workingArray[i] = [distData, litresData, priceData];
  }

  //dataArray = workingArray.slice();

  //console.log(dataArray);
  //saveToLocalStorage(dataArray);
}

function createAddButton() {
  var numOfLines = dataArray.length;
  var btnContainer = document.getElementById('btnContainer');

  var newButton = createItemWithClassAndID('span', "button addBtn", "");
  newButton.innerHTML = " Add Entry ";
  newButton.onclick = function() {
    console.log("new Entry added");
    initDoc();
    createNewEntry();
  };
  btnContainer.appendChild(newButton);
}

function createItemWithClassAndID(itemType, name, idNum) {
  var newCreateItem = document.createElement(itemType);
  newCreateItem.id = name + idNum;
  newCreateItem.className = name;
  return newCreateItem;
}

function createDivWithClassAndID(name, idNum) {
  return createItemWithClassAndID('div', name, idNum);
}
function createInputWithClassAndID(inputType, name, idNum) {
  var newCreateInput = createItemWithClassAndID('input', name, idNum);
  newCreateInput.setAttribute("type", inputType);
  return newCreateInput;
}
