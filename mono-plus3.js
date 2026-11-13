// mono-plus3.js — nạp SAU mono-plus.js và mono-plus2.js
(()=>{
['dlog','cl','emo'].forEach(k=>UKEYS.add(k));
const jr=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const jl=(k,d)=>{try{return JSON.parse(ls.get(k)||'null')??d}catch(e){return d}};
const X3=()=>jr('x3',{}),X3s=o=>localStorage.setItem('x3',JSON.stringify({...X3(),...o}));
const CW=['Rape','Torture','Gore','Guro','Netorare','Incest','Blackmail','Ryona'];
document.head.insertAdjacentHTML('beforeend','<style>#cld[hidden]{display:none}.rt.em button{font-size:22px;opacity:.4}.rt.em .on{opacity:1}</style>');

/* Service Worker: offline + cache ảnh bìa */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});

/* danh sách tùy chỉnh (cũng dùng làm nhãn riêng) */
const CL=()=>jl('cl',[]);
function clBtns(){$$('#sv [data-c]').forEach(b=>b.remove());
  $('#svc').insertAdjacentHTML('beforebegin',CL().map(n=>`<button class="btn" data-c data-l="c:${esc(n)}" aria-pressed="false">${esc(n)}</button>`).join('')+'<button class="btn" data-c id="cla" type="button">+ Danh sách</button>')}
