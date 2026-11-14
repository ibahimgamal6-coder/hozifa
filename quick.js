function pd(t){return t.replace(/[٠-٩]/g,function(x){return x.charCodeAt(0)-1632}).replace(/\D/g,'')}
function pr(line){var m=line.match(/[\d٠-٩][\d٠-٩\s-]{7,}[\d٠-٩]/),ph='';if(m){ph=pd(m[0]);line=line.replace(m[0],' - ')}var p=line.split(/\s*[-–—,،|;\t]\s*/).map(function(x){return x.trim()}).filter(Boolean);return{n:p[0]||'',pn:p[1]||'',ph:ph}}
['sn','pn','pp','addS'].forEach(function(i){$(i).style.display='none'});
$('sd').insertAdjacentHTML('afterend','<input id="qa" enterkeyhint="send" placeholder="الاسم - ولي الأمر - الرقم ثم Enter"><button id="qb">➕ إضافة</button><div id="qr" class="sub" style="margin-top:6px"></div>');
var qn=0,ql=[];
function qadd(){var r=pr($('qa').value.trim());if(!r.n)return;if(!$('sc').value&&!adm()){toast('اختر الفصل أولاً');return}
 D.st.push({id:'s'+Date.now()+Math.random().toString(36).slice(2,6),name:r.n,l:$('sl').value,s:+$('ss').value,d:+$('sd').value,pn:r.pn,ph:r.ph,h:[],c:$('sc').value});
 ql.unshift(r.n);ql=ql.slice(0,5);qn++;save();R();$('qa').value='';$('qa').focus();$('qr').textContent='تمت إضافة '+qn+' · آخرهم: '+ql.join('، ')}
$('qa').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();qadd()}});
$('qb').onclick=qadd;
