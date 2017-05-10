var Alert = require('./myAlert');


function checkCurrentquestion () {
  var lastquestion=0;
  if (typeof(Storage) !== 'undefined') {
    var sessionLastquestion = sessionStorage.getItem('currentquestion');
    if (sessionLastquestion == undefined || sessionLastquestion == null ){

      var localLastquestion = localStorage.getItem('currentquestion');
      if (localLastquestion != null){
        lastquestion=localLastquestion;
        Alert.myConfirm ('wil je verdergaan waar je gebleven was'
          ,function () {}
          ,function () {
            deleteSaves();
            location.reload(true);
          }
        );
      }
    }else{
      lastquestion=sessionLastquestion;
    }

  } else {
    Alert.myWarning('uw browser heeft geen onderstuining voor het opslaan van uw voortgang');
  }
  return lastquestion;
}

function deleteSaves (){
  sessionStorage.removeItem('currentquestion');
  localStorage.removeItem('currentquestion');
}

function trySave (currentquestion){
  localStorage.setItem('currentquestion',currentquestion);
  sessionStorage.setItem('currentquestion',currentquestion);
}

module.exports.checkCurrentquestion = checkCurrentquestion;
module.exports.trySave = trySave;

module.exports.deleteSaves = deleteSaves;
