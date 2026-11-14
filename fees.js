D.pay=D.pay||{};var pay0=0;
function SPo(v){return Object.keys(SP).map(function(k){return'<option value="'+k+'"'+(k===v?' selected':'')+'>'+SP[k]+'</option>'}).join('')}
function cn(id){var c=D.cl.filter(function(x){return x.id===id})[0];return c?c.n:'بدون فصل'}
var _f2=flat;flat=function(){var m=_f2();for(var k in D.pay)m['pay/'+k]=D.pay[k];return m};
rC=function(){$('cfm').hidden=false;$('cu').hidden=!adm();var n=D.st.filter(function(s){return!s.c}).length;
 $('cll').innerHTML=(adm()&&n?'<div class="card sub">يوجد '+n+' طالب بدون فصل. حدّد فصل كل طالب من تبويب «الطلاب».</div>':'')+(mycl().map(function(c){var k=D.st.filter(function(s){return s.c===c.id}).length;return'<div class="card"><div class="row"><b>'+esc(c.n)+'</b><span class="sub">'+k+' طالب</span></div><div class="sub">المعلم: '+esc(c.t||'—')+' · الفترة: '+esc(c.p||'—')+' · المشرف: '+esc(SP[c.s]||c.s)+'</div><div class="row" style="margin-top:8px;justify-content:flex-start"><button class="g" data-a="ce" data-i="'+c.id+'">✏️ تعديل</button><button class="r" data-a="cx" data-i="'+c.id+'">حذف</button>'+(adm()?'<select data-a="cm" data-i="'+c.id+'" style="width:auto;margin:0">'+SPo(c.s)+'</select>':'')+'</div></div>'}).join('')||'<div class="empty">لا توجد فصول، أضف أول فصل</div>')};
var _s2=rS;rS=function(){_s2();$('stl').querySelectorAll('[data-a=del]').forEach(function(b){b.insertAdjacentHTML('beforebegin','<button class="g" data-a="se" data-i="'+b.dataset.i+'">✏️ تعديل</button>')})};
function rF(){var m=$('fm').value,L2=sorted(),ex=0,gt=0,pd=0;
 var h=L2.map(function(s){var f=+s.f||0,p=D.pay[m+'_'+s.id],a=p?+p.a:0,st=a>0&&a>=f?1:a>0?2:0;ex+=f;gt+=a;if(st===1)pd++;
  return'<div class="card"><div class="row"><div><b>'+esc(s.name)+'</b><div class="sub">'+esc(cn(s.c))+'</div></div><span class="sub" style="color:'+(st===1?'var(--pri)':st===2?'var(--warn)':'var(--bad)')+'">'+(st===1?'✅ مدفوع':st===2?'⏳ دفع '+a:'❌ لم يدفع')+'</span></div>'+
  '<div class="row" style="margin-top:6px"><span class="sub">المبلغ الشهري</span><input type="number" inputmode="numeric" data-a="fe" data-i="'+s.id+'" value="'+(s.f||'')+'" style="width:110px;margin:0"></div>'+
  '<div class="row" style="margin-top:8px;justify-content:flex-start"><button data-a="pf" data-i="'+s.id+'">تم الدفع</button><button class="g" data-a="pp" data-i="'+s.id+'">دفع جزئي</button>'+(a?'<button class="r" data-a="px" data-i="'+s.id+'">إلغاء</button>':'')+(s.ph&&st!==1?'<a class="btn g" target="_blank" rel="noopener" href="'+wa(s.ph,'السلام عليكم، ولي أمر الطالب '+s.name+'، نذكّركم بسداد مصاريف شهر '+m+(f?' (المتبقي '+(f-a)+' جنيه)':'')+'. جزاكم الله خيراً.')+'">📲 تذكير</a>':'')+'</div></div>'}).join('');
 function k(n,l,c){return'<div class="stat '+(c||'')+'"><b>'+n+'</b><span>'+l+'</span></div>'}
 $('fsum').innerHTML='<div class="card"><div class="grid">'+k(ex,'المطلوب')+k(gt,'المحصّل')+k(Math.max(0,ex-gt),'المتبقي','bad')+k(pd+'/'+L2.length,'سدّدوا')+'</div></div>';
 $('fel').innerHTML=h||'<div class="empty">لا يوجد طلاب</div>'}
