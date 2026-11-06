const C=[
{t:"El ministro y las 56 rebajas",s:"Texto 1",img:"img/imagen-1.jpg",fx:"blinds",
lead:"El ministro de Justicia firmó decretos que rebajaron las condenas de 56 sentenciados por abusos sexuales y violaciones contra menores. Dice que no ha pensado en renunciar.",
pairs:[["56","Condenados por delitos sexuales contra menores con pena rebajada"],["Punta Peuco","Cárcel de Til Til donde estaban al menos dos reos por delitos de la dictadura"],["Interferencia","Medio digital que dio a conocer las rebajas"],["Chevesich","Presidenta de la Corte Suprema: el ministro firmó conforme a sus facultades legales"]],
q:[["¿Qué respondió el ministro sobre su continuidad?",["“No he pensado en renunciar”","Renunciará esta semana","Esperará a la Corte Suprema"],0],["¿Qué justificación dio primero el Gobierno?",["Una supuesta “doctrina” de la Corte Suprema","Una orden del Congreso","Un decreto de la dictadura"],0]]},
{t:"Kast no cede en Rabat",s:"Texto 2",img:"img/imagen-2.jpg",fx:"iris",
lead:"El presidente asumió la responsabilidad política por las rebajas y desafió a la oposición a acusar al ministro. Las encuestas muestran un rechazo mayoritario.",
pairs:[["26%","Aprobación presidencial en Cadem (1 de noviembre), su mínimo"],["70%","En desacuerdo con que Kast mantenga al ministro (Cadem)"],["3 capas","Constitucional, personal y operativa: la arquitectura del respaldo"],["Ex-Ante","Medio según el cual el ministro se volvió una voz escuchada por el Presidente"]],
q:[["Según el texto, ¿qué protege el blindaje?",["A la persona, no su tesis jurídica","Su tesis jurídica, no a la persona","Al Congreso"],0],["¿Qué desafío lanzó el Presidente a la oposición?",["Que presente la acusación y se vote","Que pida su renuncia","Que convoque un plebiscito"],0]]},
{t:"Los decretos y la frontera norte",s:"Texto 3",img:"img/imagen-3.jpg",fx:"slice",
lead:"Al menos 13 extranjeros condenados por tráfico y detenidos en la frontera norte recibieron rebajas. Ningún decreto se opuso al beneficio.",
pairs:[["13","Extranjeros condenados por tráfico con rebaja de pena"],["115","Casos de drogas entre los 150 decretos revisados por Interferencia"],["52 kg","Pasta base de cocaína hallada en el auto de Fredy Orlas, en La Negra"],["Doctrina Rabat","El Ministerio no puede negar la rebaja por la gravedad del delito"]],
q:[["¿En cuántos de los decretos revisados se opuso el ministerio?",["En ninguno","En la mitad","Solo en delitos sexuales"],0],["¿Qué pena recibió Orlas?",["Cinco años y un día","Ocho años","Diez años"],0]]}
];
const $=s=>document.querySelector(s);
let ci=0,score=0;
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const add=n=>{score=Math.max(0,score+n);$("#pts").textContent=score};
const ph=(c,fx)=>`<div class="ph ${fx||c.fx}"><img src="${c.img}" alt="Imagen de apoyo: ${c.t}"></div>`;

// Portada: las imágenes se revelan al entrar en pantalla
$("#grid").innerHTML=C.map((c,i)=>`<button class="case pre" data-i="${i}">${ph(c)}<div class="t"><small>${c.s}</small><h3>${c.t}</h3></div></button>`).join("");
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove("pre");io.unobserve(e.target)}}),{threshold:.35});
document.querySelectorAll(".case").forEach(b=>{io.observe(b);b.onclick=()=>{ci=+b.dataset.i;score=0;add(0);$("#juego").hidden=false;intro();$("#juego").scrollIntoView()}});

$("#snd").onclick=()=>{const v=$("#v");v.muted=!v.muted;$("#snd").textContent=v.muted?"Activar sonido":"Silenciar"};

function intro(){const c=C[ci];$("#cname").textContent=`${c.s}: ${c.t}`;
$("#stage").innerHTML=`<div class="intro">${ph(c)}<div><h3>${c.t}</h3><p>${c.lead}</p><button class="btn" id="go">Repartir las cartas</button></div></div>`;
$("#go").onclick=pairs}

function pairs(){const c=C[ci];
const cards=shuffle(c.pairs.flatMap((p,i)=>[{i,x:p[0],k:"a"},{i,x:p[1],k:""}]));
$("#stage").innerHTML=`<p class="hint">Une cada dato con su significado. Acierto: +100. Error: −10.</p><div class="deck">${cards.map(d=>`<button class="card" data-i="${d.i}" aria-label="Carta"><span class="f"></span><span class="b ${d.k}">${d.x}</span></button>`).join("")}</div>`;
let open=[],lock=false,done=0;
document.querySelectorAll(".card").forEach(el=>el.onclick=()=>{
 if(lock||el.classList.contains("on"))return;
 el.classList.add("on");open.push(el);if(open.length<2)return;
 const [a,b]=open;open=[];lock=true;
 if(a.dataset.i===b.dataset.i){a.classList.add("ok");b.classList.add("ok");add(100);lock=false;if(++done===c.pairs.length)setTimeout(()=>quiz(0),900)}
 else{add(-10);setTimeout(()=>{[a,b].forEach(x=>{x.classList.remove("on");x.classList.add("bad")});setTimeout(()=>{a.classList.remove("bad");b.classList.remove("bad");lock=false},400)},800)}
})}

function quiz(n){const c=C[ci];
if(n>=c.q.length)return end();
const [q,o,r]=c.q[n];
$("#stage").innerHTML=`<p class="hint">Veredicto ${n+1} de ${c.q.length}. Acierto: +150.</p><p class="q">${q}</p><div class="opts">${shuffle(o.map((t,i)=>({t,i}))).map(x=>`<button class="opt" data-i="${x.i}">${x.t}</button>`).join("")}</div>`;
document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
 const good=+b.dataset.i===r;b.classList.add(good?"ok":"no");if(good)add(150);
 else document.querySelectorAll(".opt").forEach(x=>{if(+x.dataset.i===r)x.classList.add("ok")});
 document.querySelectorAll(".opt").forEach(x=>x.disabled=true);
 setTimeout(()=>quiz(n+1),1300)})}

function end(){const c=C[ci],last=ci===C.length-1;
const rank=score>=1700?"Juez o jueza de sala":score>=1200?"Fiscal":"Aprendiz de tribunal";
$("#stage").innerHTML=`<div class="end">${ph(c,"slice")}<h3 class="q">${last?"Veredicto final: "+rank:"Expediente cerrado"}</h3><p class="sub">${score} puntos acumulados.</p><button class="btn" id="nx">${last?"Jugar de nuevo":"Siguiente expediente"}</button></div>`;
$("#nx").onclick=()=>{if(last){ci=0;score=0;add(0)}else ci++;intro()}}
