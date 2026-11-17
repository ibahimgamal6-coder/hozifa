document.head.insertAdjacentHTML('beforeend','<style>body:not([data-adm]) #fsum{display:none!important}</style>');
var _Rh=R;R=function(){_Rh();if(adm())document.body.setAttribute('data-adm','1');else document.body.removeAttribute('data-adm')};
firebase.auth().onAuthStateChanged(function(){R()});
R();