var _R2=R;R=function(){_R2();rF()};
show=function(){var n=location.hash.slice(1),T=['home','att','rec','stu','exm','cls','fee'],t=T.indexOf(n)>-1?n:'home';T.forEach(function(x){$('v-'+x).hidden=x!==t;$('n-'+x).className=x===t?'on':''});$('cf').hidden=t==='cls'||t==='exm'};
document.head.insertAdjacentHTML('beforeend','<style>nav a{font-size:10px}nav a span{font-size:17px}</style>');
document.querySelector('main').insertAdjacentHTML('beforeend','<section id="v-fee" hidden><div class="card"><h2>المصاريف الشهرية</h2><input type="month" id="fm"><div class="row"><input id="fa" type="number" inputmode="numeric" placeholder="المبلغ الشهري" style="flex:1;margin:0"><button class="g" id="fall">تطبيق على الكل</button></div></div><div id="fsum"></div><div id="fel"></div></section>');
document.querySelector('nav').insertAdjacentHTML('beforeend','<a href="#fee" id="n-fee"><span>💰</span>المصاريف</a>');
$('fm').value=ymd(new Date()).slice(0,7);$('fm').onchange=rF;
$('fall').onclick=function(){var v=parseFloat($('fa').value);if(!(v>0)){toast('اكتب المبلغ');return}var l=sorted();if(!confirm('تطبيق '+v+' جنيه على '+l.length+' طالب؟'))return;l.forEach(function(s){s.f=v});save();R();toast('تم')};
$('addC').onclick=function(){var n=$('cn').value.trim();if(!n){toast('اكتب اسم الفصل');return}D.cl.push({id:'c'+Date.now(),n:n,t:$('ct').value.trim(),p:$('cp').value.trim(),s:adm()?$('cu').value:me()});$('cn').value=$('ct').value=$('cp').value='';save();R();toast('تمت إضافة الفصل')};
document.addEventListener('click',function(e){var b=e.target.closest('[data-a=pf],[data-a=pp],[data-a=px],[data-a=ce],[data-a=se]');if(!b)return;var a=b.dataset.a,id=b.dataset.i,s=G(id),m=$('fm').value,k=m+'_'+id;
 if(a==='ce'){var c=D.cl.filter(function(x){return x.id===id})[0];if(!c)return;var n=prompt('اسم الفصل',c.n);if(n===null)return;var t=prompt('اسم المعلم',c.t||'');if(t===null)return;var p=prompt('الفترة',c.p||'');if(p===null)return;c.n=n.trim()||c.n;c.t=t.trim();c.p=p.trim()}
 else if(a==='se'){var n2=prompt('اسم الطالب',s.name);if(n2===null)return;var pn=prompt('اسم ولي الأمر',s.pn||'');if(pn===null)return;var ph=prompt('رقم ولي الأمر',s.ph||'');if(ph===null)return;s.name=n2.trim()||s.name;s.pn=pn.trim();s.ph=ph.trim()}
 else if(a==='pf'){if(!(+s.f>0)){toast('حدّد المبلغ الشهري أولاً');return}D.pay[k]={a:+s.f,d:ymd(new Date())}}
 else if(a==='pp'){var v=prompt('المبلغ المدفوع من '+s.name,'');if(v===null)return;v=parseFloat(v.replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632}));if(!(v>0)){toast('اكتب رقماً صحيحاً');return}D.pay[k]={a:v,d:ymd(new Date())}}
 else delete D.pay[k];
 save();R()});
document.addEventListener('change',function(e){var t=e.target,a=t.dataset.a,id=t.dataset.i;
 if(a==='fe'){var s=G(id);if(s){s.f=parseFloat(t.value)||0;save();R()}}
 else if(a==='cm'){var c=D.cl.filter(function(x){return x.id===id})[0];if(c){c.s=t.value;save();R()}}});
window.addEventListener('hashchange',show);
firebase.auth().onAuthStateChanged(function(u){if(u&&!pay0){pay0=1;sub('pay',function(o){D.pay={};o.forEach(function(x){D.pay[x.id]=x.v})})}});
show();R();
