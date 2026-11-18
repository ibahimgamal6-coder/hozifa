var STF=['sheikh','ibrahim','mona','hagar','safaa'];
firebase.auth().onAuthStateChanged(function(u){if(u&&u.email&&STF.indexOf(u.email.split('@')[0])<0)location.replace('parent.html')});
