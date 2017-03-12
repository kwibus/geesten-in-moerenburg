
currentquestion=0;

function correct(){
    document.getElementById("mark"+currentquestion).style.display="block";
    questions=document.getElementById("questions"+currentquestion)
        .getElementsByClassName("question");
    for (var q of  questions){
        q.disabled=true;
    }
    nextgoal();
}
function incorrect () {
  alert ("fout");
 document.getElementById("hint"+currentquestion).style.display="block";
}

function nextTab (){
    currentquestion++;
    document.getElementById("tab"+currentquestion).style.display="block";
    sidebar.open("opdracht"+currentquestion);
}


