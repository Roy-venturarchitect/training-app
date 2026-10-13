const PG=window.PROGRAMME,K="roytrain.v1";
let S=JSON.parse(localStorage.getItem(K)||"null")||{start:iso(new Date()),days:[1,3,5],checks:{},logs:{},metrics:[]};S.load=S.load||{};S.bells=S.bells||{L:"",M:"",H:""};
function save(){localStorage.setItem(K,JSON.stringify(S))}
function iso(d){return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)}
function pd(s){const[a,b,c]=s.split("-");return new Date(a,b-1,c)}
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const DN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function dayType(ds){const i=S.days.indexOf(pd(ds).getDay());return i<0?null:"ABC"[i%3]}
let tab="today",sel=iso(new Date()),pick=null,cm=new Date();cm.setDate(1);
function go(t){tab=t;document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t==t));render();scrollTo(0,0)}
function render(){({today,cal,log,body,settings})[tab]()}
function week(ds){return Math.max(1,Math.floor((pd(ds)-pd(S.start))/864e5/7)+1)}

/* TODAY */
const LN={L:"Light",M:"Medium",H:"Heavy"};
function loadOf(e){return S.load[e.id]||e.load}
function setLoad(id,v){S.load[id]=v;save();document.querySelectorAll(`[data-ld="${id}"] button`).forEach(b=>b.classList.toggle("on",b.dataset.v==v));const c=document.querySelector(`[data-lc="${id}"]`);if(c)c.textContent=LN[v]}
function loadPicker(e){return `<div class="tag">Load</div><div class="seg ld" data-ld="${e.id}">${["L","M","H"].map(v=>`<button data-v="${v}" class="${loadOf(e)==v?"on":""}" onclick="setLoad('${e.id}','${v}')">${LN[v]}${S.bells[v]?`<small>${esc(S.bells[v])}</small>`:""}</button>`).join("")}</div><div class="sub">Suggested: ${LN[e.load]}. ${esc(PG.loadNote)}</div>`}
function exHTML(e,ds){const c=(S.checks[ds]||{})[e.id];const yt="https://www.youtube.com/results?search_query="+encodeURIComponent(e.q);
return `<div class="card exc ${c?"isdone":""}"><details data-id="${e.id}"><summary class="ex">${figureSVG(e.svg,"thumb")}<div class="t"><h3>${esc(e.name)}</h3><div class="dose">${esc(e.dose)}</div><div class="meta">${e.load?`<span class="chip" data-lc="${e.id}">${LN[loadOf(e)]}</span>`:""}<span class="more">How-to ›</span></div></div>
<button class="chk ${c?"done":""}" onclick="event.preventDefault();tick('${ds}','${e.id}')">${c?"✓":""}</button></summary>
<div class="det">${figureSVG(e.svg)}<div class="legend"><i class="lg-hl"></i>working muscles / joints <i class="lg-ar"></i>movement</div>${e.load?loadPicker(e):""}<div class="tag">Steps</div><ol>${e.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
<div class="tag">Key cues</div><ul>${e.cues.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
<div class="tag">Easier / joint-friendly option</div><div class="easy">${esc(e.easier)}</div>
<div class="row" style="margin-top:10px"><a class="btn s" href="${yt}" target="_blank" rel="noopener">▶ Demo videos</a>
${e.timer?`<button class="btn s" onclick="startTimer(${e.timer.emom?`'emom',${e.timer.emom}`:`'secs',${e.timer.secs}`})">⏱ ${e.timer.emom?"EMOM timer":"Hold timer"}</button>`:""}</div></div></details></div>`}
function tick(ds,id){(S.checks[ds]=S.checks[ds]||{})[id]=!(S.checks[ds][id]);save();const y=scrollY,open=[...document.querySelectorAll("details[open]")].map(d=>d.dataset.id);render();open.forEach(i=>{const d=document.querySelector(`details[data-id="${i}"]`);if(d)d.open=true});scrollTo(0,y);navigator.vibrate&&navigator.vibrate(15)}
function today(){const t=pick||dayType(sel)||"A";const blocks=["prep",t,"fin"];
const all=blocks.flatMap(b=>PG.blocks[b].ex),done=all.filter(e=>(S.checks[sel]||{})[e.id]).length;
$("main").innerHTML=`<div class="sub">${DN[pd(sel).getDay()]} ${sel} · Week ${week(sel)} ${dayType(sel)?"· Scheduled Day "+dayType(sel):"· Rest day (extra session OK)"}</div>
<div class="seg">${["A","B","C"].map(d=>`<button class="${d==t?"on":""}" onclick="pick='${d}';render()">Day ${d}</button>`).join("")}</div>
<div class="card"><div class="timer" id="tm">${fmt(el())}</div><div class="sub" id="tml" style="text-align:center">Session timer</div>
<div class="row" style="justify-content:center;margin-top:8px"><button class="btn" onclick="tgl()">${T.run?"Pause":"Start"}</button><button class="btn s" onclick="rst()">Reset</button></div></div>
<div class="prog"><span style="width:${Math.round(done/all.length*100)}%"></span></div><div class="sub">${done}/${all.length} exercises ticked · ${esc(PG.progression)}</div>
${blocks.map(b=>{const B=PG.blocks[b];return `<h2>${esc(B.name)} <span class="sub">${esc(B.time)}</span></h2><div class="sub">${esc(B.note)}</div>${B.ex.map(e=>exHTML(e,sel)).join("")}`}).join("")}
<button class="btn" style="width:100%;margin-top:14px" onclick="openLog('${sel}','${t}')">Finish & log session</button>`}
/* timers */
let T={run:0,base:0,t0:0,mode:null};
function el(){return T.base+(T.run?Date.now()-T.t0:0)}
function fmt(ms){const s=Math.floor(ms/1e3);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function tgl(){if(T.run){T.base=el();T.run=0}else{T.t0=Date.now();T.run=1}render()}
function rst(){T={run:0,base:0,t0:0,mode:null};render()}
function startTimer(m,n){T={run:1,base:0,t0:Date.now(),mode:m,n};go("today")}
let lastBeep=-1;
function beep(){try{const a=new (window.AudioContext||webkitAudioContext)(),o=a.createOscillator();o.connect(a.destination);o.frequency.value=880;o.start();o.stop(a.currentTime+.25)}catch(e){}navigator.vibrate&&navigator.vibrate(200)}
setInterval(()=>{const m=$("#tm");if(!m)return;const e=el();
 if(T.mode=="emom"){const tot=T.n*6e4;if(e>=tot){m.textContent="DONE";$("#tml").textContent="Swings complete";if(T.run){T.run=0;T.base=tot;beep()}return}
  const r=6e4-e%6e4,mi=Math.floor(e/6e4);m.textContent=fmt(r);$("#tml").textContent=`EMOM minute ${mi+1}/${T.n} — 10 swings`;if(mi!=lastBeep){lastBeep=mi;beep()}}
 else if(T.mode=="secs"){const r=T.n*1e3-e;if(r<=0){m.textContent="DONE";if(T.run){T.run=0;beep()}return}m.textContent=fmt(r+999);$("#tml").textContent="Hold"}
 else m.textContent=fmt(e)},250);

/* CALENDAR */
function streak(){let n=0,d=new Date();if(!S.logs[iso(d)]?.completed)d.setDate(d.getDate()-1);
 for(let i=0;i<400;i++){const ds=iso(d);if(dayType(ds)){if(S.logs[ds]?.completed)n++;else break}if(ds<S.start)break;d.setDate(d.getDate()-1)}return n}
function cal(){const y=cm.getFullYear(),m=cm.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),td=iso(new Date());
 let g=["M","T","W","T","F","S","S"].map(x=>`<div class="h">${x}</div>`).join("")+"<div></div>".repeat(first);
 let sch=0,dn=0;for(let d=1;d<=n;d++){const ds=iso(new Date(y,m,d)),s=dayType(ds)&&ds>=S.start,c=S.logs[ds]?.completed;if(s&&ds<=td)sch++;if(c)dn++;
  g+=`<div class="${c?"dn":s?(ds<td?"ms":"sch"):""} ${ds==td?"td":""}" onclick="sel='${ds}';pick=null;go('today')">${d}</div>`}
 $("main").innerHTML=`<div class="row" style="justify-content:space-between"><button class="btn s" onclick="cm.setMonth(cm.getMonth()-1);cal()">‹</button><h2>${cm.toLocaleString(undefined,{month:"long",year:"numeric"})}</h2><button class="btn s" onclick="cm.setMonth(cm.getMonth()+1);cal()">›</button></div>
 <div class="card grid">${g}</div><div class="sub">Orange outline = scheduled · green = done · dashed = missed · tap a day to open it</div>
 <div class="row"><div class="card" style="flex:1"><div class="big">${streak()}</div><div class="sub">session streak</div></div><div class="card" style="flex:1"><div class="big">${dn}/${sch}</div><div class="sub">done this month (so far)</div></div></div>`}

