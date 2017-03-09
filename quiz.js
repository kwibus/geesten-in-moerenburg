

currentquestion=1;
function correct (){
    document.getElementById("mark"+currentquestion).style.display="block";
    questions=document.getElementById("questions"+currentquestion)
        .getElementsByClassName("question");
    for (var q of  questions){
        q.disabled=true;
    }
    next();
}

function next (){
    currentquestion++;
    document.getElementById("tab2").style.display="block";
    sidebar.open("opdracht"+currentquestion);
}


