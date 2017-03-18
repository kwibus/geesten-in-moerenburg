
currentquestion=checkCurrentquestion();

function setcurrentQuestion(n){
    currentquestion=0;
    while (currentquestion < n){
        nextTab();
        if (document.getElementById("questions"+curentlocation)){
          anserCorrect();
        }
        nextgoal();
    }
}

function correct(){
    anserCorrect();
    trySave();
    nextgoal();
    highlightGoal();
}

function anserCorrect(){
    document.getElementById("mark"+currentquestion).classList.remove("hidden");
    questions=document.getElementById("questions"+currentquestion)
        .getElementsByClassName("question");
    for (var q of  questions){
        q.disabled=true;
    }
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


