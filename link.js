function lt(p){return(p||'').replace(/\D/g,'').slice(-10)}
function mp(r,sid){return r.uid?fs.doc('parents/'+r.uid).set({kids:firebase.firestore.FieldValue.arrayUnion(sid),ph:r.ph,pn:r.pn},{merge:true}):Promise.resolve()}
rQ=function(){var sv={},l=$('rql');l.querySelectorAll('select').forEach(function(s){sv[s.id]=s.value});
 l.innerHTML='<div class="card"><h2>📝 طلبات التسجيل ('+D.reg.length+')</h2><div class="sub">ابعت الرابط لأولياء الأمور. كل ولي أمر بينشئ حسابه بنفسه، وإنت بتعتمد الطلب فيتفتحله حسابه.</div><div class="row" style="margin:8px 0;justify-content:flex-start"><button class="g" id="rcp">نسخ الرابط</button><a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent('سجّل ابنك في مركز حذيفة بن اليمان من هنا: '+RU)+'">📲 مشاركة</a></div>'+
 D.reg.map(function(r){var ms=D.st.filter(function(s){return s.ph&&lt(s.ph)===lt(r.ph)});return'<div class="card" style="margin:8px 0"><b>'+esc(r.n)+'</b><div class="sub">ولي الأمر: '+esc(r.pn)+' · '+esc(r.ph)+(r.ag?' · السن '+esc(r.ag):'')+'</div>'+(r.m?'<div class="sub">حافظ: '+esc(r.m)+'</div>':'')+
  (ms.length?'<div class="sub" style="margin-top:6px">يوجد طلاب بنفس الرقم، اربط الحساب بالطالب الموجود:</div>'+ms.map(function(s){return'<button class="g" style="margin:4px 4px 0 0" data-a="lk" data-i="'+r.id+'" data-s="'+s.id+'">🔗 ربط بـ '+esc(s.name)+'</button>'}).join(''):'')+
  '<div class="sub" style="margin-top:8px">أو اعتماد كطالب جديد:</div><select id="rc_'+r.id+'">'+(adm()?'<option value="">بدون فصل</option>':'')+copt('')+'</select><select id="rl_'+r.id+'">'+lvo()+'</select><div class="row"><button data-a="ra2" data-i="'+r.id+'">✅ اعتماد وإنشاء الحساب</button><button class="r" data-a="rj2" data-i="'+r.id+'">رفض</button></div></div>'}).join('')+'</div>';
 l.querySelectorAll('select').forEach(function(s){if(sv[s.id]!==undefined)s.value=sv[s.id]});
 $('n-stu').innerHTML='<span>👥</span>الطلاب'+(D.reg.length?' ('+D.reg.length+')':'')};
document.addEventListener('click',function(e){var b=e.target.closest('[data-a=ra2],[data-a=rj2],[data-a=lk]');if(!b)return;var id=b.dataset.i,a=b.dataset.a,r=D.reg.filter(function(x){return x.id===id})[0];if(!r)return;var sid,st;
 if(a==='rj2'){D.reg=D.reg.filter(function(x){return x.id!==id});save();R();toast('تم الرفض');return}
 if(a==='lk')sid=b.dataset.s;else{var c=$('rc_'+id).value;if(!c&&!adm()){toast('اختر الفصل أولاً');return}sid='s'+Date.now()+Math.random().toString(36).slice(2,6);st={id:sid,name:r.n,l:$('rl_'+id).value,s:78,d:1,pn:r.pn,ph:r.ph,h:[],c:c,mm:r.m||''}}
 mp(r,sid).then(function(){if(st)D.st.push(st);D.reg=D.reg.filter(function(x){return x.id!==id});save();R();toast(a==='lk'?'تم ربط حساب ولي الأمر':'تم اعتماد الطالب وإنشاء حساب ولي الأمر')},function(){toast('تعذّر ربط الحساب، راجع قواعد Firebase')})});
R();
