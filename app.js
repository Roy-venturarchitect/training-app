const PG=window.PROGRAMME,K="roytrain.v1";
let S=JSON.parse(localStorage.getItem(K)||"null")||{start:iso(new Date()),days:[1,3,5],checks:{},logs:{},metrics:[]};
function norm(){Object.assign(S,Object.assign({load:{},bells:{L:"",M:"",H:""},cardio:{},retests:[],checkin:{},bump:{},sugDone:{},phase:1,hasBar:false,voice:true},S))}norm();
function save(){localStorage.setItem(K,JSON.stringify(S))}
function iso(d){return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)}
function pd(s){const[a,b,c]=s.split("-");return new Date(a,b-1,c)}
function addDays(ds,n){const d=pd(ds);d.setDate(d.getDate()+n);return iso(d)}
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const DN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],LN={L:"Light",M:"Medium",H:"Heavy"},TODAY=()=>iso(new Date());
function dayType(ds){const i=S.days.indexOf(pd(ds).getDay());return i<0?null:"ABC"[i%3]}
let tab="today",sel=TODAY(),pick=null,cm=new Date();cm.setDate(1);
function go(t){tab=t;document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t==t));render();scrollTo(0,0)}
function render(){({today,cal,log,body,settings})[tab]()}
function week(ds){return Math.max(1,Math.floor((pd(ds)-pd(S.start))/864e5/7)+1)}

/* ---------- programme helpers ---------- */
function blk(b){return (b=="prep"||b=="fin")?PG.blocks[b]:(S.phase==2?PG.phase2.blocks[b]:PG.blocks[b])}
const RANK={g:0,a:1,r:2};
function ci(ds){return S.checkin[ds]}
function eff(e,ds){let x=Object.assign({},e);
 if(x.needs=="bar"&&!S.hasBar&&x.alt)x=Object.assign(x,x.alt,{swapNote:"No bar: alternative"});
 const c=ci(ds);if(c&&x.joints){const bad=x.joints.filter(j=>c[j]&&c[j]!="g");if(bad.length){const worst=Math.max(...bad.map(j=>RANK[c[j]]));
  if(x.regress)x=Object.assign(x,x.regress,{swapped:true,orig:e.name,swapNote:"Gentler swap ("+bad.join(", ")+" "+(worst==2?"red":"amber")+")"});
  if(x.load)x.suggestDown=true}}
 if(S.bump[e.id]&&!x.swapped)x.dose=x.dose+` (+${S.bump[e.id]} reps)`;return x}
function loadOf(e){return S.load[e.id]||e.load}
function lighter(v){return v=="H"?"M":"L"}
function setLoad(id,v){S.load[id]=v;save();document.querySelectorAll(`[data-ld="${id}"] button`).forEach(b=>b.classList.toggle("on",b.dataset.v==v));document.querySelectorAll(`[data-lc="${id}"]`).forEach(c=>c.textContent=LN[v])}
function loadPicker(e,short){const sug=e.suggestDown?`<div class="warn">Joint check-in: consider ${LN[lighter(loadOf(e))]} today.</div>`:"";
 return `<div class="tag">Load</div><div class="seg ld" data-ld="${e.id}">${["L","M","H"].map(v=>`<button data-v="${v}" class="${loadOf(e)==v?"on":""}" onclick="setLoad('${e.id}','${v}')">${LN[v]}${S.bells[v]?`<small>${esc(S.bells[v])}</small>`:""}</button>`).join("")}</div>${sug}${short?"":`<div class="sub">Suggested: ${LN[e.load]}. ${esc(PG.loadNote)}</div>`}`}
function sessionEx(t,ds){return ["prep",t,"fin"].flatMap(b=>blk(b).ex.map(e=>eff(e,ds)))}

