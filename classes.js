var SP={ibrahim:'الشيخ إبراهيم',mona:'ميس مني',hagar:'ميس هاجر',safaa:'ميس صفاء'},CUR='',cl0=0;
D.cl=D.cl||[];
function me(){var u=firebase.auth().currentUser;return u&&u.email?u.email.split('@')[0]:''}
function adm(){return me()==='sheikh'}
function mycl(){return D.cl.filter(function(c){return adm()||c.s===me()})}
function copt(v){return mycl().map(function(c){return'<option value="'+c.id+'"'+(c.id===v?' selected':'')+'>'+esc(c.n)+'</option>'}).join('')}
function vis(){var m=mycl().map(function(c){return c.id});return D.st.filter(function(s){return(adm()||m.indexOf(s.c)>-1)&&(!CUR||s.c===CUR)})}
sorted=function(){return vis().sort(function(a,b){return a.name.localeCompare(b.name,'ar')})};
var _fl=flat;flat=function(){var m=_fl();D.cl.forEach(function(c){m['cl/'+c.id]=c});return m};
function cs(){var t=ymd(new Date()),L2=mycl();if(!L2.length)return'';return'<div class="card"><h2>الفصول</h2>'+L2.map(function(c){var ss=D.st.filter(function(s){return s.c===c.id}),p=0,a=0;ss.forEach(function(s){var v=D.att[t+'_'+s.id];if(v==='p')p++;if(v==='a')a++});return'<div class="row" style="padding:5px 0;border-top:1px solid var(--line)"><div><b>'+esc(c.n)+'</b><div class="sub">'+esc(c.t||'')+(c.p?' · '+esc(c.p):'')+'</div></div><span class="sub">'+ss.length+' طالب · حاضر '+p+' · غائب '+a+'</span></div>'}).join('')+'</div>'}
var _h=rH;rH=function(){var all=D.st,v=vis();D.st=v;try{_h()}finally{D.st=all}$('hm').insertAdjacentHTML('afterbegin',cs())};
var _s=rS;rS=function(){_s();var l=$('stl');l.querySelectorAll('[data-a=del]').forEach(function(b){var s=G(b.dataset.i),c=b.closest('.card');if(s&&c)c.firstChild.insertAdjacentHTML('afterend','<select data-a="sc" data-i="'+s.id+'"><option value="">بدون فصل</option>'+copt(s.c)+'</select>')})};
function bf(){var e=$('cs');e.innerHTML=(adm()?'<option value="">كل الفصول</option>':(mycl().length>1?'<option value="">كل فصولي</option>':''))+copt('');if(!Array.prototype.some.call(e.options,function(x){return x.value===CUR}))CUR=e.options.length?e.options[0].value:'';e.value=CUR;
 var c=$('sc'),pv=c.value||CUR;c.innerHTML=(adm()?'<option value="">بدون فصل</option>':'')+copt('');c.value=pv}
function rC(){$('cfm').hidden=!adm();var n=D.st.filter(function(s){return!s.c}).length;
 $('cll').innerHTML=(adm()&&n?'<div class="card sub">يوجد '+n+' طالب بدون فصل. حدّد فصل كل طالب من تبويب «الطلاب».</div>':'')+(mycl().map(function(c){var k=D.st.filter(function(s){return s.c===c.id}).length;return'<div class="card"><div class="row"><b>'+esc(c.n)+'</b><span class="sub">'+k+' طالب</span></div><div class="sub">المعلم: '+esc(c.t||'—')+' · الفترة: '+esc(c.p||'—')+' · المشرف: '+esc(SP[c.s]||c.s)+'</div>'+(adm()?'<button class="r" style="margin-top:8px" data-a="cx" data-i="'+c.id+'">حذف الفصل</button>':'')+'</div>'}).join('')||'<div class="empty">'+(adm()?'لا توجد فصول، أضف أول فصل':'لا توجد فصول مسندة إليك، تواصل مع الشيخ فرج')+'</div>')}
var _R=R;R=function(){bf();_R();rC()};
show=function(){var n=location.hash.slice(1),T=['home','att','rec','stu','exm','cls'],t=T.indexOf(n)>-1?n:'home';T.forEach(function(x){$('v-'+x).hidden=x!==t;$('n-'+x).className=x===t?'on':''});$('cf').hidden=t==='cls'||t==='exm'};
document.head.insertAdjacentHTML('beforeend','<style>nav a{font-size:11px}nav a span{font-size:18px}</style>');
document.querySelector('main').insertAdjacentHTML('beforebegin','<div id="cf" class="card" style="margin:12px 12px 0"><select id="cs" style="margin:0"></select></div>');
document.querySelector('main').insertAdjacentHTML('beforeend','<section id="v-cls" hidden><div class="card" id="cfm"><h2>إضافة فصل</h2><input id="cn" placeholder="اسم الفصل (مثال: فصل ميس مني)"><input id="ct" placeholder="اسم المعلم"><input id="cp" placeholder="الفترة (مثال: صباحي)"><select id="cu">'+Object.keys(SP).map(function(k){return'<option value="'+k+'">المشرف: '+SP[k]+'</option>'}).join('')+'</select><button id="addC">إضافة الفصل</button></div><div id="cll"></div></section>');
document.querySelector('nav').insertAdjacentHTML('beforeend','<a href="#cls" id="n-cls"><span>🏫</span>الفصول</a>');
$('sl').insertAdjacentHTML('beforebegin','<select id="sc"></select>');
$('cs').onchange=function(){CUR=this.value;R()};
$('addC').onclick=function(){var n=$('cn').value.trim();if(!n){toast('اكتب اسم الفصل');return}D.cl.push({id:'c'+Date.now(),n:n,t:$('ct').value.trim(),p:$('cp').value.trim(),s:$('cu').value});$('cn').value=$('ct').value=$('cp').value='';save();R();toast('تمت إضافة الفصل')};
var _ad=add;add=function(n,one){var k=D.st.length;_ad(n,one);for(var i=k;i<D.st.length;i++)D.st[i].c=$('sc').value;save();R()};
['addS','addB'].forEach(function(i){var o=$(i).onclick;$(i).onclick=function(){if(!$('sc').value&&!adm()){toast('اختر الفصل أولاً');return}o()}});
$('allP').onclick=function(){var d=$('day').value;sorted().forEach(function(s){if(!D.att[d+'_'+s.id])D.att[d+'_'+s.id]='p'});save();R()};
document.addEventListener('click',function(e){var b=e.target.closest('[data-a=cx]');if(!b||!confirm('حذف الفصل؟ سيبقى طلابه بدون فصل.'))return;var id=b.dataset.i;D.st.forEach(function(s){if(s.c===id)s.c=''});D.cl=D.cl.filter(function(c){return c.id!==id});save();R()});
document.addEventListener('change',function(e){var t=e.target;if(t.dataset.a!=='sc')return;var s=G(t.dataset.i);if(s){s.c=t.value;save();R()}});
window.addEventListener('hashchange',show);
firebase.auth().onAuthStateChanged(function(u){if(u&&!cl0){cl0=1;sub('cl',function(o){D.cl=o.map(function(x){return x.v})})}R()});
show();R();
