function nz(t){return t.replace(/[٠-٩]/g,function(x){return x.charCodeAt(0)-1632}).replace(/[۰-۹]/g,function(x){return x.charCodeAt(0)-1776})}
function kn(s){return s.replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim()}
function pl3(line){line=nz(line).replace(/^\s*\d{1,3}\s*[-.)،]\s*(?=[^\d\s])/,'');var m=line.match(/\+?\d[\d\s-]{6,}\d/),p='';
 if(m){p=m[0].replace(/\D/g,'');if(p.indexOf('0020')===0)p='0'+p.slice(4);else if(p.length===12&&p.indexOf('20')===0)p='0'+p.slice(2);else if(p.length===10&&p[0]==='1')p='0'+p;line=line.replace(m[0],' - ')}
 var a=line.split(/\s*[,،|;\t]\s*|\s+[-–—]\s+/).map(function(x){return x.trim()}).filter(Boolean);
 var pn=a[1]||'',bd=!!p&&!/^01[0125]\d{8}$/.test(p);
 if(!p&&/^[\d\s+-]+$/.test(pn)){p=pn.replace(/\D/g,'');pn='';bd=true}
 return{n:a[0]||'',pn:pn,p:p,bad:bd}}
pr=function(l){var r=pl3(l);if(r.bad)toast('رقم غير صحيح، هيتضاف الطالب من غير رقم');return{n:r.n,pn:r.pn,ph:r.bad?'':r.p}};
function bp(){var ex={},sn2={};D.st.forEach(function(s){ex[kn(s.name)]=1});
 return $('bulk').value.split('\n').map(function(x){return x.trim()}).filter(Boolean).map(pl3).filter(function(r){return r.n}).map(function(r){var k=kn(r.n);r.dup=!!ex[k]||!!sn2[k+'|'+r.p];sn2[k+'|'+r.p]=1;return r})}
function bv(){var rs=bp(),ok=0,np=0,bd=0,dp=0;
 rs.forEach(function(r){if(r.dup)dp++;else{ok++;if(!r.p)np++;else if(r.bad)bd++}});
 $('bpv').innerHTML=rs.length?'<div class="card" style="margin:8px 0"><b>'+ok+' طالب جاهز للإضافة</b><div class="sub">'+(ok-np-bd)+' برقم صحيح'+(np?' · '+np+' بدون رقم':'')+(bd?' · <span style="color:var(--bad)">'+bd+' رقم غير صحيح</span>':'')+(dp?' · '+dp+' مكرر/موجود (هيتخطى)':'')+'</div>'+
  rs.slice(0,40).map(function(r,i){return'<div class="row" style="padding:5px 0;border-top:1px solid var(--line)'+(r.dup?';opacity:.5':'')+'"><span>'+(i+1)+'. <b>'+esc(r.n)+'</b>'+(r.pn?'<span class="sub"> · '+esc(r.pn)+'</span>':'')+'</span><span class="sub"'+(r.bad?' style="color:var(--bad)"':'')+'>'+(r.dup?'🔁 موجود':r.p?(r.bad?'⚠️ ':'📞 ')+esc(r.p):'—')+'</span></div>'}).join('')+(rs.length>40?'<div class="sub">... و '+(rs.length-40)+' كمان</div>':'')+'</div>':''}
$('bulk').rows=6;$('bulk').oninput=bv;
$('bulk').insertAdjacentHTML('afterend','<div id="bpv"></div>');
$('bulk').previousElementSibling.insertAdjacentHTML('afterend','<button class="g" id="bpaste" style="margin:6px 0">📋 لصق من الحافظة</button>');
$('bpaste').onclick=function(){try{navigator.clipboard.readText().then(function(t){$('bulk').value=($('bulk').value?$('bulk').value+'\n':'')+t;bv()},function(){toast('اضغط في الخانة والصق يدوياً')})}catch(e){toast('اضغط في الخانة والصق يدوياً')}};
$('addB').onclick=function(){if(!$('sc').value&&!adm()){toast('اختر الفصل أولاً');return}
 var rs=bp().filter(function(r){return!r.dup});if(!rs.length){toast('لا توجد أسماء جديدة للإضافة');return}
 var bd=rs.filter(function(r){return r.bad}).length;
 if(!confirm('إضافة '+rs.length+' طالب'+(bd?'\n('+bd+' رقم غير صحيح هيتضاف من غير رقم)':'')+'؟'))return;
 rs.forEach(function(r){D.st.push({id:'s'+Date.now()+Math.random().toString(36).slice(2,6),name:r.n,l:$('sl').value,s:+$('ss').value,d:+$('sd').value,pn:r.pn,ph:r.bad?'':r.p,h:[],c:$('sc').value})});
 save();R();$('bulk').value='';bv();toast('تمت إضافة '+rs.length+' طالب')};
var _R4=R;R=function(){_R4();bv()};
