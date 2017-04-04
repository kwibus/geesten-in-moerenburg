var currentquestion=0;
function setcurrentQuestion(n){

    currentquestion=0;
    while (currentquestion < n){
        nextTab();
        anserCorrect();
    }
    currentquestion=n;
    sidebar.close();
}

function correct(){
    anserCorrect();
    trySave();
    nextgoal();
    highlightGoal();
}

function anserCorrect(){

    if (document.getElementById("questions"+currentquestion)){
      document.getElementById("mark"+currentquestion).classList.remove("hidden");
      questions=document.getElementById("questions"+currentquestion)
            .getElementsByClassName("question");
      for (var i =0;i < questions.length; i++ ){
          questions[i].disabled=true;
      }
    }
}

function incorrect () {

  document.activeElement.blur();
  var hint =document.getElementById("hint"+currentquestion);
  hint.style.display="block";
  myAlert("Verkeerde antwoord!");
  hint.scrollIntoView({block:'start',behaviour:'smooth'});
}

function nextTab (){
    currentquestion++;
    document.getElementById("tab"+currentquestion).classList.remove("disabled");
    sidebar.open("stop"+currentquestion);
}

rebuscorect=0;
rebusAnser="hetslotvanhetspel";
function checkKey (id,n){
    id.value=id.value.toLowerCase();
    if (id.value===rebusAnser.charAt(n)){
        id.disabled=true;
        document.getElementById("markWrong"+n).classList.add("hidden");
        document.getElementById("markCorrect"+n).classList.remove("hidden");
        rebuscorect++;
        if(rebuscorect>=rebusAnser.length)
        {

            document.getElementById("tab10").classList.remove("disabled");
            sidebar.open("stop10");

            var audio = new Audio("victory.mp3");
            audio.play();
        }
    }else {
        document.getElementById("markWrong"+n).classList.remove("hidden");
    }
}
