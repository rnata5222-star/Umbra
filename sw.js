const C='umbra-v2',S='umbra-share';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon-192.png','icon-512.png'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C&&x!=S).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
if(e.request.method=='POST'&&u.pathname.endsWith('/share-target')){e.respondWith((async()=>{const fd=await e.request.formData(),c=await caches.open(S),sc=self.registration.scope;
for(const k of await c.keys())await c.delete(k);let i=0;
for(const f of fd.getAll('files')){if(!f||!f.name)continue;await c.put(sc+'shared/'+(i++),new Response(f,{headers:{'x-name':encodeURIComponent(f.name),'x-mod':String(f.lastModified),'content-type':f.type||'application/octet-stream'}}))}
const t=['title','text','url'].map(k=>fd.get(k)).filter(x=>x&&typeof x=='string').join('\n');if(t)await c.put(sc+'shared/text',new Response(t));
return Response.redirect(sc+'?shared=1',303)})());return}
if(e.request.method!='GET')return;
e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)))});
