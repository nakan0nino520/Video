// mono-plus.js — chèn <script src="mono-plus.js"></script> ngay trước </body> của file Mono
(()=>{
document.head.insertAdjacentHTML('beforeend','<style>.pg{position:absolute;left:0;bottom:0;height:3px;background:var(--fg)}.eps{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0}.eps button{min-width:32px;height:30px;border-radius:9px;border:1px solid var(--line);font-size:12px;background:var(--card)}.eps button.on{background:var(--fg);color:var(--bg)}.tr{display:block;width:100%;aspect-ratio:16/9;border:0;border-radius:16px;margin:10px 0}#chips .chip.ex{background:#c0392b;color:#fff;border-color:#c0392b}#adv .fr select{max-width:150px}</style>');
UKEYS.add('prog');

/* nhật ký lỗi cục bộ (20 mục gần nhất) */
const LOGS=()=>{try{return JSON.parse(localStorage.getItem('errlog')||'[]')}catch(e){return[]}};
const lg=m=>{try{localStorage.setItem('errlog',JSON.stringify([...LOGS(),new Date().toISOString()+' '+String(m).slice(0,160)].slice(-20)))}catch(e){}};
addEventListener('error',e=>lg(e.message));
addEventListener('unhandledrejection',e=>lg(e.reason?.message||e.reason));

/* bộ lọc nâng cao: mùa, năm chiếu, định dạng, trạng thái, nguồn, thời lượng */
const opt=a=>a.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
$('#adv .fr').insertAdjacentHTML('beforeend',
`<select data-nf="sn" aria-label="Mùa"><option value="">Mùa</option>${opt([['WINTER','Đông (1-3)'],['SPRING','Xuân (4-6)'],['SUMMER','Hạ (7-9)'],['FALL','Thu (10-12)']])}</select>
<input data-nf="sy" type="number" placeholder="Năm chiếu">
<select data-nf="fm" aria-label="Định dạng"><option value="">Định dạng</option>${opt([['TV','TV'],['MOVIE','Phim lẻ'],['OVA','OVA'],['ONA','ONA'],['SPECIAL','Đặc biệt']])}</select>
<select data-nf="ss" aria-label="Trạng thái"><option value="">Trạng thái</option>${opt([['RELEASING','Đang chiếu'],['FINISHED','Hoàn thành'],['NOT_YET_RELEASED','Sắp chiếu']])}</select>
<select data-nf="sr" aria-label="Nguồn"><option value="">Nguồn</option>${opt([['MANGA','Manga'],['LIGHT_NOVEL','Light novel'],['VISUAL_NOVEL','Visual novel'],['ORIGINAL','Gốc'],['GAME','Game']])}</select>
<input data-nf="dg" type="number" placeholder="Phút/tập từ"><input data-nf="dl" type="number" placeholder="Phút/tập đến">
<button type="button" class="btn" id="now">Mùa này</button>`);
Object.assign(MAP,{sn:['season','MediaSeason'],sy:['seasonYear','Int'],fm:['format','MediaFormat'],sr:['source','MediaSource'],dg:['duration_greater','Int'],dl:['duration_lesser','Int']});
const V0=vars;
vars=(q,s)=>{const v=V0(q,s),g=k=>$('[data-nf='+k+']').value,n=k=>g(k)===''?null:+g(k);
  v.sn=g('sn')||null;v.sy=n('sy');v.fm=g('fm')||null;v.sr=g('sr')||null;v.dg=n('dg');v.dl=n('dl');if(g('ss'))v.sf=g('ss');return v};
$('#adv').addEventListener('change',e=>{if(e.target.dataset.nf)S.list=true},true); // chạy trước bộ nghe gốc để run() không quay về trang chủ
$('#now').onclick=()=>{const d=new Date();$('[data-nf=sn]').value=['WINTER','SPRING','SUMMER','FALL'][Math.floor(d.getMonth()/3)];$('[data-nf=sy]').value=d.getFullYear();S.list=true;run(true)};
const T0=setTab;setTab=(t,nr)=>{$$('[data-nf]').forEach(x=>x.value='');T0(t,nr)};

/* loại trừ thẻ: chuột phải / chạm giữ chip */
const D0=drawChips;
drawChips=()=>{D0();const a=$('#tn').value.split(',').map(x=>x.trim());$$('#chips .chip').forEach(c=>c.classList.toggle('ex',a.includes(c.dataset.n)))};
$('#chips').addEventListener('contextmenu',e=>{const b=e.target.closest('.chip');if(!b)return;e.preventDefault();
  const n=b.dataset.n,t=$('#tn'),a=t.value.split(',').map(x=>x.trim()).filter(Boolean);
  t.value=(a.includes(n)?a.filter(x=>x!==n):[...a,n]).join(', ');S.tags.delete(n);drawChips();run(true)});

/* tiến độ xem: thanh trên thẻ + tick từng tập */
const PG={get(){try{return JSON.parse(ls.get('prog')||'{}')}catch(e){return{}}},set(id,n){const o=this.get();n?o[id]=n:delete o[id];ls.set('prog',JSON.stringify(o))}};
const C0=card;
card=m=>{const h=C0(m),p=PG.get()[m.id];return p&&m.episodes?h.replace('</div><h3>',`<i class="pg" style="width:${Math.min(100,p/m.episodes*100)}%"></i></div><h3>`):h};
function drawEps(id){
  const m=M[id],n=m.episodes,p=PG.get()[id]||0,el=$('#pgx');if(!el)return;
  el.innerHTML=`<div class="sm2">Đã xem: ${p}${n?'/'+n:''} tập</div>`+(n&&n<=100
    ?`<div class="eps">${Array.from({length:n},(_,i)=>`<button type="button" data-e="${i+1}" aria-label="Tập ${i+1}" aria-pressed="${i<p}" class="${i<p?'on':''}">${i+1}</button>`).join('')}</div>`
    :`<div class="row"><button type="button" class="btn" data-e="-1">− 1 tập</button><button type="button" class="btn" data-e="+1">+ 1 tập</button></div>`);
}
const O0=openM;
openM=id=>{
  O0(id);const m=M[id],pv=$('#dc .pv');if(!m||!pv)return;
  pv.insertAdjacentHTML('afterbegin','<div id="pgx"></div><div id="air" class="sm2"></div>');drawEps(id);
  try{history.replaceState(null,'','#id='+id)}catch(e){}
  gql('query($id:Int){Media(id:$id){nextAiringEpisode{episode airingAt}}}',{id:+id}).then(d=>{
    const a=d.Media.nextAiringEpisode;if(!a||dlg.dataset.id!=id||!$('#air'))return;
    const s=Math.max(0,a.airingAt*1000-Date.now());
    $('#air').textContent=`Tập ${a.episode} chiếu sau ${Math.floor(s/864e5)} ngày ${Math.floor(s%864e5/36e5)} giờ`;
  }).catch(()=>{});
};
const oc=dlg.onclose;dlg.onclose=()=>{oc&&oc();syncHash($('#q').value.trim())};
dlg.addEventListener('click',e=>{
  const b=e.target.closest('[data-e]');
  if(b){const id=dlg.dataset.id,m=M[id],cur=PG.get()[id]||0,v=b.dataset.e;
    let n=v==='+1'?cur+1:v==='-1'?cur-1:(+v===cur?cur-1:+v);
    n=Math.max(0,m.episodes?Math.min(n,m.episodes):n);PG.set(id,n);return drawEps(id)}
  const t=e.target.closest('[data-tr]');
  if(t){const o=$('#trf');if(o)return o.remove();
    $('#dc .ac').insertAdjacentHTML('afterend',`<iframe id="trf" class="tr" title="Trailer" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(t.dataset.tr)}" allow="encrypted-media;picture-in-picture;fullscreen" allowfullscreen loading="lazy"></iframe>`)}
});

/* trailer nhúng thay cho liên kết ngoài */
const DT0=detail;
detail=(d,id)=>{DT0(d,id);const t=d.trailer;if(dlg.dataset.id!=id||!t||t.site!=='youtube')return;
  const a=$('#dc .ac a[href*="youtube.com/watch"]');if(a)a.outerHTML=`<button type="button" class="btn" data-tr="${esc(t.id)}">${ic('eye')}Xem trailer</button>`};

/* liên kết sâu #id=<anilistId> */
{const u=new URL((performance.getEntriesByType('navigation')[0]||{}).name||location.href,location.href),hid=+new URLSearchParams(u.hash.slice(1)).get('id');
  if(hid)(function t(){if($('#gate').hidden&&$('#auth').hidden)gql(`query($id:Int){Media(id:$id){${FLD}}}`,{id:hid}).then(d=>{M[hid]=d.Media;openM(hid)}).catch(e=>lg(e.message));else setTimeout(t,500)})()}

/* preview trace.moe: chỉ phát sau khi rê 800ms */
vids=()=>{$$('video').forEach(v=>{if(matchMedia('(hover:none)').matches)vio.observe(v);else{let t;v.onmouseenter=()=>{t=setTimeout(()=>v.play().catch(()=>{}),800)};v.onmouseleave=()=>{clearTimeout(t);v.pause()}}})};

/* bàn phím + ARIA */
addEventListener('keydown',e=>{
  const c=document.activeElement?.closest?.('.card');if(!c||dlg.open||!/^Arrow(Left|Right|Up|Down)$/.test(e.key))return;
  const l=[...c.parentElement.children].filter(x=>x.classList.contains('card')),cols=getComputedStyle(c.parentElement).gridTemplateColumns.split(' ').length||1,
  j=l.indexOf(c)+{ArrowLeft:-1,ArrowRight:1,ArrowUp:-cols,ArrowDown:cols}[e.key];
  if(l[j]){e.preventDefault();l[j].focus()}
});
$('#st').setAttribute('aria-live','polite');$('#res').setAttribute('role','list');
$('#sort').setAttribute('aria-label','Sắp xếp');$('#more').setAttribute('aria-label','Tải thêm kết quả');

/* thanh đo độ mạnh mật khẩu khi đăng ký */
$('#ap').addEventListener('input',()=>{if(AM!=='up')return;const p=$('#ap').value,
  s=[p.length>=8,p.length>=12,/[A-Z]/.test(p)&&/[a-z]/.test(p),/\d/.test(p),/[^\w\s]/.test(p)].filter(Boolean).length;
  $('#am').textContent=p?'Độ mạnh: '+['Rất yếu','Yếu','Trung bình','Khá','Mạnh','Rất mạnh'][s]:''});

/* sao lưu tự động mỗi 24h (giữ 3 bản gần nhất) */
const bkKey=()=>'bk:'+(S.user||'guest');
function backup(){try{const b=JSON.parse(localStorage.getItem(bkKey())||'[]');if(b[0]&&Date.now()-b[0].t<864e5)return;
  b.unshift({t:Date.now(),d:{saved:SV.get(),notes:NT.get(),prog:PG.get()}});localStorage.setItem(bkKey(),JSON.stringify(b.slice(0,3)))}catch(e){lg(e.message)}}
const A0=afterAuth;afterAuth=()=>{A0();backup()};backup();

/* hồ sơ: cỡ nội dung, xuất CSV/Markdown, khôi phục, bảng debug */
const zoom=()=>{const z=+localStorage.getItem('fsz');if(z)$('main').style.zoom=z/15};zoom();
const rows=()=>Object.values(SV.get()).map(e=>[e.m.title.english||e.m.title.romaji,e.m.seasonYear||'',e.l.join('/'),NT.get()[e.m.id]?.r||'',PG.get()[e.m.id]||0]);
const save=(name,text,type)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click()};
const P0=openPf;
openPf=()=>{P0();const p=$('#pfc .pf');if(!p)return;
  p.insertAdjacentHTML('beforeend',`<div class="sec"><b>Mở rộng</b>
<label class="sw"><span>Cỡ nội dung</span><input type="range" id="fsz" min="12" max="20" value="${localStorage.getItem('fsz')||15}"></label>
<div class="row"><button class="btn" data-x="csv">${ic('dl')}CSV</button><button class="btn" data-x="md">${ic('dl')}Markdown</button><button class="btn" data-x="bk">Khôi phục sao lưu</button><button class="btn" data-x="cc">Xóa cache API</button><button class="btn" data-x="lg">Sao chép nhật ký lỗi</button></div>
<div class="sm2">Mono+ · ${Object.keys(localStorage).length} khóa · ${(JSON.stringify(localStorage).length/1024).toFixed(1)} KB · ${LOGS().length} lỗi gần đây</div></div>`)};
pfd.addEventListener('input',e=>{if(e.target.id==='fsz'){localStorage.setItem('fsz',e.target.value);zoom()}});
pfd.addEventListener('click',e=>{
  const b=e.target.closest('[data-x]');if(!b)return;const x=b.dataset.x;
  if(x==='csv'){const q=v=>{v=String(v);if(/^[=+\-@]/.test(v))v="'"+v;return'"'+v.replace(/"/g,'""')+'"'};
    save('mono-saved.csv','\ufeff'+['Tên,Năm,Danh sách,Điểm,Tập đã xem',...rows().map(r=>r.map(q).join(','))].join('\n'),'text/csv')}
  else if(x==='md')save('mono-saved.md',['| Tên | Năm | Danh sách | Điểm | Tập |','|---|---|---|---|---|',...rows().map(r=>'| '+r.map(v=>String(v).replace(/\|/g,'\\|')).join(' | ')+' |')].join('\n'),'text/markdown');
  else if(x==='cc'){CACHE.clear();toast('Đã xóa cache API')}
  else if(x==='lg')navigator.clipboard.writeText(LOGS().join('\n')||'Không có lỗi').then(()=>toast('Đã sao chép nhật ký'),()=>toast('Không sao chép được'));
  else if(x==='bk'){const s=JSON.parse(localStorage.getItem(bkKey())||'[]')[0];
    if(!s)return toast('Chưa có bản sao lưu');
    if(!confirm('Khôi phục bản sao lưu lúc '+new Date(s.t).toLocaleString('vi-VN')+'? Dữ liệu hiện tại sẽ bị ghi đè.'))return;
    SV.put(s.d.saved);ls.set('notes',JSON.stringify(s.d.notes));ls.set('prog',JSON.stringify(s.d.prog));NT.c=null;DN.c=null;toast('Đã khôi phục')}
});
})();
