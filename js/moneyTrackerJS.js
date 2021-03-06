// TO-DO 17 Aug morning:
// Replace div creation with simple html

// localStorage methods:
// retrieveLocalStorage(localStoreName) -> retrieved info
// clearLocalStorage(localStoreName) -> nothing
// saveToLocalStorage(localStoreName, saveItem) -> nothing
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

function htmlRun() {
  initValues();
  createAddButton();
  setupModal();
}

function initValues() {
  localStoreName = "moneyTracker";
  dataArray = retrieveLocalStorage(localStoreName);
  modalIsClosing = false;
  editingNewEntry = false;
  //console.log(localStorage.getItem(localStoreName));
  if (dataArray === null) {
    dataArray = [];
  } else {
    // Repopulate using a copy of the array data
    loadFromData(dataArray.slice());
  }
}

function loadFromData(inputDataArray) {
  // Repopulate!
  for (var i = inputDataArray.length-1; i >= 0; i--) {
    addEntryItem(inputDataArray[i]);
  }
  // Refresh cards:
  entryUpdate();
}

function setupModal() {
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

  window.onclick = function(event) {
    //console.log("btn:", openBtn);
    //console.log("event.target:", event.target);

    switch(event.target) {
      case modal:
        // Highlight the Done btn
        doneBtn.addEventListener("animationend", listener, false);
        doneBtn.classList.add('donePulse');
        function listener() {
          // When animation is done, remove the donePulse class!
          doneBtn.classList.remove('donePulse');
          }
        break;
      case doneBtn:
        // Modal was closed & Saved.
        // Check if all fields are filled -> save & close
        saveModalChanges(titleInput, locInput, timeInput, costInput);
        break;
      case openBtn:
        // Modal was opened!
        openModal("newEntry");
        break;
      case closeBtn:
        // Modal edit was cancelled!
        closeModal();
        if (editingNewEntry) {
          editTarget.remove();
        }
        break;
      default:
        // Do nothing.
        break;
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

function saveModalChanges(titleIn, locIn, timeIn, costIn) {
  var canSaveChanges = false;
  //console.log(titleIn.value);
  var iterableArr = [titleIn, locIn, timeIn, costIn];
  if (titleIn.value == "" || locIn.value == "" || timeIn.value == "" || costIn.value == "") {
    // Don't save if any one is not filled in!
    // Highlight the fields that need to be filled in!
    for (var i = 0; i < iterableArr.length; i ++) {
      iterableArr[i].classList.remove("highlightYellow");
      if (iterableArr[i].value == "") {
        iterableArr[i].classList.add("highlightYellow");
      }
    }
  } else {
    var latestContent = getContentsFromParentAsArray(editTarget);
    for (var i = 0; i < iterableArr.length; i ++) {
      iterableArr[i].classList.remove("highlightYellow");
      latestContent[i].innerHTML = iterableArr[i].value;
    }
    canSaveChanges = true;
    closeModal();
  }
  entryUpdate();
  return canSaveChanges;
}

function addEntryItem(withData) {
  var numOfLines = dataArray.length;
  var mainContainer = document.getElementById('mainContainer');

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
    // console.log("Edit this:", e);
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

  if (withData != undefined) {
    // Populate options with data
    newTitleContent.innerHTML = withData[0];
    newLocContent.innerHTML = withData[1];
    newTimeContent.innerHTML = withData[2];
    newCostArea.innerHTML = withData[3];
  } else {
    // New item
    dataArray.push([0,0,0,0]);
  }

  var latestEntries = document.getElementsByClassName("entryDiv");

  mainContainer.insertBefore(newEntryDiv, latestEntries[0]);
}

function entryUpdate() {
  // FIRES WHEN: Remove button clicked, New entry added, Entry saved.
  // Updates Labels and info.
  var entryLabels = document.getElementsByClassName('entryLabel');
  var entryDivs = document.getElementsByClassName('entryDiv');

  // Get data holders:
  var titleData = document.getElementsByClassName('titleContent');
  var locData = document.getElementsByClassName('locContent');
  var timeData = document.getElementsByClassName('timeContent');
  var costData = document.getElementsByClassName('costArea');

  var workingArray = [];

  //console.log("entryDiv Length: " + entryDivs.length);

  for (var i = 0; i < entryDivs.length; i++) {
    entryLabels[i].innerHTML = "Entry " + (entryDivs.length - i);

    if (i % 2 == 0) {
      //is Even. First table is always Even!
      entryDivs[i].classList.remove('greyBG');
      entryDivs[i].classList.add('whiteBG');

    } else {
      entryDivs[i].classList.remove('whiteBG');
      entryDivs[i].classList.add('greyBG');
    }
    //workingArray[i] = {};
    workingArray[i] = [titleData[i].innerHTML, locData[i].innerHTML, timeData[i].innerHTML, costData[i].innerHTML];
  }

  dataArray = workingArray.slice();
  saveToLocalStorage(localStoreName, dataArray);
}

function createAddButton() {
  var btnContainer = document.getElementById('btnContainer');

  var newButton = createItemWithClassAndID('span', "button addBtn", "");
  newButton.innerHTML = " Add Entry ";
  newButton.onclick = function() {
    //console.log("new Entry added");
    addEntryItem();
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

function wasKeyANumber(e) {
  //Get keypress character:
  var eventKey = (typeof e.which == "number") ? e.which : e.keyCode;
  var validKey = false;
  //console.log(e);
  if ((e.ctrlKey || e.metaKey == true) && (eventKey == 97 || eventKey == 99 || eventKey == 120 || eventKey == 121 || eventKey == 122)) {
    // Check if cmd OR ctrl are pressed:
    // a=97; c=99; x=120; y=121; z=122;
    validKey = true;
  } else {
    // Check if a number key was pressed.
    validKey = ((eventKey >= 48 && eventKey <= 57) || eventKey == 46);
  }
  return validKey;
}
