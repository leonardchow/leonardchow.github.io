// localStorage methods:
// retrieveLocalStorage(localStoreName) -> retrieved info
// clearLocalStorage(localStoreName) -> nothing
// saveToLocalStorage(localStoreName, saveItem) -> nothing
var localStoreName;
var dataArray;

var modal;
var modalContent;
var modalHeader;
var modalImageContainer;
var imageFrame;
var outputContainer;
var result;

var bodyPartArray = [];
var bodyPartArrayHeadID = "h";
var bodyPartArrayTorsoID = "t";
var bodyPartHead;
var bodyPartTorso;

var currentTargetPart;
var currentImageSet;

// var imageSetPath = "../images/";
// var imageSetObject = {
//   "imageSetHead" : {
//     "setDescription" : "Please select an image for your character's head!",
//     "imagePaths" : ["freshscanlogo.png", "freshscanlogo-flipped.png", "freshscanlogo.png", "freshscanlogo-flipped.png","freshscanlogo.png", "freshscanlogo-flipped.png","freshscanlogo.png", "freshscanlogo-flipped.png"]
//   }
//
// };

function htmlLoaded() {
  setupModal();
  console.log(retrieveLocalStorage(localStoreName));
  initValues();
}

function initValues() {
  localStoreName = "clothesPicker";
  dataArray = retrieveLocalStorage(localStoreName);

  if (dataArray === null) {
    dataArray = [];
  } else {
    // Repopulate using a copy of the array data
    loadFromData(dataArray.slice());
  }
}

function loadFromData(inputDataArray) {
  // Repopulate!
  for (var i = 0; i < inputDataArray.length; i++) {
    var loadImagePath;
    var inputData = inputDataArray[i];

    if (inputData != null) {

      switch (inputData[0]) {
        case bodyPartArrayHeadID:
          loadImagePath = imageSetObject['imageSetHead']['imagePaths'][inputData[1]];
          bodyPartHead.setAttribute("src", loadImagePath); // Set the body part caller to the image that was clicked.
          break;
        case bodyPartArrayTorsoID:
          loadImagePath = imageSetObject['imageSetTorso']['imagePaths'][inputData[1]];
          bodyPartTorso.setAttribute("src", loadImagePath); // Set the body part caller to the image that was clicked.
          break;
        default:

      }

      bodyPartArray = inputDataArray.slice();
      result.innerHTML = bodyPartArray.join('');
      outputContainer.setAttribute("style", "display: block");

    }
  }
}

function setupModal() {
  setupItems();

  window.onclick = function(event) {
    //console.log(event.target);

    switch(event.target) {
      case modal:
        modal.setAttribute("style", "display: none");
        break;
      default:
        // Do nothing.
        break;
    }
  }

}

function setupItems() {
  modal = document.getElementsByClassName("modal")[0];
  modalContent = document.getElementsByClassName("modalContent")[0];
  modalHeader = document.getElementsByClassName("modalHeader")[0];
  modalImageContainer = document.getElementsByClassName("modalImageContainer")[0];
  imageFrame = document.getElementsByClassName("imageFrame")[0];
  imagePickArray = document.getElementsByClassName("imagePick");

  outputContainer = document.getElementById("outputContainer");
  result = document.getElementById("result");

  bodyPartHead = document.getElementById("bodyPartHead");
  bodyPartTorso = document.getElementById("bodyPartTorso");
}

function openModal(target, imageSet) { // Main body part opens modal.
  currentTargetPart = target.target;
  currentImageSet = imageSet;
  setupImages(imageSet);

  modal.setAttribute("style", "display: block");
}

function imgClicked(e) { // User selects a graphic for body part.
  var sender = e.target; // Which image was clicked.

  var senderImg = sender.id;
  var senderID = senderImg.split("g")[1];
  console.log(senderID);


  currentTargetPart.setAttribute("src", sender.getAttribute("src")); // Set the body part caller to the image that was clicked.

  switch (currentImageSet) {
    case 'imageSetHead':
      bodyPartArray[0] = bodyPartArrayHeadID + senderID;
      break;
    case 'imageSetTorso':
      bodyPartArray[1] = bodyPartArrayTorsoID + senderID;
      break;
    default:
  }

  result.innerHTML = bodyPartArray.join('');
  outputContainer.setAttribute("style", "display: block");

  dataArray = bodyPartArray.slice();
  saveToLocalStorage(localStoreName, dataArray);

  closeModal();
}

function modalBGClicked() {
  closeModal();
}

function closeModal() {
  modal.setAttribute("style", "display: none");
}

function setupImages(imageSet) {
  modalHeader.innerHTML = imageSetObject[imageSet].setDescription;
  var imageSetArray = imageSetObject[imageSet].imagePaths;

  var numberOfImages = imageSetArray.length;
  var imageFrameProto = imageFrame.cloneNode(true);
  imageFrame.remove();

  modalImageContainer.innerHTML = ""; // Clear modal content first.

  for (var i=0; i < numberOfImages; i++) {
    var imageFrameToAdd = imageFrameProto.cloneNode(true);
    var currImagePath = imageSetArray[i];

    imageFrameToAdd.id = "imgFrame" + i;

    var imgHolder = imageFrameToAdd.getElementsByClassName("imageHolder")[0];
    imgHolder.id = "imgHolder" + i;

    var imgElement = imageFrameToAdd.getElementsByClassName("imagePick")[0];
    imgElement.id = "img" + i;
    imgElement.setAttribute("src", currImagePath);

    var description = imageFrameToAdd.getElementsByClassName("imageDesc")[0];

    // Image descriptions!
    description.innerHTML = ""; // = "img " + i;

    modalImageContainer.appendChild(imageFrameToAdd);
  }
}
