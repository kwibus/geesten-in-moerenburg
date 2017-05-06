var swal = require('sweetalert2');
function myAlert(string){
    swal('Oops...', string, 'error');
}

function myWarning(string){
    swal("warning",string ,'warning');
}
function myConfirm (string,whenSucces,whenFail){
  if (L.Browser.ielt9 || L.Browser.msPointer){
    if (confirm(string)){
      whenSucces();
    }else {
      whenFail();
    }
  }else {
    swal({
      title:string,
      type:'question',
      showCancelButton: true,

    }).then( whenSucces, whenFail);
  }
}

module.exports.myConfirm=myConfirm;
module.exports.myAlert=myAlert;
module.exports.myWarning=myWarning;
