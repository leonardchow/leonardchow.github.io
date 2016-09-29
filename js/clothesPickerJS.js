var verbose = false;

var modal;
var modalContent;
var modalHeader;
var modalImageContainer;
var imageFrame;

var bodyPartHead;

var currentTargetPart;

var imageSetPath = "../images/";
var imageSetObject = {
  "imageSetHead" : {
    "setDescription" : "Please select an image for your character's head!",
    "imagePaths" : ["freshscanlogo.png", "freshscanlogo-flipped.png", "freshscanlogo.png", "freshscanlogo-flipped.png","freshscanlogo.png", "freshscanlogo-flipped.png","freshscanlogo.png", "freshscanlogo-flipped.png"]
  }

};

function htmlLoaded() {
  setupModal();
}

function setupModal() {
  setupItems();

  window.onclick = function(event) {
    //toCONSOLE(event.target);

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

  bodyPartHead = document.getElementById("bodyPartHead");
}

function openModal(target, imageSet) { // Main body part opens modal.
  currentTargetPart = target.target;
  setupImages(imageSet);

  modal.setAttribute("style", "display: block");
}

function imgClicked(e) { // User selects a graphic for body part.
  toCONSOLE(event.target.parentElement);
  var sender = e.target;

  currentTargetPart.setAttribute("src", sender.getAttribute("src"));

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
  toCONSOLE(imageSet);
  var imageSetArray = imageSetObject[imageSet].imagePaths;

  var numberOfImages = imageSetArray.length;
  var imageFrameProto = imageFrame.cloneNode(true);
  imageFrame.remove();

  modalImageContainer.innerHTML = "";

  for (var i=0; i < numberOfImages; i++) {
    var imageFrameToAdd = imageFrameProto.cloneNode(true);
    var currImagePath = imageSetPath + imageSetArray[i];

    imageFrameToAdd.id = "img" + i;

    var imgElement = imageFrameToAdd.getElementsByClassName("imagePick")[0];
    imgElement.setAttribute("src", currImagePath);
    //imgElement.setAttribute("onclick", "imgClicked(event);");

    var description = imageFrameToAdd.getElementsByClassName("imageDesc")[0];
    description.innerHTML = "img " + i;

    modalImageContainer.appendChild(imageFrameToAdd);
  }
}

function toCONSOLE(message) {
  if (verbose)
    console.log(messsage);
}
