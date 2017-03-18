
currentquestion=checkCurrentquestion();

function setcurrentQuestion(n){
    currentquestion=0;
    while (currentquestion < n){
        nextTab();
          anserCorrect();
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

    if (document.getElementById("questions"+curentlocation)){
      document.getElementById("mark"+currentquestion).classList.remove("hidden");
      questions=document.getElementById("questions"+currentquestion)
          .getElementsByClassName("question");
      for (var q of  questions){
          q.disabled=true;
      }
    }else if (document.getElementById("next1")){
      nextgoal();
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