/* LOG */
function openLog(ds,t){tab="log";document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t=="log"));const L=S.logs[ds]||{completed:true,day:t,rpe:6,min:Math.round(el()/6e4)||""};
 $("main").innerHTML=`<h2>Log session</h2><div class="card"><label>Date</label><input type="date" id="ld" value="${ds}">
 <label>Session</label><select id="lt">${["A","B","C"].map(d=>`<option ${L.day==d?"selected":""}>${d}</option>`).join("")}</select>
 <label><input type="checkbox" id="lc" style="width:auto" ${L.completed?"checked":""}> Completed</label><br>
 <label>Duration (min)</label><input type="number" id="lm" inputmode="numeric" value="${L.min??""}">
 <label>RPE (effort 1-10): <b id="rv">${L.rpe}</b></label><input type="range" id="lr" min="1" max="10" value="${L.rpe}" oninput="rv.textContent=this.value">
 <label>Ankles feel</label><input id="la" value="${esc(L.ankle)}" placeholder="e.g. fine / stiff left">
 <label>Knees feel</label><input id="lk" value="${esc(L.knee)}">
 <label>Neck feel</label><input id="ln" value="${esc(L.neck)}">
 <label>Notes</label><textarea id="lo" rows="3">${esc(L.notes)}</textarea>
 <button class="btn" style="width:100%" onclick="saveLog('${ds}')">Save</button></div>`}
