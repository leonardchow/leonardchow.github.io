var modal;
var modalIsClosing;
var btn;
var span;
var textField;
var displayArea;
var headerText;
var modalBody;
var modalSender;
var modalOpenerArr;

function htmlRun() {
  initDoc();
}

function initDoc() {
  // Get the modal
  modalOpenerArr = document.getElementsByClassName('modalOpener');
  modal = document.getElementById('myModal');
  //Set a variable to determine what element fires the animation
  modalIsClosing = false;
  // Get the button that opens the modal
  btn = document.getElementById("myBtn");
  // Get the <span> element that closes the modal
  closeBtn = document.getElementById("closeBtn");
  textField = document.getElementById("textField1");
  displayArea = document.getElementById("displayArea");
  headerText = document.getElementById("headerText");
  modalBody = document.getElementById("modalBody");

  // When the user clicks the button, open the modal
  // btn.onclick = function() {
  //     modal.style.display = "block";
  //     headerText.innerHTML = "Button clicked";
  //     modalBody.innerHTML = "This is the inner content!";
  //     textField.focus();
  // }

  textField.onchange = function() {
    displayArea.innerHTML = textField.value;
  }

  // When the user clicks anywhere outside of the modal, close it
  // OR When the user clicks on <span> (x), close the modal
  window.onclick = function(event) {
    console.log(event.target);

      if (event.target == modal || event.target == closeBtn) {
        closeModal();
      } else if (event.target == modalOpenerArr[0]) {
        console.log("the sender was the modal opener button");
        modal.style.display = "block";
        headerText.innerHTML = "Button clicked";
        modalBody.innerHTML = "This is the inner content!";
        textField.focus();
      }
  }
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
