// localStorage methods:
// retrieveLocalStorage(localStoreName) -> retrieved info
// clearLocalStorage(localStoreName) -> nothing
// saveToLocalStorage(localStoreName, saveItem) -> nothing
function localStorageExists() {
  var storeExists = false;
  if (typeof(Storage) !== "undefined") {
    storeExists = true;
  }
  return storeExists;
}

function retrieveLocalStorage(localStoreName) {
  var retrieveInfo = null;
  if (localStorageExists()) {
    if (localStorage.getItem(localStoreName) !== null) {
      retrieveInfo = JSON.parse(localStorage.getItem(localStoreName));
      // console.log(retrieveInfo);
    }
  }
  return retrieveInfo;
}

function clearLocalStorage(localStoreName) {
  if (localStorageExists()) {
    localStorage.removeItem(localStoreName);
  }
  location.reload();
}

function saveToLocalStorage(localStoreName, saveItem) {
  if (localStorageExists()) {
    localStorage.setItem(localStoreName, JSON.stringify(saveItem));
  }
}