function loadsFor(d){const o={};["prep",d,"fin"].forEach(b=>PG.blocks[b].ex.forEach(e=>{if(e.load)o[e.name]=LN[loadOf(e)]}));return o}
function saveLog(old){const ds=$("#ld").value,prev=S.logs[old];if(old!=ds)delete S.logs[old];S.logs[ds]={day:$("#lt").value,loads:(prev&&prev.loads&&prev.day==$("#lt").value)?prev.loads:loadsFor($("#lt").value),completed:$("#lc").checked,min:$("#lm").value,rpe:+$("#lr").value,ankle:$("#la").value,knee:$("#lk").value,neck:$("#ln").value,notes:$("#lo").value};save();go("log")}
function log(){const ks=Object.keys(S.logs).sort().reverse();
 $("main").innerHTML=`<div class="row" style="justify-content:space-between"><h2>Session log</h2><button class="btn" onclick="openLog('${iso(new Date())}','${dayType(iso(new Date()))||"A"}')">+ Log</button></div>
 ${ks.length?ks.map(k=>{const L=S.logs[k];return `<div class="card" onclick="openLog('${k}','${L.day}')"><b>${k}</b> · Day ${L.day} ${L.completed?"✅":"⏸"} · RPE ${L.rpe}${L.min?` · ${L.min} min`:""}
 <div class="sub">${["Ankles:"+esc(L.ankle),"Knees:"+esc(L.knee),"Neck:"+esc(L.neck)].filter(x=>!x.endsWith(":")).join(" · ")}</div>${L.notes?`<div>${esc(L.notes)}</div>`:""}${L.loads?`<div class="sub">Load: ${Object.entries(L.loads).map(([k,v])=>esc(k)+" "+v).join(" · ")}</div>`:""}</div>`}).join(""):`<div class="card sub">No sessions logged yet.</div>`}`}

/* BODY */
const MF=[["weight","Weight (kg)"],["waist","Waist (cm)"],["hr","Resting HR (bpm)"],["ktw","Knee-to-wall ankle (cm, L/R avg)"],["sq","Deep squat hold (s)"]];let mk="weight";
function body(){const M=S.metrics.slice().sort((a,b)=>a.date<b.date?-1:1);
 $("main").innerHTML=`<h2>Body metrics</h2><div class="card"><label>Date</label><input type="date" id="md" value="${iso(new Date())}">
 ${MF.map(([k,l])=>`<label>${l}${k=="ktw"||k=="sq"?" — optional":""}</label><input type="number" step="0.1" inputmode="decimal" id="m_${k}">`).join("")}
 <button class="btn" style="width:100%" onclick="addM()">Add entry</button></div>
 <div class="seg">${MF.map(([k,l])=>`<button class="${k==mk?"on":""}" onclick="mk='${k}';body()">${l.split(" (")[0]}</button>`).join("")}</div>
 <canvas id="cv"></canvas>
 <div class="card"><table><tr><th>Date</th>${MF.map(f=>`<th>${f[0]}</th>`).join("")}<th></th></tr>${M.slice().reverse().map(r=>`<tr><td>${r.date.slice(5)}</td>${MF.map(f=>`<td>${r[f[0]]??""}</td>`).join("")}<td onclick="delM('${r.date}')">✕</td></tr>`).join("")}</table></div>`;
 draw(M.filter(r=>r[mk]!=null).map(r=>[r.date,r[mk]]))}
