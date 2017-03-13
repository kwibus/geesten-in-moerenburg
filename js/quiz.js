
currentquestion=checkCurrentquestion();

function setcurrentQuestion(n){
    currentquestion=0;
    for (var i = 0; i< n;i++){
        nextTab();
        nextgoal();
    }
}

function correct(){
    document.getElementById("mark"+currentquestion).style.display="block";
    questions=document.getElementById("questions"+currentquestion)
        .getElementsByClassName("question");
    for (var q of  questions){
        q.disabled=true;
    }
    trySave();
    nextgoal();
}
function incorrect () {
  alert ("fout");
 document.getElementById("hint"+currentquestion).style.display="block";
}

function nextTab (){
    currentquestion++;
    document.getElementById("tab"+currentquestion).classList.remove("disabled");
    sidebar.open("opdracht"+currentquestion);
}


