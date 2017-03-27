function myAlert(string){
    swal('Oops...', string, 'error');
}

function myWarning(sting){
    swal("warning",sting ,'warning');
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