/* ---------- TODAY ---------- */
function exHTML(e,ds){const c=(S.checks[ds]||{})[e.id];const yt="https://www.youtube.com/results?search_query="+encodeURIComponent(e.q||e.name);
return `<div class="card exc ${c?"isdone":""}"><details data-id="${e.id}" ontoggle="clipToggle(this)"><summary class="ex">${figureSVG(e.svg,"thumb")}<div class="t"><h3>${esc(e.name)}</h3><div class="dose">${esc(e.dose)}</div><div class="meta">${e.swapNote?`<span class="chip sw">${esc(e.swapNote)}</span>`:""}${e.load?`<span class="chip" data-lc="${e.id}">${LN[loadOf(e)]}</span>`:""}<span class="more">How-to ›</span></div></div>
<button class="chk ${c?"done":""}" onclick="event.preventDefault();tick('${ds}','${e.id}')">${c?"✓":""}</button></summary>
<div class="det">${e.orig?`<div class="sub">Replaces: ${esc(e.orig)}</div>`:""}<div class="clip">${animSVG(e.svg)}<button class="clipbtn" onclick="clipPlay(this)">❚❚</button><span class="cliplab">Demo clip</span></div>
<div class="legend"><i class="lg-hl"></i>working muscles / joints <i class="lg-ar"></i>movement</div>
<details class="still"><summary class="sub">Show start / end positions</summary>${figureSVG(e.svg)}</details>
${e.load?loadPicker(e):""}<div class="tag">Steps</div><ol>${e.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
${e.cues?`<div class="tag">Key cues</div><ul>${e.cues.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>`:""}
${e.easier?`<div class="tag">Easier / joint-friendly option</div><div class="easy">${esc(e.easier)}</div>`:""}
<div class="row" style="margin-top:12px"><a class="btn s sm" href="${yt}" target="_blank" rel="noopener">YouTube demos ↗</a></div></div></details></div>`}
function clipToggle(d){if(d.classList.contains("still"))return;const s=d.querySelector(".clip svg");if(!s)return;if(d.open)startAnim(s);else stopAnim(s)}
function clipPlay(b){const s=b.parentNode.querySelector("svg");if(s._on){stopAnim(s);b.textContent="▶"}else{startAnim(s);b.textContent="❚❚"}}
function tick(ds,id){(S.checks[ds]=S.checks[ds]||{})[id]=!(S.checks[ds][id]);save();const y=scrollY,open=[...document.querySelectorAll("details[open][data-id]")].map(d=>d.dataset.id);render();open.forEach(i=>{const d=document.querySelector(`details[data-id="${i}"]`);if(d)d.open=true});scrollTo(0,y);navigator.vibrate&&navigator.vibrate(15)}
function ciBadge(ds){const c=ci(ds);if(!c)return `<button class="btn s w" onclick="openCheckin('${ds}')">🩺 Joint check-in</button>`;
 return `<div class="card cic" onclick="openCheckin('${ds}')"><div class="row sp"><b>Today's check-in</b><span class="sub">edit</span></div><div class="dots">${["ankle","knee","neck","energy"].map(j=>`<span class="dot ${c[j]}">${j[0].toUpperCase()+j.slice(1)}</span>`).join("")}</div>${c.energy=="r"?`<div class="warn">Low energy: guided mode will do one round fewer.</div>`:""}</div>`}
function today(){const isStr=dayType(sel),cd=S.cardio[sel],t=pick||isStr||null,ds=sel;
 let h=`<div class="sub">${DN[pd(ds).getDay()]} ${ds} · Week ${week(ds)} · ${S.phase==2?"Phase 2":"Phase 1"}${isStr?" · Strength Day "+isStr:PG.cardio.days.includes(pd(ds).getDay())?" · Cardio-optional day":" · Rest day"}</div>`;
 h+=noticesHTML(ds);
 if(!isStr)h+=cardioDayHTML(ds);
 if(!t){h+=`<button class="btn s w" onclick="pick='A';render()">Do a strength session instead</button>`;$("main").innerHTML=h;return}
 const all=sessionEx(t,ds),done=all.filter(e=>(S.checks[ds]||{})[e.id]).length;
 h+=`<div class="seg">${["A","B","C"].map(d=>`<button class="${d==t?"on":""}" onclick="pick='${d}';render()">Day ${d}</button>`).join("")}</div>
 <div class="hero"><div><div class="ht">${esc(blk(t).name)}</div><div class="sub">${esc(blk(t).time)} + prep & finisher</div></div>
 <button class="btn big2" onclick="startGuided('${ds}','${t}')">▶ Start guided</button></div>
 ${ciBadge(ds)}${progHTML(t,ds)}
 <div class="prog"><span style="width:${Math.round(done/all.length*100)}%"></span></div><div class="sub">${done}/${all.length} ticked · ${esc(PG.progression)}</div>
 ${["prep",t,"fin"].map(b=>{const B=blk(b);return `<h2>${esc(B.name)} <span class="sub">${esc(B.time)}</span></h2><div class="sub">${esc(B.note)}</div>${B.ex.map(e=>exHTML(eff(e,ds),ds)).join("")}`}).join("")}
 <button class="btn s w" style="margin-top:14px" onclick="openLog('${ds}','${t}')">Log manually</button>`;
 $("main").innerHTML=h}

/* ---------- notices: phase unlock, retest reminder, weekly totals ---------- */
function weekTotals(ds){const d=pd(ds),mon=addDays(ds,-((d.getDay()+6)%7));let st=0,ca=0,cp=0,min=0;
 for(let i=0;i<7;i++){const x=addDays(mon,i),L=S.logs[x],C=S.cardio[x];if(L&&L.completed){st++;min+=+L.min||0}if(C){if(C.done){ca++;min+=+C.dur||0}else cp++}}return{st,ca,cp,min}}
function phaseReady(){if(S.phase==2)return false;const end=addDays(S.start,28);if(TODAY()<end)return false;
 let n=0;for(const k in S.logs)if(k>=S.start&&k<end&&S.logs[k].completed)n++;return n>=9}
function lastRetest(){return S.retests.map(r=>r.date).sort().pop()}
function noticesHTML(ds){let h="";const w=weekTotals(ds);
 h+=`<div class="wk"><div><b>${w.st}</b>/3<span>strength</span></div><div><b>${w.ca}</b>${w.cp?`+${w.cp}`:""}<span>cardio${w.cp?" (+planned)":""}</span></div><div><b>${w.min}</b><span>min this week</span></div></div>`;
 if(phaseReady())h+=`<div class="card note good"><b>🎉 Phase 2 unlocked</b><div class="sub">4 weeks done with good adherence. Weeks 5-8 add cleans, push press, get-ups, pistol and pull-up progressions.</div><button class="btn sm" onclick="S.phase=2;save();render()">Start Phase 2</button></div>`;
 else if(S.phase==1&&week(TODAY())>4)h+=`<div class="card note"><b>Phase 2</b><div class="sub">Unlocks after 9 of 12 sessions in your first 4 weeks. You can also switch manually in Settings.</div></div>`;
 const lr=lastRetest();if(!lr||(pd(TODAY())-pd(lr))/864e5>=28)h+=`<div class="card note"><b>📏 Mobility retest due</b><div class="sub">${lr?"Last test "+lr+".":"Get a baseline."} Takes ~5 minutes.</div><button class="btn sm" onclick="bodyTab='mob';go('body')">Do retest</button></div>`;
 return h}

/* ---------- auto progression ---------- */
function suggestions(t){const out=[],logs=Object.keys(S.logs).sort().filter(k=>S.logs[k].completed&&S.logs[k].day==t&&(S.logs[k].phase||1)==S.phase&&S.logs[k].rpe);
 if(logs.length<2)return out;const last2=logs.slice(-2);if(!last2.every(k=>S.logs[k].rpe<=6))return out;
 blk(t).ex.forEach(e=>{if(S.sugDone[e.id]==last2[1])return;const cur=loadOf(e);
  if(e.load&&cur!="H")out.push({id:e.id,name:e.name,txt:`Move up to ${LN[cur=="L"?"M":"H"]}`,act:`S.load['${e.id}']='${cur=="L"?"M":"H"}'`,key:last2[1]});
  else if(!e.secs&&!e.timer)out.push({id:e.id,name:e.name,txt:"Add 2 reps per set",act:`S.bump['${e.id}']=(S.bump['${e.id}']||0)+2`,key:last2[1]});
});return out}
function progHTML(t){const s=suggestions(t);if(!s.length)return"";
 return `<div class="card note good"><b>📈 Ready to progress</b><div class="sub">Your last 2 Day ${t} sessions were RPE ≤ 6.</div>${s.map(x=>`<div class="sug"><span><b>${esc(x.name)}</b><br><span class="sub">${x.txt}</span></span><span class="row"><button class="btn sm" onclick="${x.act};S.sugDone['${x.id}']='${x.key}';save();render()">Apply</button><button class="btn s sm" onclick="S.sugDone['${x.id}']='${x.key}';save();render()">Skip</button></span></div>`).join("")}</div>`}

/* ---------- joint check-in ---------- */
let CI=null;
function openCheckin(ds,then){CI={ds,then,v:Object.assign({ankle:"g",knee:"g",neck:"g",energy:"g"},ci(ds)||{})};drawCheckin()}
function drawCheckin(){const L={ankle:"Ankles",knee:"Knees",neck:"Neck",energy:"Energy"},D={g:"Good",a:"Niggly",r:"Sore"},DE={g:"Good",a:"Meh",r:"Low"};
 sheet(`<h2 style="margin-top:0">Joint check-in</h2><p class="sub">How do things feel right now? Amber or red swaps in gentler moves and suggests a lighter load.</p>
 ${Object.keys(L).map(j=>`<div class="cirow"><span>${L[j]}</span><div class="tri">${["g","a","r"].map(v=>`<button class="${v} ${CI.v[j]==v?"on":""}" onclick="CI.v['${j}']='${v}';drawCheckin()">${(j=="energy"?DE:D)[v]}</button>`).join("")}</div></div>`).join("")}
 <button class="btn w" style="margin-top:16px" onclick="saveCheckin()">Save${CI.then?" & start":""}</button>`)}
function saveCheckin(){S.checkin[CI.ds]=CI.v;if(S.logs[CI.ds])S.logs[CI.ds].checkin=CI.v;save();closeSheet();const t=CI.then;CI=null;if(t)t();else render()}
function sheet(h){let s=$("#sheet");if(!s){s=document.createElement("div");s.id="sheet";s.innerHTML=`<div class="scrim" onclick="closeSheet()"></div><div class="panel"></div>`;document.body.appendChild(s)}s.querySelector(".panel").innerHTML=`<div class="grab"></div>`+h;requestAnimationFrame(()=>s.classList.add("open"))}
function closeSheet(){const s=$("#sheet");if(s){s.classList.remove("open");setTimeout(()=>s.remove(),250)}}

/* ---------- guided follow-along ---------- */
let G=null,wake=null;
function buildSteps(t,ds){const st=[],c=ci(ds);["prep",t,"fin"].forEach((b,bi)=>{const B=blk(b),ex=B.ex.map(e=>eff(e,ds));let R=B.rounds||1;if(c&&c.energy=="r"&&R>1)R--;
 if(bi>0)st.push({rest:20,label:"Get set: "+B.name});
 ex.filter(e=>e.once).forEach(e=>st.push({e,blk:B.name,r:1,R:1}));const ro=ex.filter(e=>!e.once);
 for(let r=1;r<=R;r++){ro.forEach(e=>st.push({e,blk:B.name,r,R}));if(r<R)st.push({rest:B.rest||60,label:`Rest — round ${r+1} of ${R} next`})}});return st}
function startGuided(ds,t){if(!ci(ds))return openCheckin(ds,()=>startGuided(ds,t));
 G={ds,t,steps:buildSteps(t,ds),i:0,paused:false,start:Date.now()};
 let g=document.createElement("div");g.id="guided";document.body.appendChild(g);document.body.classList.add("noscroll");
 try{navigator.wakeLock&&navigator.wakeLock.request("screen").then(w=>wake=w).catch(()=>{})}catch(e){}
 unlockAudio();enter(0)}
function stepDur(s){if(s.rest)return s.rest;if(s.e.timer&&s.e.timer.emom)return s.e.timer.emom*60;if(s.e.secs)return s.e.secs;return 0}
function enter(i){if(i>=G.steps.length)return finishGuided();G.i=Math.max(0,i);const s=G.steps[G.i];G.rem=stepDur(s);G.tot=G.rem;G.lastMin=-1;G.paused=false;G.last=Date.now();
 if(s.rest)say(s.label.replace("—",",")+". Next: "+(nextEx()?.name||""));else say(s.e.name+". "+spoken(s.e.dose)+(s.R>1?`. Round ${s.r} of ${s.R}`:"")+(s.e.cues?". "+s.e.cues[0]:""));
 drawGuided();if(G.rem)beep(660,.12)}
function spoken(d){return d.replace(/×/g,"times").replace(/\bs\b/g,"seconds").replace(/(\d)-(\d)/g,"$1 to $2").replace(/\//g," per ")}
function nextEx(){for(let j=G.i+1;j<G.steps.length;j++)if(G.steps[j].e)return G.steps[j].e}
function drawGuided(){const s=G.steps[G.i],g=$("#guided"),n=G.steps.length,pct=Math.round(G.i/n*100);
 const top=`<div class="gtop"><button class="gx" onclick="closeGuided()">✕</button><div class="gbar"><span style="width:${pct}%"></span></div><button class="gx" onclick="S.voice=!S.voice;save();drawGuided()">${S.voice?"🔊":"🔇"}</button></div>`;
 const ctr=`<div class="gctl"><button class="gc" onclick="enter(G.i-1)">‹</button><button class="gc main" onclick="togglePause()">${G.paused?"▶":"❚❚"}</button><button class="gc" onclick="enter(G.i+1)">›</button></div>`;
 if(s.rest){const ne=nextEx();g.innerHTML=top+`<div class="gbody rest"><div class="glab">${esc(s.label)}</div><div class="gtime" id="gt">${fmtS(G.rem)}</div>
  <div class="row c"><button class="btn s sm" onclick="G.rem+=15;G.tot+=15;tickUI()">+15 s</button><button class="btn sm" onclick="enter(G.i+1)">Skip rest</button></div>
  ${ne?`<div class="gnext"><div class="sub">Up next</div>${figureSVG(ne.svg,"thumb")}<b>${esc(ne.name)}</b><div class="dose">${esc(ne.dose)}</div></div>`:""}</div>`+ctr;return}
 const e=s.e;g.innerHTML=top+`<div class="gbody"><div class="glab">${esc(s.blk)}${s.R>1?` · Round ${s.r}/${s.R}`:""} · ${G.i+1}/${n}</div>
 <div class="gfig">${animSVG(e.svg)}</div><h2 class="gname">${esc(e.name)}</h2><div class="gdose">${esc(e.dose)}</div>
 ${e.swapNote?`<div class="chip sw">${esc(e.swapNote)}</div>`:""}
 ${G.tot?`<div class="gtime" id="gt">${fmtS(G.rem)}</div><div class="sub c" id="gsub">${e.timer?"Every minute on the minute":"Hold"}</div>`:`<button class="btn done" onclick="markDone();enter(G.i+1)">Done ✓</button>`}
 ${e.load?`<div class="gload">${loadPicker(e,1)}</div>`:""}
 <details class="gcue"><summary>How to</summary><ol>${e.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>${e.cues?`<div class="sub">${e.cues.map(esc).join(" · ")}</div>`:""}</details></div>`+ctr;
 startAnim(g.querySelector(".gfig svg"))}
function fmtS(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function markDone(){const s=G.steps[G.i];if(s&&s.e){(S.checks[G.ds]=S.checks[G.ds]||{})[s.e.id]=true;save()}}
function togglePause(){G.paused=!G.paused;G.last=Date.now();const sv=$("#guided .gfig svg");if(sv)G.paused?stopAnim(sv):startAnim(sv);drawGuidedCtl()}
function drawGuidedCtl(){const b=$("#guided .gc.main");if(b)b.textContent=G.paused?"▶":"❚❚"}
function tickUI(){const t=$("#gt");if(t)t.textContent=fmtS(G.rem)}
setInterval(()=>{if(!G||G.paused||!G.tot)return;const now=Date.now(),dt=(now-G.last)/1e3;G.last=now;const before=G.rem;G.rem-=dt;
 const s=G.steps[G.i];
 if(s.e&&s.e.timer&&s.e.timer.emom){const el=G.tot-G.rem,mi=Math.floor(el/60);if(mi!=G.lastMin&&G.rem>0){G.lastMin=mi;beep(880,.2);say(`Minute ${mi+1}. Go`)}const ss=$("#gsub");if(ss)ss.textContent=`Minute ${Math.min(mi+1,s.e.timer.emom)} of ${s.e.timer.emom} · ${Math.ceil(60-el%60)} s left in minute`}
 [3,2,1].forEach(k=>{if(before>k&&G.rem<=k)beep(660,.08)});
 if(G.rem<=0){beep(990,.35);if(s.e)markDone();enter(G.i+1);return}tickUI()},200);
let AC=null;function unlockAudio(){try{AC=AC||new (window.AudioContext||webkitAudioContext)();AC.resume()}catch(e){}}
function beep(f=880,d=.25){try{unlockAudio();const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.frequency.value=f;g.gain.setValueAtTime(.25,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.start();o.stop(AC.currentTime+d)}catch(e){}navigator.vibrate&&navigator.vibrate(60)}
function say(t){if(!S.voice||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.rate=1.02;u.lang="en-GB";speechSynthesis.speak(u)}catch(e){}}
function closeGuided(ask=true){if(ask&&G&&G.i>0&&!confirm("Leave guided session? Ticked exercises are kept."))return;const g=$("#guided");if(g)g.remove();document.body.classList.remove("noscroll");
 try{wake&&wake.release()}catch(e){}wake=null;window.speechSynthesis&&speechSynthesis.cancel();G=null;render()}
document.addEventListener("visibilitychange",()=>{if(G&&document.visibilityState=="visible"&&navigator.wakeLock)navigator.wakeLock.request("screen").then(w=>wake=w).catch(()=>{})});
function finishGuided(){const mins=Math.round((Date.now()-G.start)/6e4);say("Session complete. Nice work.");G.fin={rpe:6,ankle:"g",knee:"g",neck:"g",min:mins};drawFinish()}
function drawFinish(){const f=G.fin,L={ankle:"Ankles",knee:"Knees",neck:"Neck"};$("#guided").innerHTML=`<div class="gbody fin"><div class="big">🎉</div><h2>Session complete</h2><div class="sub">${f.min} min · Day ${G.t}</div>
 <div class="card"><label>Effort (RPE 1-10): <b id="frv">${f.rpe}</b></label><input type="range" min="1" max="10" value="${f.rpe}" oninput="G.fin.rpe=+this.value;frv.textContent=this.value">
 ${Object.keys(L).map(j=>`<div class="cirow"><span>${L[j]}</span><div class="tri">${["g","a","r"].map(v=>`<button class="${v} ${f[j]==v?"on":""}" onclick="G.fin['${j}']='${v}';drawFinish()">${{g:"Good",a:"Niggly",r:"Sore"}[v]}</button>`).join("")}</div></div>`).join("")}
 <label>Notes</label><textarea id="fno" rows="2">${esc(f.notes)}</textarea></div>
 <button class="btn w" onclick="G.fin.notes=fno.value;saveGuided()">Save to log</button></div>`}
function saveGuided(){const f=G.fin,W={g:"good",a:"niggly",r:"sore"},ds=G.ds;
 S.logs[ds]={day:G.t,phase:S.phase,completed:true,min:f.min,rpe:f.rpe,ankle:W[f.ankle],knee:W[f.knee],neck:W[f.neck],notes:f.notes||"",loads:loadsFor(G.t,ds),checkin:ci(ds),guided:true};save();closeGuided(false);go("log")}

/* ---------- cardio ---------- */
function ctype(id){return PG.cardio.types.find(x=>x.id==id)}
function cardioDayHTML(ds){const C=S.cardio[ds],ok=PG.cardio.days.includes(pd(ds).getDay());
 if(!C){if(!ok)return"";return `<h2>Optional cardio</h2><div class="sub">${esc(PG.cardio.note)}</div><div class="ctypes">${PG.cardio.types.map(t=>`<button class="ctype" onclick="planCardio('${ds}','${t.id}')"><span>${t.icon}</span>${esc(t.name)}</button>`).join("")}</div>`}
 const t=ctype(C.type);return `<h2>${t.icon} ${esc(t.name)} ${C.done?'<span class="chip ok">Done</span>':'<span class="chip bl">Planned</span>'}</h2>
 <div class="card"><div class="tag" style="margin-top:0">Duration</div><div class="seg">${t.durations.map(d=>`<button class="${C.dur==d?"on":""}" onclick="S.cardio['${ds}'].dur=${d};save();render()">${d} min</button>`).join("")}</div>
 <div class="tag">Effort</div><div>${esc(t.effort)}</div><div class="tag">Options</div><ul>${t.options.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 <div class="tag">Joint-friendly cues</div><ul>${t.cues.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 <div class="tag">Warm-up mobility</div><ul>${t.warm.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="tag">Cool-down</div><ul>${t.cool.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 <div class="tag">Progression</div><div class="easy">${esc(t.progression)}</div>
 <div class="row" style="margin-top:12px"><button class="btn" onclick="openCardioLog('${ds}')">${C.done?"Edit log":"Log it"}</button><button class="btn s" onclick="delete S.cardio['${ds}'];save();render()">Remove</button></div></div>`}
function planCardio(ds,id){const t=ctype(id);S.cardio[ds]={type:id,dur:t.durations[1]||t.durations[0],done:false};save();render()}
function openCardioLog(ds,nw){const C=S.cardio[ds]||{type:"run",dur:30};tab="log";
 $("main").innerHTML=`<h2>Log cardio</h2><div class="card"><label>Date</label><input type="date" id="cd" value="${ds}"><label>Type</label><select id="ct">${PG.cardio.types.map(t=>`<option value="${t.id}" ${C.type==t.id?"selected":""}>${t.icon} ${esc(t.name)}</option>`).join("")}</select>
 <div class="row"><div style="flex:1"><label>Duration (min)</label><input id="cdu" type="number" inputmode="numeric" value="${C.dur??""}"></div><div style="flex:1"><label>Distance (km)</label><input id="cdi" type="number" step="0.1" inputmode="decimal" value="${C.dist??""}"></div></div>
 <label>Avg HR (optional)</label><input id="chr" type="number" inputmode="numeric" value="${C.hr??""}">
 <label>RPE: <b id="crv">${C.rpe||4}</b></label><input type="range" id="cr" min="1" max="10" value="${C.rpe||4}" oninput="crv.textContent=this.value">
 ${triInputs(C)}<label>Notes</label><textarea id="cno" rows="2">${esc(C.notes)}</textarea><button class="btn w" onclick="saveCardio('${ds}')">Save</button></div>`}
function triInputs(L){return ["ankle","knee","neck"].map(j=>`<label>${j[0].toUpperCase()+j.slice(1)}s feel</label><input id="j_${j}" value="${esc(L[j])}" placeholder="good / niggly / sore">`).join("").replace("Necks","Neck")}
function saveCardio(old){const ds=$("#cd").value;if(old!=ds)delete S.cardio[old];S.cardio[ds]={type:$("#ct").value,dur:+$("#cdu").value||0,dist:$("#cdi").value,hr:$("#chr").value,rpe:+$("#cr").value,ankle:$("#j_ankle").value,knee:$("#j_knee").value,neck:$("#j_neck").value,notes:$("#cno").value,done:true};save();go("log")}

/* ---------- CALENDAR ---------- */
function streak(){let n=0,d=new Date();if(!S.logs[iso(d)]?.completed)d.setDate(d.getDate()-1);
 for(let i=0;i<400;i++){const ds=iso(d);if(dayType(ds)){if(S.logs[ds]?.completed)n++;else break}if(ds<S.start)break;d.setDate(d.getDate()-1)}return n}
function cal(){const y=cm.getFullYear(),m=cm.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),td=TODAY();
 let g=["M","T","W","T","F","S","S"].map(x=>`<div class="h">${x}</div>`).join("")+"<div></div>".repeat(first);
 let sch=0,dn=0,cdn=0,cmin=0;for(let d=1;d<=n;d++){const ds=iso(new Date(y,m,d)),s=dayType(ds)&&ds>=S.start,c=S.logs[ds]?.completed,C=S.cardio[ds];if(s&&ds<=td)sch++;if(c)dn++;if(C&&C.done){cdn++;cmin+=+C.dur||0}
  g+=`<div class="${c?"dn":s?(ds<td?"ms":"sch"):""} ${ds==td?"td":""}" onclick="sel='${ds}';pick=null;go('today')">${d}${C?`<i class="cdot ${C.done?"cd":""}"></i>`:""}</div>`}
 $("main").innerHTML=`<div class="row sp"><button class="btn s" onclick="cm.setMonth(cm.getMonth()-1);cal()">‹</button><h2 style="margin:0">${cm.toLocaleString(undefined,{month:"long",year:"numeric"})}</h2><button class="btn s" onclick="cm.setMonth(cm.getMonth()+1);cal()">›</button></div>
 <div class="card grid">${g}</div><div class="sub">Orange = strength scheduled · green = done · dashed = missed · <span style="color:var(--bl)">● cardio planned</span> / filled = done. Tap a Tue/Thu/Sat/Sun to plan cardio.</div>
 <div class="row"><div class="card f1"><div class="big">${streak()}</div><div class="sub">strength streak</div></div><div class="card f1"><div class="big">${dn}/${sch}</div><div class="sub">strength this month</div></div><div class="card f1"><div class="big bl">${cdn}</div><div class="sub">cardio · ${cmin} min</div></div></div>`}

/* ---------- LOG ---------- */
function openLog(ds,t){tab="log";document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t=="log"));const L=S.logs[ds]||{completed:true,day:t,rpe:6,min:""};
 $("main").innerHTML=`<h2>Log strength session</h2><div class="card"><label>Date</label><input type="date" id="ld" value="${ds}">
 <label>Session</label><select id="lt">${["A","B","C"].map(d=>`<option ${L.day==d?"selected":""}>${d}</option>`).join("")}</select>
 <label class="inl"><input type="checkbox" id="lc" ${L.completed?"checked":""}> Completed</label>
 <label>Duration (min)</label><input type="number" id="lm" inputmode="numeric" value="${L.min??""}">
 <label>RPE (effort 1-10): <b id="rv">${L.rpe}</b></label><input type="range" id="lr" min="1" max="10" value="${L.rpe}" oninput="rv.textContent=this.value">
 ${triInputs(L)}<label>Notes</label><textarea id="lo" rows="3">${esc(L.notes)}</textarea>
 <button class="btn w" onclick="saveLog('${ds}')">Save</button>${S.logs[ds]?`<button class="btn s w" style="margin-top:8px" onclick="if(confirm('Delete this log?')){delete S.logs['${ds}'];save();go('log')}">Delete</button>`:""}</div>`}
function loadsFor(d,ds){const o={};["prep",d,"fin"].forEach(b=>blk(b).ex.forEach(e0=>{const e=eff(e0,ds||TODAY());if(e.load&&!e.swapped)o[e0.name]=LN[loadOf(e0)]}));return o}
function saveLog(old){const ds=$("#ld").value,prev=S.logs[old];if(old!=ds)delete S.logs[old];const d=$("#lt").value;
 S.logs[ds]={day:d,phase:prev?.phase||S.phase,loads:(prev&&prev.loads&&prev.day==d)?prev.loads:loadsFor(d,ds),checkin:prev?.checkin||ci(ds),completed:$("#lc").checked,min:$("#lm").value,rpe:+$("#lr").value,ankle:$("#j_ankle").value,knee:$("#j_knee").value,neck:$("#j_neck").value,notes:$("#lo").value};save();go("log")}
function log(){const items=[...Object.keys(S.logs).map(k=>({k,s:1})),...Object.keys(S.cardio).filter(k=>S.cardio[k].done).map(k=>({k,s:0}))].sort((a,b)=>a.k<b.k?1:-1);
 const CI2=c=>c?`<span class="dots sm">${["ankle","knee","neck","energy"].map(j=>`<span class="dot ${c[j]}">${j[0].toUpperCase()}</span>`).join("")}</span>`:"";
 $("main").innerHTML=`<div class="row sp"><h2>Log</h2><span class="row"><button class="btn sm" onclick="openLog('${TODAY()}','${dayType(TODAY())||"A"}')">+ Strength</button><button class="btn s sm" onclick="openCardioLog('${TODAY()}')">+ Cardio</button></span></div>
 ${items.length?items.map(({k,s})=>{if(!s){const C=S.cardio[k],t=ctype(C.type);return `<div class="card lg cardio" onclick="openCardioLog('${k}')"><b>${k}</b> · ${t.icon} ${esc(t.name)} · ${C.dur} min${C.dist?` · ${C.dist} km`:""} · RPE ${C.rpe}<div class="sub">${jf(C)}</div>${C.notes?`<div>${esc(C.notes)}</div>`:""}</div>`}
  const L=S.logs[k];return `<div class="card lg" onclick="openLog('${k}','${L.day}')"><b>${k}</b> · Day ${L.day}${(L.phase||1)==2?"2":""} ${L.completed?"✅":"⏸"} · RPE ${L.rpe}${L.min?` · ${L.min} min`:""} ${CI2(L.checkin)}
 <div class="sub">${jf(L)}</div>${L.notes?`<div>${esc(L.notes)}</div>`:""}${L.loads&&Object.keys(L.loads).length?`<div class="sub">Load: ${Object.entries(L.loads).map(([k,v])=>esc(k)+" "+v).join(" · ")}</div>`:""}</div>`}).join(""):`<div class="card sub">Nothing logged yet.</div>`}`}
function jf(L){return ["Ankles:"+esc(L.ankle),"Knees:"+esc(L.knee),"Neck:"+esc(L.neck)].filter(x=>!x.endsWith(":")).join(" · ")}

/* ---------- BODY: metrics / mobility / strength ---------- */
const MF=[["weight","Weight (kg)"],["waist","Waist (cm)"],["hr","Resting HR (bpm)"]];let mk="weight",bodyTab="met",rk="ktw",sk=null;
const RT=[["ktwL","Knee-to-wall L (cm)"],["ktwR","Knee-to-wall R (cm)"],["sq","Deep squat hold (s)"],["neckL","Neck rotation L (0-10)"],["neckR","Neck rotation R (0-10)"],["balL","Single-leg balance L (s)"],["balR","Single-leg balance R (s)"],["toe","Toe touch (cm past toes, − if short)"]];
const RC={ktw:["Ankle knee-to-wall",["ktwL","ktwR"]],sq:["Deep squat hold",["sq"]],neck:["Neck rotation comfort",["neckL","neckR"]],bal:["Single-leg balance",["balL","balR"]],toe:["Toe touch",["toe"]]};
function body(){const tabs=`<div class="seg">${[["met","Body"],["mob","Mobility"],["str","Strength"]].map(([k,l])=>`<button class="${bodyTab==k?"on":""}" onclick="bodyTab='${k}';body()">${l}</button>`).join("")}</div>`;
 if(bodyTab=="mob")return mob(tabs);if(bodyTab=="str")return strength(tabs);
 const M=S.metrics.slice().sort((a,b)=>a.date<b.date?-1:1);
 $("main").innerHTML=tabs+`<div class="card"><label>Date</label><input type="date" id="md" value="${TODAY()}">
 <div class="row">${MF.map(([k,l])=>`<div class="f1"><label>${l}</label><input type="number" step="0.1" inputmode="decimal" id="m_${k}"></div>`).join("")}</div>
 <button class="btn w" onclick="addM()">Add entry</button></div>
 <div class="seg">${MF.map(([k,l])=>`<button class="${k==mk?"on":""}" onclick="mk='${k}';body()">${l.split(" (")[0]}</button>`).join("")}</div><canvas id="cv"></canvas>
 <div class="card"><table><tr><th>Date</th>${MF.map(f=>`<th>${f[0]}</th>`).join("")}<th></th></tr>${M.slice().reverse().map(r=>`<tr><td>${r.date.slice(5)}</td>${MF.map(f=>`<td>${r[f[0]]??""}</td>`).join("")}<td onclick="delM('${r.date}')">✕</td></tr>`).join("")}</table></div>`;
 draw([{c:"#f5a524",pts:M.filter(r=>r[mk]!=null).map(r=>[r.date,r[mk]])}])}
function addM(){const r={date:$("#md").value};MF.forEach(([k])=>{const v=$("#m_"+k).value;if(v!=="")r[k]=+v});if(Object.keys(r).length<2)return alert("Enter at least one value");
 const o=S.metrics.find(x=>x.date==r.date);S.metrics=S.metrics.filter(x=>x.date!=r.date).concat(Object.assign(o||{},r));save();body()}
function delM(d){if(confirm("Delete entry "+d+"?")){S.metrics=S.metrics.filter(x=>x.date!=d);save();body()}}
function mob(tabs){const R=S.retests.slice().sort((a,b)=>a.date<b.date?-1:1),lr=lastRetest(),due=!lr||(pd(TODAY())-pd(lr))/864e5>=28;
 $("main").innerHTML=tabs+`<div class="card ${due?"note":""}"><b>Monthly mobility retest</b><div class="sub">${lr?`Last: ${lr} · next due ${addDays(lr,28)}`:"No baseline yet — do one now."}</div>
 <details class="still" ${due?"open":""}><summary class="sub">How to test</summary><ul class="sub"><li>Knee-to-wall: toes X cm from wall, knee touches wall, heel down. Max distance per side.</li><li>Deep squat: hold seconds, heels down if possible.</li><li>Neck: turn to each side; rate comfort/range 0-10.</li><li>Balance: eyes open, one leg, seconds up to 60.</li><li>Toe touch: straight knees, cm past toes (negative if short).</li></ul></details>
 <label>Date</label><input type="date" id="rd" value="${TODAY()}"><div class="g2">${RT.map(([k,l])=>`<div><label>${l}</label><input type="number" step="0.5" inputmode="decimal" id="r_${k}"></div>`).join("")}</div>
 <button class="btn w" onclick="addR()">Save retest</button></div>
 <div class="seg">${Object.entries(RC).map(([k,v])=>`<button class="${rk==k?"on":""}" onclick="rk='${k}';body()">${v[0]}</button>`).join("")}</div><canvas id="cv"></canvas><div class="sub">${RC[rk][1].length>1?'<span style="color:#f5a524">● Left</span> <span style="color:#4cc2ff">● Right</span>':""}</div>
 ${R.length?`<div class="card"><table><tr><th>Date</th>${RT.map(f=>`<th>${f[0]}</th>`).join("")}</tr>${R.slice().reverse().map(r=>`<tr onclick="if(confirm('Delete retest ${r.date}?')){S.retests=S.retests.filter(x=>x.date!='${r.date}');save();body()}"><td>${r.date.slice(5)}</td>${RT.map(f=>`<td>${r[f[0]]??""}</td>`).join("")}</tr>`).join("")}</table></div>`:""}`;
 const legacy=S.metrics.filter(m=>m.ktw!=null||m.sq!=null).map(m=>({date:m.date,ktwL:m.ktw,ktwR:m.ktw,sq:m.sq}));const all=[...legacy,...R].sort((a,b)=>a.date<b.date?-1:1);
 draw(RC[rk][1].map((k,i)=>({c:i?"#4cc2ff":"#f5a524",pts:all.filter(r=>r[k]!=null).map(r=>[r.date,r[k]])})))}
function addR(){const r={date:$("#rd").value};RT.forEach(([k])=>{const v=$("#r_"+k).value;if(v!=="")r[k]=+v});if(Object.keys(r).length<2)return alert("Enter at least one result");S.retests=S.retests.filter(x=>x.date!=r.date).concat(r);save();body()}
function strength(tabs){const names=[...new Set(Object.values(S.logs).flatMap(L=>Object.keys(L.loads||{})))];if(!sk||!names.includes(sk))sk=names[0];
 const ks=Object.keys(S.logs).filter(k=>S.logs[k].completed).sort(),V={Light:1,Medium:2,Heavy:3};
 $("main").innerHTML=tabs+`<div class="card"><b>Strength trends</b><div class="sub">Load category per exercise from your logs (1 Light · 2 Medium · 3 Heavy), plus session RPE. Rep bumps applied: ${Object.keys(S.bump).length?Object.entries(S.bump).map(([k,v])=>k+" +"+v).join(", "):"none yet"}.</div></div>
 ${names.length?`<div class="seg">${names.map(n=>`<button class="${n==sk?"on":""}" onclick="sk=this.dataset.n;body()" data-n="${esc(n)}">${esc(n.split(" (")[0].split(",")[0])}</button>`).join("")}</div><div class="sub">Load category</div><canvas id="cv"></canvas>`:`<div class="card sub">Log a few sessions to see trends.</div>`}
 <div class="sub" style="margin-top:12px">Session RPE (strength <span style="color:#f5a524">●</span> / cardio <span style="color:#4cc2ff">●</span>)</div><canvas id="cv2"></canvas>`;
 if(names.length)draw([{c:"#34d17a",pts:ks.filter(k=>S.logs[k].loads&&S.logs[k].loads[sk]).map(k=>[k,V[S.logs[k].loads[sk]]])}],"#cv",[0.5,3.5]);
 draw([{c:"#f5a524",pts:ks.map(k=>[k,S.logs[k].rpe])},{c:"#4cc2ff",pts:Object.keys(S.cardio).filter(k=>S.cardio[k].done).sort().map(k=>[k,S.cardio[k].rpe])}],"#cv2",[0,10])}
function draw(series,id="#cv",range){const c=$(id);if(!c)return;const r=devicePixelRatio||1,w=c.clientWidth,h=180;c.width=w*r;c.height=h*r;const x=c.getContext("2d");x.scale(r,r);x.fillStyle="#8c95a8";x.font="12px system-ui";
 const all=series.flatMap(s=>s.pts);if(!all.length){x.fillText("No data yet",14,26);return}
 const ds=[...new Set(all.map(p=>p[0]))].sort(),t0=+pd(ds[0]),t1=+pd(ds.at(-1)),vs=all.map(p=>p[1]);let lo=range?range[0]:Math.min(...vs),hi=range?range[1]:Math.max(...vs);if(lo==hi){lo-=1;hi+=1}
 const X=d=>t1==t0?w/2:34+(pd(d)-t0)/(t1-t0)*(w-50),Y=v=>h-24-(v-lo)/(hi-lo)*(h-44);
 x.strokeStyle="#252c3b";x.lineWidth=1;[0,.5,1].forEach(f=>{const yy=Y(lo+(hi-lo)*f);x.beginPath();x.moveTo(30,yy);x.lineTo(w-8,yy);x.stroke()});
 x.fillText(+hi.toFixed(1),4,Y(hi)+4);x.fillText(+lo.toFixed(1),4,Y(lo)+4);x.fillText(ds[0].slice(5),28,h-5);if(ds.length>1)x.fillText(ds.at(-1).slice(5),w-42,h-5);
 series.forEach(s=>{if(!s.pts.length)return;x.strokeStyle=s.c;x.fillStyle=s.c;x.lineWidth=2.5;x.lineJoin="round";x.beginPath();s.pts.forEach((p,i)=>i?x.lineTo(X(p[0]),Y(p[1])):x.moveTo(X(p[0]),Y(p[1])));x.stroke();s.pts.forEach(p=>{x.beginPath();x.arc(X(p[0]),Y(p[1]),3.5,0,7);x.fill()})})}

/* ---------- SETTINGS ---------- */
function settings(){$("main").innerHTML=`<h2>Settings</h2><div class="card"><label>Programme start date (Week 1)</label><input type="date" id="ss" value="${S.start}" onchange="S.start=this.value;save()">
 <label>Strength days (A, B, C in order)</label><div class="seg">${[1,2,3,4,5,6,0].map(d=>`<button class="${S.days.includes(d)?"on":""}" onclick="tday(${d})">${DN[d]}</button>`).join("")}</div>
 <label>Phase</label><div class="seg">${[1,2].map(p=>`<button class="${S.phase==p?"on":""}" onclick="S.phase=${p};save();settings()">Phase ${p}${p==1?" (wk 1-4)":" (wk 5-8)"}</button>`).join("")}</div>
 <label class="inl"><input type="checkbox" ${S.hasBar?"checked":""} onchange="S.hasBar=this.checked;save()"> I have a pull-up bar / low bar (Phase 2 pull-ups)</label>
 <label class="inl"><input type="checkbox" ${S.voice?"checked":""} onchange="S.voice=this.checked;save()"> Spoken cues in guided mode</label></div>
 <div class="card"><h3>My kettlebells</h3><p class="sub">Optional: which bells you use for each category (e.g. Light = 8kg).</p>
 ${["L","M","H"].map(v=>`<label>${LN[v]}</label><input value="${esc(S.bells[v])}" placeholder="e.g. ${{L:"8kg",M:"12kg",H:"16kg"}[v]}" onchange="S.bells['${v}']=this.value;save()">`).join("")}</div>
 <div class="card"><h3>Backup</h3><p class="sub">Data lives only on this phone. Export regularly.</p><div class="row"><button class="btn" onclick="exp()">Export JSON</button><button class="btn s" onclick="fi.click()">Import JSON</button></div>
 <input type="file" id="fi" accept="application/json,.json" style="display:none" onchange="imp(this.files[0])"></div>
 <div class="card sub">${esc(PG.title)} · app ${window.APPV||""}</div>`}
function tday(d){S.days=S.days.includes(d)?S.days.filter(x=>x!=d):[...S.days,d].sort((a,b)=>((a+6)%7)-((b+6)%7));save();settings()}
async function exp(){const txt=JSON.stringify(S,null,1),name="training-backup-"+TODAY()+".json",f=new File([txt],name,{type:"application/json"});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return}catch(e){}}
 const a=document.createElement("a");a.href=URL.createObjectURL(f);a.download=name;a.click()}
function imp(f){f.text().then(t=>{const d=JSON.parse(t);if(!d.logs||!d.metrics)throw 0;if(confirm("Replace all data with this backup?")){S=d;norm();save();go("today")}}).catch(()=>alert("Not a valid backup file"))}

document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{if(b.dataset.t=="today"){sel=TODAY();pick=null}go(b.dataset.t)});
go("today");
// Auto-update: SW is fetched bypassing HTTP cache, checked on load + whenever the app is foregrounded; new SW activates immediately and the page reloads once.
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(r=>r.update());let _r=0;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!_r&&!G){_r=1;location.reload()}});document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")navigator.serviceWorker.getRegistration().then(r=>r&&r.update())})}
