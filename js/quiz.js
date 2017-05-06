var currentquestion=0;

function disableLinkGoal (){

        if (document.getElementById("next"+currentquestion)){
          var nextLink = document.getElementById("next"+currentquestion);
          nextLink.removeAttribute("href");
          nextLink.removeAttribute("onClick");

        }
}

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

    var audio = new Audio("Success.mp3");
    audio.play();
    anserCorrect();
    trySave();
    nextgoal();
    highlightGoal();
}

function anserCorrect(){
  disableLinkGoal();
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
  myAlert("Verkeerd antwoord!");
  hint.scrollIntoView({block:'start',behaviour:'smooth'});
}

function nextTab (){
  currentquestion++;

  document.getElementById("tab"+currentquestion).classList.remove("disabled");
  sidebar.open("stop"+currentquestion);
}

function skipQuestion (){
  if (document.getElementById("next" + currentquestion)){
    trySave(currentquestion);
    return true;
  } else {
    return false;
  }
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
