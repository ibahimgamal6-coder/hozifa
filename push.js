(function(){
'use strict';
var VAPID='BAFJhrk3MBNUzxlD-BnBusl6PKd5KtJmPglGDm8rgDH_Uk3yz924LPU6FII21Z4-mR0I_uf47HqwkBHh8mpy4CU',
STF=['sheikh','ibrahim','mona','hagar','safaa'],mg=null,btn=null;
if(!('Notification' in window)||!('serviceWorker' in navigator)||!('PushManager' in window))return;
function ready(f,n){if(window.firebase&&firebase.apps&&firebase.apps.length)f();else if(n>0)setTimeout(function(){ready(f,n-1)},400)}
function ld(src,cb){var s=document.createElement('script');s.src=src;s.onload=cb;document.head.appendChild(s)}
function h(s){var x=5381,i;for(i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))>>>0;return x.toString(36)}
function role(u){return STF.indexOf((u.email||'').split('@')[0])>-1?'staff':'parent'}
function why(e){return (e&&(e.code||e.message))||'unknown'}
function chime(){try{var a=new(window.AudioContext||window.webkitAudioContext)(),t=a.currentTime;[660,880].forEach(function(f,i){var o=a.createOscillator(),g=a.createGain(),s=t+i*.18;o.frequency.value=f;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.001,s);g.gain.exponentialRampToValueAtTime(.15,s+.03);g.gain.exponentialRampToValueAtTime(.001,s+.4);o.start(s);o.stop(s+.45)})}catch(e){}}
function banner(m){var d=document.createElement('div');d.textContent=m;d.style.cssText='position:fixed;top:12px;left:12px;right:12px;z-index:99999;padding:12px 16px;border-radius:14px;background:#0b2a1f;border:1px solid #e6c15a;color:#f6e3a1;font:600 15px Cairo,system-ui,sans-serif;text-align:center;direction:rtl;box-shadow:0 8px 30px rgba(0,0,0,.5)';document.body.appendChild(d);setTimeout(function(){d.remove()},9000)}
function active(r){
  return new Promise(function(res,rej){
    var n=0;
    (function chk(){
      if(r.active&&r.active.state==='activated')return res(r);
      if(++n>40)return rej(new Error('sw-not-active'));
      setTimeout(chk,250);
    })();
  });
}
function enable(u){
  return navigator.serviceWorker.register('firebase-messaging-sw.js',{scope:'./fcm-scope/'}).then(active).then(function(r){
    return mg.getToken({vapidKey:VAPID,serviceWorkerRegistration:r});
  }).then(function(t){
    if(!t)throw new Error('no-token');
    return firebase.firestore().collection('tok').doc(u.uid+'_'+h(t)).set({t:t,role:role(u),uid:u.uid});
  });
}
function show(u){
  if(btn)return;
  btn=document.createElement('button');
  btn.textContent='🔔 فعّل الإشعارات';
  btn.style.cssText='position:fixed;left:12px;bottom:92px;z-index:9999;border:0;border-radius:999px;padding:11px 18px;background:linear-gradient(120deg,#e6c15a,#f6e3a1);color:#1a1405;font:700 15px Cairo,system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45);cursor:pointer';
  btn.onclick=function(){
    Notification.requestPermission().then(function(p){
      if(p!=='granted'){btn.remove();btn=null;return}
      return enable(u).then(function(){btn.remove();btn=null;banner('تم تفعيل الإشعارات ✅')});
    }).catch(function(e){console.error(e);banner('تعذّر التفعيل: '+why(e))});
  };
  document.body.appendChild(btn);
}
ready(function(){
  ld('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',function(){
    if(!firebase.messaging.isSupported())return;
    mg=firebase.messaging();
    mg.onMessage(function(p){var d=p.data||{};chime();banner((d.title||'')+(d.body?' — '+d.body:''))});
    firebase.auth().onAuthStateChanged(function(u){
      if(!u||Notification.permission==='denied')return;
      if(Notification.permission==='granted')enable(u).then(function(){banner('الإشعارات مفعّلة ✅')}).catch(function(e){console.error(e);banner('تعذّر التفعيل: '+why(e))});
      else show(u);
    });
  });
},50);
})();