$('#svr').insertAdjacentHTML('afterend','<button class="btn" id="cld" type="button" hidden>Xóa danh sách này</button>');
clBtns();
$('#sv').addEventListener('click',e=>{
  if(e.target.closest('#cla')){const n=(prompt('Tên danh sách:')||'').trim().slice(0,20);if(n&&!/["<>&]/.test(n)&&!CL().includes(n)){ls.set('cl',JSON.stringify([...CL(),n]));clBtns()}}
  if(e.target.closest('#cld')&&SL.startsWith('c:')&&confirm('Xóa danh sách "'+SL.slice(2)+'"? Phim vẫn còn trong các danh sách khác.')){
    const n=SL.slice(2),o=SV.get();for(const k in o){o[k].l=o[k].l.filter(x=>x!=='c:'+n);if(!o[k].l.length)delete o[k]}
    SV.put(o);ls.set('cl',JSON.stringify(CL().filter(x=>x!==n)));SL='fav';clBtns();showSaved()}
});
const S1=showSaved;showSaved=()=>{S1();$('#cld').hidden=!SL.startsWith('c:')};

/* nhật ký "xem xong" cho mục tiêu tháng */
const T0=toggleSave;
toggleSave=(m,l)=>{const had=(SV.get()[m.id]?.l||[]).includes(l);T0(m,l);
  if(l==='done'){const o=jl('dlog',{});if(had)delete o[m.id];else o[m.id]=Date.now();ls.set('dlog',JSON.stringify(o))}};
const doneMonth=()=>{const n=new Date();return Object.values(jl('dlog',{})).filter(t=>{const d=new Date(t);return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()}).length};

/* ẩn studio tránh xa (không áp dụng trong tab Đã lưu) */
const SB=m=>{const a=(X3().avoid||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean),s=(m.studios?.nodes?.[0]?.name||'').toLowerCase();return a.length&&a.includes(s)};
const C1=card;card=m=>S.tab!=='saved'&&SB(m)?'':C1(m);

/* chi tiết: cảnh báo nội dung, danh sách riêng, biểu cảm */
const O2=openM;
openM=id=>{
  const m=M[id],h=m&&X3().cw?[...m.genres,...m.tags.map(t=>t.name)].filter(n=>CW.includes(n)):[];
  if(h.length&&!confirm('Cảnh báo nội dung: '+h.join(', ')+'. Vẫn mở?'))return;
  O2(id);if(!m)return;
  const l=SV.get()[id]?.l||[],a=$('#dc .ac'),pv=$('#dc .pv'),em=jl('emo',{})[id];
  if(a)a.insertAdjacentHTML('beforeend',CL().map(n=>`<button class="btn" data-a="c:${esc(n)}" aria-pressed="${l.includes('c:'+n)}">${ic('mark')}${esc(n)}</button>`).join(''));
  if(pv)pv.insertAdjacentHTML('afterbegin',`<div class="rt em">${['😍','👍','😐','👎'].map(x=>`<button type="button" data-em="${x}" aria-label="Biểu cảm ${x}" class="${em===x?'on':''}">${x}</button>`).join('')}</div>`);
};
dlg.addEventListener('click',e=>{const b=e.target.closest('[data-em]');if(!b)return;
  const o=jl('emo',{}),id=dlg.dataset.id,v=b.dataset.em;if(o[id]===v)delete o[id];else o[id]=v;ls.set('emo',JSON.stringify(o));
  $$('[data-em]').forEach(x=>x.classList.toggle('on',o[id]===x.dataset.em))});

/* khóa PIN (rào chắn giao diện trên thiết bị, không mã hóa dữ liệu) */
document.body.insertAdjacentHTML('beforeend','<div id="pinov" style="display:none;position:fixed;inset:0;z-index:400;place-items:center;background:var(--bg);padding:24px"><form id="pinf" style="display:grid;gap:12px;width:min(300px,100%);text-align:center"><h1 style="font-size:24px">Nhập PIN</h1><input id="pini" class="fi" type="password" inputmode="numeric" autocomplete="off" maxlength="8" aria-label="PIN"><div id="pinm" role="alert" style="min-height:20px;font-size:13px"></div><button class="btn pr big" type="submit">Mở khóa</button></form></div>');
function pinLock(){if(!jr('pin',null))return;if(dlg.open)dlg.close();if(pfd.open)pfd.close();$('#pinov').style.display='grid';$('#pini').value='';$('#pini').focus()}
const pinOk=async v=>{const p=jr('pin',null);return !!p&&(await hashPw(v,unb(p.s)))===p.h};
$('#pinf').onsubmit=async e=>{e.preventDefault();const m=$('#pinm'),w=RL.wait('*pin');if(w>0)return m.textContent='Thử lại sau '+Math.ceil(w/1000)+'s';
  if(await pinOk($('#pini').value)){RL.ok('*pin');m.textContent='';$('#pinov').style.display='none'}
  else{const n=RL.fail('*pin',5);m.textContent='PIN sai.'+(n>=5?' Đã bị khóa tạm.':'')}};
let away=0;document.addEventListener('visibilitychange',()=>{if(document.hidden)away=Date.now();else if(away&&Date.now()-away>3e4)pinLock()});
pinLock();

/* thông báo tập sắp chiếu (cần mở tab/ứng dụng) */
const show=(t,b)=>navigator.serviceWorker?.getRegistration().then(r=>r?r.showNotification(t,{body:b}):new Notification(t,{body:b})).catch(()=>{});
async function notify(){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  const ids=Object.values(SV.get()).filter(e=>e.l.includes('fav')||e.l.includes('later')).map(e=>e.m.id).slice(0,50);if(!ids.length)return;
  try{const d=await gql('query($ids:[Int]){Page(perPage:50){media(id_in:$ids){id title{romaji english} nextAiringEpisode{episode airingAt}}}}',{ids}),seen=jr('ntf',{});
    d.Page.media.forEach(m=>{const a=m.nextAiringEpisode,k=m.id+':'+a?.episode;if(!a||seen[k]||a.airingAt*1000-Date.now()>36e5)return;seen[k]=1;show(m.title.english||m.title.romaji,'Tập '+a.episode+' chiếu trong chưa đầy 1 giờ')});
    localStorage.setItem('ntf',JSON.stringify(seen))}catch(e){}
}
setTimeout(notify,6e3);setInterval(notify,18e5);

/* hồ sơ */
const P2=openPf;
openPf=()=>{P2();const p=$('#pfc .pf');if(!p)return;const x=X3();
  p.insertAdjacentHTML('beforeend',`<div class="sec"><b>Mục tiêu & bảo vệ</b>
<div class="ix"><div><span>Xem xong tháng này</span><b>${doneMonth()}/${x.goal||'–'}</b></div></div>
<label class="blk"><span>Mục tiêu phim mỗi tháng</span><input class="fi" type="number" min="0" data-zk="goal" value="${esc(x.goal||'')}"></label>
<label class="blk"><span>Studio tránh xa (cách nhau dấu phẩy)</span><input class="fi" data-zk="avoid" value="${esc(x.avoid||'')}"></label>
<label class="sw"><span>Cảnh báo trước khi mở phim nhạy cảm</span><input type="checkbox" data-zk="cw" ${x.cw?'checked':''}></label>
<div class="row"><button class="btn" data-z="pin" type="button">${ic('lock')}${jr('pin',null)?'Đổi PIN':'Đặt PIN'}</button>${jr('pin',null)?'<button class="btn" data-z="pinoff" type="button">Tắt PIN</button>':''}<button class="btn" data-z="nt" type="button">Bật thông báo tập mới</button></div></div>`)};
pfd.addEventListener('change',e=>{const k=e.target.dataset.zk;if(!k)return;X3s({[k]:e.target.type==='checkbox'?e.target.checked:e.target.value.trim()});if(k==='avoid')toast('Áp dụng từ lần tìm kế tiếp')});
pfd.addEventListener('click',async e=>{
  const z=e.target.closest('[data-z]')?.dataset.z;if(!z)return;
  if(z==='nt'){if(!('Notification' in window))return toast('Trình duyệt không hỗ trợ thông báo');const r=await Notification.requestPermission();toast(r==='granted'?'Đã bật thông báo':'Chưa được cấp quyền');notify()}
  else if(z==='pin'){if(jr('pin',null)&&!(await pinOk(prompt('Nhập PIN hiện tại:')||'')))return toast('PIN hiện tại không đúng');
    const v=prompt('PIN mới (4–8 chữ số):')||'';if(!/^\d{4,8}$/.test(v))return toast('PIN phải gồm 4–8 chữ số');
    const s=crypto.getRandomValues(new Uint8Array(16));localStorage.setItem('pin',JSON.stringify({s:b64(s),h:await hashPw(v,s)}));toast('Đã đặt PIN');openPf()}
  else if(z==='pinoff'){if(await pinOk(prompt('Nhập PIN để tắt:')||'')){localStorage.removeItem('pin');toast('Đã tắt PIN');openPf()}else toast('PIN không đúng')}
});
})();
