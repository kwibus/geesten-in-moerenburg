function myAlert(string){
    swal('Oops...', string, 'error');
}

function myWarning(sting){
    swal("warning",sting ,'warning');
}
function myConfirm (string,whenSucces,whenFail){

swal({
    title:string,
    type:'question',
    showCancelButton: true,

    }).then( whenSucces, whenFail);
}
