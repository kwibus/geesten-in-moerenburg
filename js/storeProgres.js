var allowStorage = true;
function checkCurrentquestion () {
    var lastquestion=0;
    if (typeof(Storage) !== "undefined") {
      var sessionLastquestion = sessionStorage.getItem("currentquestion");
      if (sessionLastquestion == null ){

        var localLastquestion = localStorage.getItem("currentquestion");
        if (localLastquestion != null){
          lastquestion=localLastquestion;
          myConfirm ("wil je verdergaan waar je gebleven was"
            ,function () {}
            ,function () {
              deleteSaves();
              location.reload(true);
            }
          );
        }
      }else{
        lastquestion=sessionLastquestion;
      }

    } else {
        myWarning("uw browser heeft geen onderstuining voor het opslaan van uw voortgang");
    }
    return lastquestion;
}

function deleteSaves (){
  sessionStorage.removeItem("currentquestion");
  localStorage.removeItem("currentquestion");
}

function trySave (currentquestion){
   if (allowStorage){
        localStorage.setItem("currentquestion",currentquestion);
   }
   sessionStorage.setItem("currentquestion",currentquestion);
}
