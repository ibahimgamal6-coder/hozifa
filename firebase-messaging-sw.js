importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyCSKolz-EyLB_stw51gwqhjP6iQizbfjWQ",authDomain:"hozifa-2b8ab.firebaseapp.com",projectId:"hozifa-2b8ab",storageBucket:"hozifa-2b8ab.firebasestorage.app",messagingSenderId:"1015605148858",appId:"1:1015605148858:web:d93f27bcd8d9291a449683"});
var mg=firebase.messaging();
mg.onBackgroundMessage(function(p){
  var d=p.data||{};
  return self.registration.showNotification(d.title||'مركز حذيفة',{
    body:d.body||'',
    icon:'/icon-512.png?v=2',
    badge:'/icon-512.png?v=2',
    dir:'rtl',
    lang:'ar',
    vibrate:[120,60,120],
    tag:d.tag||undefined,
    data:{url:d.url||'/'}
  });
});
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  var u=new URL((e.notification.data&&e.notification.data.url)||'/',self.location.origin).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){
    for(var i=0;i<l.length;i++){if(l[i].url.indexOf(self.location.origin)===0&&'focus' in l[i]){l[i].navigate(u);return l[i].focus()}}
    return clients.openWindow(u);
  }));
});
