var allowStorage = undefined
function checkCurrentquestion () {
    var lastquestion=undefined
    if (typeof(Storage) !== "undefined") {
            lastquestion = localStorage.getItem("currentquestion");
        if (!lastquestion){
            allowStorage = confirm("sta je toe om je voortgang locale opteslaan?");
            lastquestion =   sessionStorage.getItem("currentquestion");
            if (!lastquestion){
                lastquestion=0;
            }else{
                setcurrentQuestion(lastquestion);
            }
        }else {

            sessionLastquestion =  sessionStorage.getItem("currentquestion");
            if (sessionLastquestion){
                lastquestion=sessionLastquestion;
                setcurrentQuestion(lastquestion);
            }else{
                if (confirm("wil je verdergaan waar je gebleven was")){
                    setcurrentQuestion(lastquestion);
                } else {
                    deleteSaves();
                    allowStorage=0;
                    lastquestion=0;
                }
            }
        }

    } else {
        alert("uw browser heeft geen onderstuining voor het opslaan van uw voortgang");
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
