// Hand-built SVG exercise illustrations: two-frame (start -> end) mannequin figures.
// Poses use absolute segment angles in degrees: 0 = pointing down, 90 = forward (right), 180 = up, -90 = back (left).
(function(){
const L={torso:34,neck:13,thigh:26,shin:25,foot:9,ua:18,fa:16};
const D=a=>{a*=Math.PI/180;return[Math.sin(a),Math.cos(a)]};
const add=(p,a,l)=>{const d=D(a);return[p[0]+d[0]*l,p[1]+d[1]*l]};
const BASE={t:0,nt:0,ns:0,nf:90,ft:0,fs:0,ff:90,nua:4,nfa:8,fua:-4,ffa:-2,bend:0};
function solve(o){const p=Object.assign({},BASE,o),P=[p.dx||0,0];
 const ar=p.armRel?p.t:0,J={P};J.S=add(P,180-p.t,L.torso);J.H=add(J.S,180-(p.th??p.t),L.neck);
 J.K=add(P,p.nt,L.thigh);J.A=add(J.K,p.ns,L.shin);J.T=add(J.A,p.nf,L.foot);
 J.k=add(P,p.ft,L.thigh);J.a=add(J.k,p.fs,L.shin);J.t=add(J.a,p.ff,L.foot);
 J.E=add(J.S,p.nua+ar,L.ua);J.W=add(J.E,p.nfa+ar,L.fa);J.e=add(J.S,p.fua+ar,L.ua);J.w=add(J.e,p.ffa+ar,L.fa);
 const R={H:8,S:9,P:9,K:6,k:6,A:4,a:4,T:2,t:2,W:3,w:3,E:4,e:4},gb=p.groundBy||Object.keys(R);
 let low=-1e9;gb.forEach(k=>low=Math.max(low,J[k][1]+R[k]));const lift=p.lift||0;
 for(const k in J)J[k]=[J[k][0],J[k][1]-low-lift];p.J=J;p.bellFa=p.nfa+ar;return p}
const BG="#141a26";const C={near:"#e6ebf3",far:"#7d889c",skin2:"#c3cbd8",hl:"#ff6b4a",bell:"#f5a524",bellD:"#b9770c",arrow:"#4cc2ff"};
function seg(a,b,w1,w2,col,op){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,f=v=>v.toFixed(1);
 return `<g fill="${col}"${op?` opacity="${op}"`:""}><path d="M${f(a[0]+nx*w1/2)} ${f(a[1]+ny*w1/2)}L${f(b[0]+nx*w2/2)} ${f(b[1]+ny*w2/2)}L${f(b[0]-nx*w2/2)} ${f(b[1]-ny*w2/2)}L${f(a[0]-nx*w1/2)} ${f(a[1]-ny*w1/2)}Z"/><circle cx="${f(a[0])}" cy="${f(a[1])}" r="${w1/2}" fill="${col}"/><circle cx="${f(b[0])}" cy="${f(b[1])}" r="${w2/2}" fill="${col}"/></g>`}
function torso(J,bend,col,w){const S=J.S,P=J.P,mx=(S[0]+P[0])/2,my=(S[1]+P[1])/2,dx=S[0]-P[0],dy=S[1]-P[1],l=Math.hypot(dx,dy);
 const cx=mx+(-dy/l)*bend,cy=my+(dx/l)*bend;return `<path d="M${P[0].toFixed(1)} ${P[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${S[0].toFixed(1)} ${S[1].toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`}
function leg(J,n,col){const[K,A,T]=n?["K","A","T"]:["k","a","t"];return (n?seg(J.P,J[K],15,12,BG)+seg(J[K],J[A],12,9,BG)+seg(J[A],J[T],8,6,BG):"")+seg(J.P,J[K],12,9.5,col)+seg(J[K],J[A],9.5,6.5,col)+seg(J[A],J[T],5.5,3.5,col)}
function arm(J,n,col){const[E,W]=n?["E","W"]:["e","w"];return (n?seg(J.S,J[E],11,9.5,BG)+seg(J[E],J[W],9.5,7.5,BG):"")+seg(J.S,J[E],8.5,7,col)+seg(J[E],J[W],7,5,col)+`<circle cx="${J[W][0].toFixed(1)}" cy="${J[W][1].toFixed(1)}" r="3.4" fill="${col}"/>`}
function bell(p){if(!p.bell)return"";const J=p.J,hands=p.bell==2?["W","w"]:["W"];
 return hands.map(h=>{const W=J[h],a=p.bellA??p.bellFa,b=p.bo||[0,0];
 return `<g transform="translate(${(W[0]+b[0]).toFixed(1)} ${(W[1]+b[1]).toFixed(1)}) rotate(${-a})"><path d="M-4.6 6 C-5.4 -1.5 5.4 -1.5 4.6 6" fill="none" stroke="${C.bellD}" stroke-width="2.6" stroke-linecap="round"/><circle cy="12" r="7.6" fill="${C.bell}"/><path d="M-5 17.2h10" stroke="${C.bellD}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-2.8" cy="9.5" rx="2" ry="3" fill="#fff" opacity=".35"/></g>`}).join("")}
function hl(p){const J=p.J,o=.82,h=C.hl;let s="";(p.hl||[]).forEach(k=>{const lerp=(a,b,f)=>[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
 if(k=="thigh")s+=seg(lerp(J.P,J.K,.18),lerp(J.P,J.K,.85),8,6.5,h,o);
 if(k=="calf")s+=seg(lerp(J.K,J.A,.15),lerp(J.K,J.A,.6),6.5,5,h,o);
 if(k=="glute"){const g=add(J.P,-90-p.t,4);s+=`<circle cx="${g[0].toFixed(1)}" cy="${g[1].toFixed(1)}" r="6.5" fill="${h}" opacity="${o}"/>`}
 if(k=="core")s+=seg(lerp(J.P,J.S,.15),lerp(J.P,J.S,.55),11,11,h,.7);
 if(k=="upper")s+=seg(lerp(J.P,J.S,.6),lerp(J.P,J.S,.9),12,12,h,.7);
 if(k=="ua")s+=seg(lerp(J.S,J.E,.2),lerp(J.S,J.E,.85),6,5,h,o);
 if(k=="fa")s+=seg(lerp(J.E,J.W,.15),lerp(J.E,J.W,.7),5,4,h,o);
 if(k=="neck")s+=seg(lerp(J.S,J.H,.1),lerp(J.S,J.H,.5),5.5,5.5,h,o);
 if(k=="hamb")s+=seg(lerp(J.P,J.k,.18),lerp(J.P,J.k,.85),8,6.5,h,o);
 const ring={knee:"K",ankle:"A",hip:"P",shoulder:"S",kneeF:"k",ankleF:"a"}[k];
 if(ring)s+=`<circle cx="${J[ring][0].toFixed(1)}" cy="${J[ring][1].toFixed(1)}" r="${k=="hip"||k=="shoulder"?7.5:5.5}" fill="none" stroke="${h}" stroke-width="1.8" stroke-dasharray="2.4 1.8"/>`});return s}
function head(p){const J=p.J,th=p.th??p.t,b=add(J.H,-90-th,1.6),u=add(b,180-th,1),f=add(J.H,90-th,6.6),f2=add(f,-th,1.5);
 return `<circle cx="${J.H[0].toFixed(1)}" cy="${J.H[1].toFixed(1)}" r="7.8" fill="${C.near}"/><circle cx="${u[0].toFixed(1)}" cy="${u[1].toFixed(1)}" r="6.6" fill="#8e99ad"/><circle cx="${add(J.H,90-th,1.2)[0].toFixed(1)}" cy="${add(J.H,90-th,1.2)[1].toFixed(1)}" r="6.6" fill="${C.near}"/><circle cx="${f2[0].toFixed(1)}" cy="${f2[1].toFixed(1)}" r="1.6" fill="${C.near}"/>`}
function body(p,ghost){const J=p.J;if(ghost){const g="#5a6680";return `<g opacity=".28">${leg(J,0,g)}${arm(J,0,g)}${torso(J,p.bend,g,17)}${seg(J.S,J.H,6,6,g)}<circle cx="${J.H[0].toFixed(1)}" cy="${J.H[1].toFixed(1)}" r="7.5" fill="${g}"/>${leg(J,1,g)}${arm(J,1,g)}</g>`}
 return leg(J,0,C.far)+arm(J,0,C.far)+(p.bell==2?bell(Object.assign({},p,{bell:1,J:Object.assign({},J,{W:J.w})})):"")+
 torso(J,p.bend,C.skin2,17.5)+torso(J,p.bend,C.near,13)+seg(J.S,J.H,6,6,C.skin2)+head(p)+
 leg(J,1,C.near)+hl(p)+arm(J,1,C.near)+(p.bell?bell(Object.assign({},p,{bell:1})):"")}
function arrow(a,b,c){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);if(l<3)return"";
 const k=(c??.3)*l,cx=mx-dy/l*k,cy=my+dx/l*k,ex=b[0]-(b[0]-cx)/Math.hypot(b[0]-cx,b[1]-cy)*4,ey=b[1]-(b[1]-cy)/Math.hypot(b[0]-cx,b[1]-cy)*4;
 return `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${C.arrow}" stroke-width="2.2" stroke-linecap="round" marker-end="url(#ah)"/>`}
const F={
 neck:[{th:-35},{th:50,hl:["neck"]},{arr:[["H",.5]],front:0}],
 ankle:[{nt:85,ns:0,ft:-10,fs:-92,ff:-95,nua:30,nfa:70},{dx:6,nt:100,ns:-28,ft:-30,fs:-92,ff:-95,nua:40,nfa:80,hl:["ankle","calf","knee"]},{arr:[["K",.4]]}],
 hinge:[{nua:35,nfa:160,fua:30,ffa:155,armRel:1},{t:78,nt:18,ns:-3,ft:18,fs:-3,nua:35,nfa:160,fua:30,ffa:155,armRel:1,hl:["thigh","glute"]},{arr:[["H",-.35]]}],
 cossack:[{nt:-28,ns:-28,ft:28,fs:28,nf:-70,ff:70,nua:25,nfa:150,fua:-25,ffa:-150},{t:-12,nt:-80,ns:-8,ft:55,fs:55,nf:-70,ff:70,nua:15,nfa:130,fua:-5,ffa:120,hl:["hip","knee","hamb"]},{arr:[["P",-.3]],front:1}],
 catcow:[{t:88,bend:-6,th:55,nt:2,ns:-90,ft:-2,fs:-90,nf:-170,ff:-170,nua:0,nfa:0,fua:2,ffa:2},{t:88,bend:9,th:160,nt:2,ns:-90,ft:-2,fs:-90,nf:-170,ff:-170,nua:0,nfa:0,fua:2,ffa:2,hl:["core","upper"]},{arr:[["S",.5]]}],
 halo:[{nua:25,nfa:165,fua:20,ffa:160,bell:1,bellA:180,bo:[2,-2]},{nua:195,nfa:250,fua:200,ffa:255,bell:1,bellA:200,bo:[-2,0],hl:["shoulder","core"]},{arr:[["W",-.6]]}],
 squat:[{nua:30,nfa:165,fua:25,ffa:160,bell:1,bellA:0,bo:[3,-14]},{t:32,nt:88,ns:-32,ft:84,fs:-30,nua:30,nfa:165,fua:25,ffa:160,armRel:1,bell:1,bellA:0,bo:[3,-14],hl:["thigh","glute","knee"]},{arr:[["P",.3]]}],
 sldl:[{ft:-6,fs:-12,nua:0,nfa:0,bell:1},{t:84,nt:12,ns:2,ft:-96,fs:-96,ff:-6,nua:0,nfa:0,fua:2,ffa:2,bell:1,hl:["thigh","glute","ankle"],groundBy:["A","T"]},{arr:[["H",-.3]]}],
 pushup:[{t:79,nt:-79,ns:-79,ft:-80,fs:-80,nf:0,ff:0,nua:0,nfa:0,fua:2,ffa:2},{t:86,nt:-86,ns:-86,ft:-87,fs:-87,nf:5,ff:5,nua:-102,nfa:-4,fua:-102,ffa:-4,hl:["upper","ua"]},{arr:[["S",.2]]}],
 carry:[{nt:22,ns:6,ft:-18,fs:-28,nua:0,nfa:0,fua:14,ffa:6,bell:1},{dx:18,nt:-18,ns:-28,ft:22,fs:6,nua:0,nfa:0,fua:-14,ffa:-6,bell:1,hl:["core","fa"]},{arr:[["P",0]]}],
 swing:[{t:65,nt:22,ns:-6,ft:18,fs:-6,nua:-20,nfa:-28,fua:-18,ffa:-26,bell:1},{nua:88,nfa:90,fua:86,ffa:88,bell:1,hl:["glute","thigh","core"]},{arr:[["W",-.5]]}],
 bound:[{nt:28,ns:-8,ft:-30,fs:-75,nua:-30,nfa:-10,fua:35,ffa:60},{dx:46,t:-8,nt:30,ns:20,ft:-28,fs:-10,nua:-50,nfa:-30,fua:40,ffa:40,hl:["knee","ankle"],groundBy:["A","T"]},{arr:[["P",.6]],front:1}],
 bear:[{t:90,nt:0,ns:-62,ft:4,fs:-60,nf:0,ff:0,nua:0,nfa:0,fua:4,ffa:4},{dx:10,t:90,nt:0,ns:-62,ft:30,fs:-55,nf:0,ff:0,nua:22,nfa:8,fua:0,ffa:0,hl:["core","shoulder"]},{arr:[["W",.4]]}],
 deadbug:[{t:270,th:270,nt:180,ns:90,ft:178,fs:92,nf:180,ff:180,nua:180,nfa:180,fua:178,ffa:178},{t:270,th:270,nt:96,ns:96,nf:90,ft:178,fs:92,ff:180,nua:180,nfa:180,fua:-95,ffa:-95,hl:["core"]},{arr:[["A",-.3]]}],
 row:[{t:72,nt:-12,ns:-8,ft:42,fs:-6,nua:0,nfa:0,fua:40,ffa:10,bell:1},{t:72,nt:-12,ns:-8,ft:42,fs:-6,nua:-105,nfa:-5,fua:40,ffa:10,bell:1,hl:["upper","ua"]},{arr:[["W",-.3]]}],
 split:[{nt:24,ns:-4,ft:-22,fs:-30,ff:-10,nua:2,nfa:2,fua:2,ffa:2,bell:2},{nt:86,ns:-10,ft:-6,fs:-95,ff:-10,nua:2,nfa:2,fua:2,ffa:2,bell:2,hl:["thigh","glute","knee"]},{arr:[["P",.15]]}],
 press:[{nua:14,nfa:168,bell:1,bellA:-135,bo:[2,3]},{nua:178,nfa:180,bell:1,bellA:192,bo:[0,1],hl:["shoulder","ua","core"]},{arr:[["W",-.15]]}],
 hollow:[{t:270,th:270,nt:90,ns:90,nf:180,ft:90,fs:90,ff:180,nua:90,nfa:90,fua:90,ffa:90},{t:258,th:250,nt:78,ns:78,nf:170,ft:78,fs:78,ff:170,nua:-100,nfa:-100,fua:-100,ffa:-100,hl:["core"]},{arr:[["T",-.3],["W",.3]]}],
 deepsq:[{},{t:22,nt:108,ns:-38,ft:104,fs:-36,nua:70,nfa:80,fua:65,ffa:78,armRel:0,hl:["hip","knee","ankle"]},{arr:[["P",.3]]}],
 calf:[{nua:30,nfa:60},{nf:28,ff:28,groundBy:["T","t"],nua:30,nfa:60,hl:["calf","ankle"]},{arr:[["H",0]]}],
 chintuck:[{th:18},{th:-6,hl:["neck"]},{arr:[["H",0]]}]
};
function figureSVG(k,mode){const f=F[k];if(!f)return"";const a=solve(f[0]),b=solve(f[1]),m=f[2]||{};
 let x0=1e9,x1=-1e9,y0=0;[a,b].forEach(p=>{for(const j in p.J){x0=Math.min(x0,p.J[j][0]-9);x1=Math.max(x1,p.J[j][0]+9);y0=Math.min(y0,p.J[j][1]-9)}});
 [a,b].forEach(p=>{if(p.bell){const W=p.J.W;x0=Math.min(x0,W[0]-16);x1=Math.max(x1,W[0]+16);y0=Math.min(y0,W[1]-22)}});
 const s=Math.min(1,104/(x1-x0),92/-y0),tx=60-s*(x0+x1)/2,ty=110;
 const tr=`translate(${tx.toFixed(1)} ${ty}) scale(${s.toFixed(3)})`;
 const floor=`<path d="M8 110.5H112" stroke="#2c3446" stroke-width="1.5" stroke-linecap="round"/>`+(m.step?`<rect x="${(tx+s*(a.J.T[0]-5)).toFixed(1)}" y="${(110-8*s).toFixed(1)}" width="44" height="${(8*s).toFixed(1)}" rx="2" fill="#3a4559"/>`:"");
 const panel=(inner,lab)=>`<rect x="1" y="1" width="118" height="122" rx="12" fill="#141a26"/>${floor}<g transform="${tr}">${inner}</g>${lab?`<text x="10" y="16" class="fl">${lab}</text>`:""}`;
 const arrows=(m.arr||[]).map(([j,c])=>arrow(a.J[j],b.J[j],c)).join("");
 const defs=`<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="${(4/s).toFixed(1)}" markerHeight="${(4/s).toFixed(1)}" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 1L9 5L0 9z" fill="${C.arrow}"/></marker></defs>`;
 if(mode=="thumb")return `<svg viewBox="10 14 100 100" class="fig thumb" aria-hidden="true">${defs}${panel(body(b))}</svg>`;
 return `<svg viewBox="0 0 244 124" class="fig two" role="img" aria-label="Start and end positions">${defs}<style>.fl{font:600 8px -apple-system,system-ui,sans-serif;fill:#8b95a8;letter-spacing:.08em}</style>
<g>${panel(body(a),"START")}</g><g transform="translate(124 0)">${panel(body(a,1)+body(b)+arrows,"END")}</g></svg>`}
window.figureSVG=figureSVG;window.FIG_KEYS=Object.keys(F);
})();
