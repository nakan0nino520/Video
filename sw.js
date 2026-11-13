// sw.js — đặt cùng thư mục với file HTML của Mono (cần https hoặc localhost)
const SHELL='mono-shell-v1',IMG='mono-img-v1',MAX_IMG=250;

self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));

async function trim(c){const k=await c.keys();if(k.length>MAX_IMG)await c.delete(k[0])}

self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.destination==='image'){
    e.respondWith(caches.open(IMG).then(async c=>{
      const hit=await c.match(r);if(hit)return hit;
      try{ // cors để không dính dung lượng "opaque" phình to của Chrome
        const n=await fetch(u.href,{mode:'cors',credentials:'omit'});
        if(n.ok){c.put(r,n.clone()).then(()=>trim(c)).catch(()=>{})}
        return n;
      }catch(x){return fetch(r)}
    }));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(n=>{
      if(n.ok){const c=n.clone();caches.open(SHELL).then(h=>h.put(r,c)).catch(()=>{})}
      return n;
    }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||Response.error())));
  }
});
