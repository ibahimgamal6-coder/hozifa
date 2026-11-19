au.onAuthStateChanged(function(u){if(!u)return;g('parents/'+u.uid).then(function(p){var k=(p&&p.kids)||[];if(!k.length)return;
 Promise.all(k.map(function(id){return g('st/'+id)})).then(function(ss){var cs=ss.filter(Boolean).map(function(s){return s.c});
  db.collection('ann').get().then(function(q){var a=[];q.forEach(function(d){a.push(d.data())});
   a=a.filter(function(x){return!x.c||cs.indexOf(x.c)>-1}).sort(function(x,y){return x.d<y.d?1:-1}).slice(0,5);if(!a.length)return;
   var h='<div class="c"><h2>📢 إعلانات المركز</h2>'+a.map(function(x){return'<div class="li"><b>'+esc(x.t)+'</b> <span class="sub">· '+fd(x.d)+'</span><div style="white-space:pre-wrap;margin-top:4px">'+esc(x.b)+'</div></div>'}).join('')+'</div>',n=0,t=setInterval(function(){var m=$('m');if(m&&m.querySelector('.c')&&!m.querySelector('.sk')){clearInterval(t);m.insertAdjacentHTML('afterbegin',h)}else if(++n>40)clearInterval(t)},250)},function(){})})})});