function addM(){const r={date:$("#md").value};MF.forEach(([k])=>{const v=$("#m_"+k).value;if(v!=="")r[k]=+v});if(Object.keys(r).length<2)return alert("Enter at least one value");
 S.metrics=S.metrics.filter(x=>x.date!=r.date).concat(r);save();body()}
function delM(d){if(confirm("Delete entry "+d+"?")){S.metrics=S.metrics.filter(x=>x.date!=d);save();body()}}
function draw(pts){const c=$("#cv"),r=devicePixelRatio||1,w=c.clientWidth,h=180;c.width=w*r;c.height=h*r;const x=c.getContext("2d");x.scale(r,r);x.fillStyle="#9aa1ad";x.font="12px system-ui";
 if(pts.length<1){x.fillText("No data yet",12,24);return}const vs=pts.map(p=>p[1]);let lo=Math.min(...vs),hi=Math.max(...vs);if(lo==hi){lo-=1;hi+=1}
 const X=i=>30+(pts.length<2?(w-40)/2:i*(w-50)/(pts.length-1)),Y=v=>h-24-(v-lo)/(hi-lo)*(h-44);
 x.fillText(hi.toFixed(1),2,18);x.fillText(lo.toFixed(1),2,h-20);x.fillText(pts[0][0].slice(5),24,h-4);if(pts.length>1)x.fillText(pts.at(-1)[0].slice(5),w-40,h-4);
 x.strokeStyle="#f5a524";x.lineWidth=2.5;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(i),Y(p[1])):x.moveTo(X(i),Y(p[1])));x.stroke();
 x.fillStyle="#f5a524";pts.forEach((p,i)=>{x.beginPath();x.arc(X(i),Y(p[1]),4,0,7);x.fill()})}

/* SETTINGS */
function settings(){$("main").innerHTML=`<h2>Settings</h2><div class="card"><label>Programme start date (Week 1)</label><input type="date" id="ss" value="${S.start}">
 <label>Training days (sessions A, B, C in order)</label><div class="seg">${[1,2,3,4,5,6,0].map(d=>`<button class="${S.days.includes(d)?"on":""}" onclick="tday(${d})">${DN[d]}</button>`).join("")}</div>
 <button class="btn" onclick="S.start=ss.value;save();alert('Saved')">Save start date</button></div>
 <div class="card"><h3>My kettlebells</h3><p class="sub">Optional: note which bells you use for each category (e.g. Light = 8kg).</p>
 ${["L","M","H"].map(v=>`<label>${LN[v]}</label><input id="b_${v}" value="${esc(S.bells[v])}" placeholder="e.g. ${{L:"8kg",M:"12kg",H:"16kg"}[v]}" onchange="S.bells['${v}']=this.value;save()">`).join("")}</div>
 <div class="card"><h3>Backup</h3><p class="sub">Data lives only on this phone. Export regularly.</p><div class="row"><button class="btn" onclick="exp()">Export JSON</button><button class="btn s" onclick="fi.click()">Import JSON</button></div>
 <input type="file" id="fi" accept="application/json,.json" style="display:none" onchange="imp(this.files[0])"></div>
 <div class="card sub">${esc(PG.title)} · ${esc(PG.phase)}</div>`}
function tday(d){S.days=S.days.includes(d)?S.days.filter(x=>x!=d):[...S.days,d].sort((a,b)=>((a+6)%7)-((b+6)%7));save();settings()}
async function exp(){const txt=JSON.stringify(S,null,1),name="training-backup-"+iso(new Date())+".json",f=new File([txt],name,{type:"application/json"});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return}catch(e){}}
 const a=document.createElement("a");a.href=URL.createObjectURL(f);a.download=name;a.click()}
function imp(f){f.text().then(t=>{const d=JSON.parse(t);if(!d.logs||!d.metrics)throw 0;if(confirm("Replace all data with this backup?")){S=d;save();go("today")}}).catch(()=>alert("Not a valid backup file"))}

document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{if(b.dataset.t=="today"){sel=iso(new Date());pick=null}go(b.dataset.t)});
go("today");
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(r=>r.update());let _r=0;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!_r){_r=1;location.reload()}});document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")navigator.serviceWorker.getRegistration().then(r=>r&&r.update())})}
