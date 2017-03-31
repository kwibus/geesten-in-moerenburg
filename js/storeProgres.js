var allowStorage = undefined
function checkCurrentquestion () {
    var lastquestion=undefined
    if (typeof(Storage) !== "undefined") {
            lastquestion = localStorage.getItem("currentquestion");
        if (!lastquestion){
            myConfirm ("Wil jij dat we je voortgang opslaan?"
                ,function (){allowStorage=true;}
                ,function (){allowStorage=false;}
            );
            lastquestion =   sessionStorage.getItem("currentquestion");
            if (!lastquestion){
                lastquestion=0;
            }
        }else {

            sessionLastquestion =  sessionStorage.getItem("currentquestion");
            if (sessionLastquestion){
                lastquestion=sessionLastquestion;
            }else{
                myConfirm ("wil je verdergaan waar je gebleven was"
                    ,function () {}
                    , function () {
                        deleteSaves();
                        allowStorage=0;
                        lastquestion=0;
                    }
                );
            }
        }

    } else {
        myWarning("uw browser heeft geen onderstuining voor het opslaan van uw voortgang");
        lastquestion= 0;
    }
    return lastquestion;
}
function deleteSaves (){
  sessionStorage.removeItem("currentquestion");
  localStorage.removeItem("currentquestion");
}

function trySave (){
   if (allowStorage){
        localStorage.setItem("currentquestion",currentquestion);
   }
   sessionStorage.setItem("currentquestion",currentquestion);
}
