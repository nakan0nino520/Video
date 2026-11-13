// mono-plus2.js — nạp SAU mono-plus.js: <script src="mono-plus2.js"></script> trước </body>
(()=>{
const X={get(){try{return JSON.parse(localStorage.getItem('x2')||'{}')}catch(e){return{}}},set(o){localStorage.setItem('x2',JSON.stringify({...this.get(),...o}));paint()}};
function paint(){const x=X.get(),c=document.body.classList;c.toggle('bn',!!x.bn);c.toggle('lv',!!x.lv);c.toggle('bl',x.bl!=null);if(x.bl!=null)document.body.style.setProperty('--bl',x.bl+'px')}
document.head.insertAdjacentHTML('beforeend','<style>body.lv .grid{grid-template-columns:1fr!important}body.lv .grid .card{display:grid;grid-template-columns:72px 1fr;gap:0 12px;align-items:center}body.lv .grid .card .im{grid-row:span 2}body.lv .grid .card h3{margin-top:0}@media(max-width:640px){body.bn nav.tabs{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom));margin:0;z-index:30;box-shadow:var(--sh2);width:calc(100% - 24px)}body.bn main{padding-bottom:calc(90px + env(safe-area-inset-bottom))}body.bn #toast{bottom:calc(84px + env(safe-area-inset-bottom))}}body.bl.glass .gl,body.bl.glass dialog{backdrop-filter:blur(var(--bl)) saturate(190%)!important;-webkit-backdrop-filter:blur(var(--bl)) saturate(190%)!important}@media(prefers-contrast:more){:root{--mut:#333;--line:#777}:root[data-theme=dark]{--mut:#ddd;--line:#999}}</style>');
paint();

/* khám phá an toàn: ghép thêm thẻ nặng vào danh sách ẩn, không ghi đè danh sách của bạn */
const SAFE=['Rape','Torture','Gore','Guro','Netorare','Incest','Blackmail','Ryona'],RAW=PF.get;
PF.get=function(){const o=RAW.call(this);return X.get().safe?{...o,blocked:[o.blocked,...SAFE].filter(Boolean).join(',')}:o};
PF.set=function(o){const n={...RAW.call(this),...o};ls.set('prefs',JSON.stringify(n));this.c=n};

/* bộ lọc đã lưu + 5 bộ lọc gần nhất */
const FI=['#yg','#yl','#sg','#el','#sd','#tn'],els=()=>[...FI.map(i=>$(i)),...$$('[data-nf]')],js=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const snap=()=>({v:els().map(x=>x.value),g:[...S.tags],q:$('#q').value.trim(),t:S.tab});
const FP=()=>js('fp')||{},FH=()=>js('fh')||[];
function loadState(s){setTab(s.t,1);els().forEach((x,i)=>x.value=s.v[i]??'');S.tags=new Set(s.g);$('#q').value=s.q;S.list=true;if(s.t==='content')drawChips();run(true)}
$('#adv').insertAdjacentHTML('beforeend','<div class="fr"><select id="fps" aria-label="Bộ lọc đã lưu"></select><button type="button" class="btn" id="fpa">Lưu bộ lọc</button><button type="button" class="btn" id="fpd">Xóa</button></div>');
function drawFP(){const h=FH();$('#fps').innerHTML='<option value="">Bộ lọc đã lưu…</option>'+Object.keys(FP()).map(n=>`<option value="p:${esc(n)}">${esc(n)}</option>`).join('')+(h.length?'<optgroup label="Gần đây">'+h.map((s,i)=>`<option value="h:${i}">${esc(s.q||s.g.join(', ')||'Bộ lọc '+(i+1))}</option>`).join('')+'</optgroup>':'')}
$('#fps').onchange=e=>{const v=e.target.value;if(!v)return;const s=v[0]==='p'?FP()[v.slice(2)]:FH()[+v.slice(2)];if(s)loadState(s)};
$('#fpa').onclick=()=>{const n=(prompt('Tên bộ lọc:')||'').trim().slice(0,30);if(!n)return;const p=FP();p[n]=snap();localStorage.setItem('fp',JSON.stringify(p));drawFP()};
$('#fpd').onclick=()=>{const v=$('#fps').value;if(v[0]!=='p')return toast('Chọn một bộ lọc đã lưu để xóa');const p=FP();delete p[v.slice(2)];localStorage.setItem('fp',JSON.stringify(p));drawFP()};
$('#f').addEventListener('submit',()=>{if(!['text','content'].includes(S.tab)||PF.get().priv)return;const s=snap();if(!s.q&&!s.g.length&&!s.v.some(Boolean))return;localStorage.setItem('fh',JSON.stringify([s,...FH().filter(x=>JSON.stringify(x)!==JSON.stringify(s))].slice(0,5)));drawFP()});
drawFP();

/* trang chủ: hàng "Vì bạn đã xem X" từ phim đánh dấu xem xong gần nhất */
const HM=home;
home=async()=>{await HM();try{
  const d=Object.values(SV.get()).filter(e=>e.l.includes('done')).sort((a,b)=>b.t-a.t)[0],R=$('#res');
  if(!d||S.tab!=='text'||S.list||R.className!=='home'||$('#vbx'))return;
  const r=await gql(REC,{id:d.m.id}),l=r.Media.recommendations.nodes.map(n=>n.mediaRecommendation).filter(m=>m&&m.isAdult&&safe(m)&&!DN.has(m.id));
  if(l.length&&R.className==='home'&&!$('#vbx'))R.querySelector('.ht')?.insertAdjacentHTML('afterend',row('Vì bạn đã xem '+(d.m.title.english||d.m.title.romaji),l).replace('<section class="hs">','<section class="hs" id="vbx">'));
}catch(e){}};

/* băm mật khẩu trong Web Worker để không đơ giao diện */
const H0=hashPw;
hashPw=(pw,salt)=>!(window.crypto&&crypto.subtle&&window.Worker)?H0(pw,salt):new Promise((res,rej)=>{
  let w;try{w=new Worker(URL.createObjectURL(new Blob(["onmessage=async e=>{const[p,s]=e.data,k=await crypto.subtle.importKey('raw',new TextEncoder().encode(p),'PBKDF2',false,['deriveBits']);postMessage(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:s,iterations:150000,hash:'SHA-256'},k,256)))}"],{type:'text/javascript'})))}catch(e){return H0(pw,salt).then(res,rej)}
  w.onmessage=e=>{res(b64(e.data));w.terminate()};w.onerror=()=>{w.terminate();H0(pw,salt).then(res,rej)};w.postMessage([pw,salt]);
});

/* chi tiết: đọc to mô tả, phóng to ảnh bìa */
const O1=openM;
openM=id=>{O1(id);const a=$('#dc .ac');if(a)a.insertAdjacentHTML('beforeend',`<button type="button" class="btn" data-sp>${ic('translate')}Đọc to</button>`)};
dlg.addEventListener('close',()=>speechSynthesis.cancel());
dlg.addEventListener('click',e=>{
  if(e.target.closest('[data-sp]')){const s=speechSynthesis,t=$('#ds')?.textContent||'';if(s.speaking)return s.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=/[ạảãàáâấầẩẫậăắằẳẵặẹẻẽèéêếềểễệ]/i.test(t)?'vi-VN':'en-US';return s.speak(u)}
  if(e.target.closest('#lbx'))return $('#lbx').remove();
  const c=e.target.closest('img.cv');if(c)dlg.insertAdjacentHTML('beforeend',`<div id="lbx" style="position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.9);display:grid;place-items:center"><img src="${esc(c.src)}" alt="" style="max-width:100%;max-height:100%"></div>`);
});

/* chia sẻ danh sách qua liên kết (#share=id36.id36…) */
$('#sv .row').insertAdjacentHTML('beforeend','<button class="btn" id="svl" type="button"><svg class="i"><use href="#i-share"/></svg>Chia sẻ danh sách</button>');
$('#svl').onclick=()=>{const ids=$$('#res .card[data-id]').slice(0,80).map(c=>(+c.dataset.id).toString(36));if(!ids.length)return toast('Danh sách đang trống');
  const u=location.href.split('#')[0]+'#share='+ids.join('.');navigator.clipboard.writeText(u).then(()=>toast('Đã sao chép liên kết danh sách'),()=>toast(u))};
{const u=new URL((performance.getEntriesByType('navigation')[0]||{}).name||location.href,location.href),sh=new URLSearchParams(u.hash.slice(1)).get('share');
 if(sh)(function t(){
  if(!$('#gate').hidden||!$('#auth').hidden||S.busy)return setTimeout(t,500);
  const ids=sh.split('.').slice(0,80).map(x=>parseInt(x,36)).filter(Boolean);
  gql(`query($ids:[Int]){Page(perPage:80){media(id_in:$ids,type:ANIME){isAdult ${FLD}}}}`,{ids}).then(d=>{
    const l=d.Page.media.filter(m=>m.isAdult&&safe(m)),R=$('#res');R.className='grid';$('#tools').hidden=false;R.innerHTML=l.map(card).join('');
    $('#cnt').textContent=l.length+' phim được chia sẻ';$('#st').innerHTML='<button class="btn pr" id="sha" type="button">Lưu tất cả vào Xem sau</button>';
    $('#sha').onclick=()=>{l.forEach(m=>{if(!(SV.get()[m.id]?.l||[]).includes('later'))toggleSave(m,'later')});toast('Đã lưu '+l.length+' phim')};
  }).catch(e=>lg(e.message));
 })()}

/* hồ sơ: công tắc, thống kê studio/thập niên, nhập từ liên kết */
const P1=openPf;
openPf=()=>{P1();const p=$('#pfc .pf');if(!p)return;const x=X.get(),st={},dc={};
  if($('#pb'))$('#pb').value=RAW.call(PF).blocked;
  Object.values(SV.get()).forEach(e=>{const s=e.m.studios.nodes[0]?.name;if(s)st[s]=(st[s]||0)+1;if(e.m.seasonYear){const k=Math.floor(e.m.seasonYear/10)*10+'s';dc[k]=(dc[k]||0)+1}});
  const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>k+' ('+v+')').join(', ')||'–';
  p.insertAdjacentHTML('beforeend',`<div class="sec"><b>Giao diện & an toàn</b>
<label class="sw"><span>Khám phá an toàn (ẩn thẻ nặng)</span><input type="checkbox" data-xk="safe" ${x.safe?'checked':''}></label>
<label class="sw"><span>Thanh tab dưới đáy (mobile)</span><input type="checkbox" data-xk="bn" ${x.bn?'checked':''}></label>
<label class="sw"><span>Bố cục danh sách</span><input type="checkbox" data-xk="lv" ${x.lv?'checked':''}></label>
<label class="sw"><span>Độ mờ kính</span><input type="range" min="0" max="40" value="${x.bl??22}" data-xk="bl"></label>
<div class="ix"><div><span>Studio hay lưu</span><b>${esc(top(st))}</b></div><div><span>Thập niên</span><b>${esc(top(dc))}</b></div></div>
<div class="row"><button class="btn" data-y="url" type="button">Nhập từ liên kết</button></div></div>`)};
pfd.addEventListener('change',e=>{const k=e.target.dataset.xk;if(!k||k==='bl')return;X.set({[k]:e.target.checked});if(k==='safe'){CACHE.clear();toast('Áp dụng từ lần tìm kế tiếp')}});
pfd.addEventListener('input',e=>{if(e.target.dataset.xk==='bl')X.set({bl:+e.target.value})});
pfd.addEventListener('click',async e=>{
  if(e.target.dataset.y!=='url')return;const u=prompt('Dán liên kết JSON (https):');if(!/^https:\/\//i.test(u||''))return;
  try{const t=await(await fetch(u)).text();if(t.length>2e6)throw 0;const dt=new DataTransfer();dt.items.add(new File([t],'x.json'));$('#imf').files=dt.files;$('#imf').dispatchEvent(new Event('change'));toast('Đã nhập')}
  catch(x){toast('Không tải được liên kết (có thể bị chặn CORS)')}
});
})();
