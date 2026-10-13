const CACHE="training-v3";// bump when content changes
const FILES=["./","index.html","style.css","app.js","programme.js","figures.js","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
// network-first so content updates arrive; cache fallback offline
self.addEventListener("fetch",e=>{if(e.request.method!="GET")return;e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
