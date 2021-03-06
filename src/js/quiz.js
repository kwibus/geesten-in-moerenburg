var Alert = require('./myAlert.js');
var Store = require('./storeProgres.js');


// TODO  make code less statefull (depencey on global variable currentquestion)
var currentquestion=0;

function tryDisableLinkGoal (){

  if (document.getElementById('next'+currentquestion)){
    var nextLink = document.getElementById('next'+currentquestion);
    nextLink.removeAttribute('href');
    nextLink.removeAttribute('onClick');
  }
}

function setcurrentQuestion(n){

  currentquestion=0;
  while (currentquestion < n){
    anserCorrect();
    nextTab();
  }
  currentquestion = n;
  if (n !== 0){
    anserCorrect();
    sidebar.close();
  }
}


function correct(){

  var audio = new Audio('audio/success.mp3');
  audio.play();
  anserCorrect();
  Store.trySave(currentquestion);
  nextgoal(); //TODO for now nextgoal is global
  highlightGoal();
}

function anserCorrect(){
  tryDisableLinkGoal();
  tryAnserquestion();
  tryAnserRebus();
}

function tryAnserquestion(){

  if (document.getElementById('questions' + currentquestion)){
    document.getElementById('mark' + currentquestion).classList.remove('hidden');
    var questions = document.getElementById('questions' + currentquestion)
      .getElementsByClassName('button');
    for (var i =0;i < questions.length; i++ ){
      questions[i].disabled=true;
    }
  }
}

function incorrect () {

  document.activeElement.blur();
  var hint =document.getElementById('hint' + currentquestion);
  hint.classList.remove('hidden');
  Alert.myAlert('Verkeerd antwoord!');
  hint.scrollIntoView({block:'start',behaviour:'smooth'});
}

function nextTab (){

  currentquestion++;
  document.getElementById('tab' + currentquestion).classList.remove('disabled');
  sidebar.open('stop' + currentquestion);
}

function skipQuestion (){
  if (document.getElementById('next' + currentquestion)){
    Store.trySave(currentquestion);
    return true;
  } else {
    return false;
  }
}

var rebuscorect = 0;
var rebusAnser = 'hetslotvanhetspel';

function tryAnserRebus (){
  var rebus=document.getElementById('rebus' + currentquestion);
  if (rebus != undefined){

    var letterboxes= rebus.getElementsByClassName('letterbox');
    for (var n = 0;  n < rebusAnser.length ; n++) {
      letterboxes[n].value = rebusAnser.charAt(n);
      correctLetter(letterboxes[n],n);
    }
  }
}

function correctLetter (id,n){
  id.disabled=true;
  document.getElementById('markWrong' + n).classList.add('hidden');
  document.getElementById('markCorrect' + n).classList.remove('hidden');
}

function checkKey (id,n){
  id.value=id.value.toLowerCase();
  if (id.value===rebusAnser.charAt(n)){
    correctLetter(id,n);
    rebuscorect++;
    if(rebuscorect>=rebusAnser.length){

      nextTab();

      Store.trySave(currentquestion);
      var audio = new Audio('audio/victory.mp3');
      audio.play();
    }
  }else{
    document.getElementById('markWrong' + n).classList.remove('hidden');
  }
  id.blur();
}

module.exports.skipQuestion = skipQuestion;
module.exports.tryDisableLinkGoal = tryDisableLinkGoal;
module.exports.incorrect= incorrect;
module.exports.correct= correct;
module.exports.nextTab = nextTab;
module.exports.setcurrentQuestion = setcurrentQuestion;
module.exports.checkKey = checkKey;
