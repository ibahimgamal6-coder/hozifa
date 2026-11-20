var STF=['sheikh','ibrahim','mona','hagar','safaa'],pl=0;
firebase.auth().onAuthStateChanged(function(u){
  if(!u||!u.email)return;
  if(STF.indexOf(u.email.split('@')[0])<0){location.replace('parent.html');return}
  if(!pl){pl=1;var s=document.createElement('script');s.src='push.js';document.head.appendChild(s)}
});
