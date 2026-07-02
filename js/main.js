/* ---------------- Configuration Discord ---------------- */
/* Crée un webhook dans Discord : Paramètres du serveur → Intégrations → Webhooks → Nouveau
   webhook → choisis le salon (ex. #recrutement, #contact) → Copier l'URL du webhook.
   Colle chaque URL ci-dessous. Tu peux utiliser le même salon/webhook pour les deux
   si tu préfères tout centraliser au même endroit. */
const DISCORD_WEBHOOKS = {
  recruitment: "COLLE_ICI_TON_URL_WEBHOOK_RECRUTEMENT",
  contact: "COLLE_ICI_TON_URL_WEBHOOK_CONTACT"
};

function isWebhookConfigured(url){
  return typeof url === 'string' && url.startsWith('https://discord.com/api/webhooks/');
}

async function sendToDiscord(webhookUrl, embed){
  if(!isWebhookConfigured(webhookUrl)){
    throw new Error('webhook-not-configured');
  }
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  });
  if(!res.ok) throw new Error('discord-error-' + res.status);
}

/* ---------------- Loader ---------------- */
window.addEventListener('load', ()=>{
  setTimeout(()=> document.getElementById('loader').classList.add('hidden'), 500);
});

/* ---------------- Nav scroll state ---------------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
document.getElementById('burger').addEventListener('click', ()=>{
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.cssText += 'position:fixed;top:74px;left:20px;right:20px;background:#FBF8F2;flex-direction:column;padding:18px;border-radius:20px;box-shadow:0 20px 40px -20px rgba(0,0,0,.3);z-index:200;';
});

/* ---------------- Scroll reveal ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* stagger index for gallery children */
document.querySelectorAll('.reveal-stagger').forEach(parent=>{
  [...parent.children].forEach((c,i)=> c.style.setProperty('--i', i));
});

/* ---------------- Stat counters ---------------- */
const statIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animateCount(e.target);
      statIO.unobserve(e.target);
    }
  });
},{threshold:0.4});
function animateCount(el){
  const target = parseInt(el.dataset.count,10);
  const dur = 1600; const start = performance.now();
  function step(now){
    const p = Math.min((now-start)/dur,1);
    const eased = 1 - Math.pow(1-p,3);
    el.textContent = Math.floor(eased*target).toLocaleString('fr-FR');
    if(p<1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('fr-FR');
  }
  requestAnimationFrame(step);
}

/* ---------------- Contenu dynamique depuis /data (JSON) ---------------- */
/* Chaque fonction charge son fichier JSON ; si le fichier est absent ou mal formé,
   une valeur de secours (identique au contenu par défaut du site) prend le relais
   pour que le site ne casse jamais. */
async function loadJSON(path, fallback){
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('not ok');
    return await res.json();
  }catch(err){
    console.warn(`${path} introuvable ou invalide, utilisation des données par défaut.`);
    return fallback;
  }
}

const FALLBACK_STATS = [
  { label:"Membres", value:6 },
  { label:"Pokémon dispo.", value:0 },
  { label:"Pokémon vendus", value:0 },
  { label:"Transactions", value:0 },
  { label:"Niveau moyen", value:0 }
];
const FALLBACK_GRADES = [
  { rang:"Rang I", nom:"Ronfleur", description:"Nouveau dresseur accueilli dans la guilde et sa pension." },
  { rang:"Rang II", nom:"Gardien", description:"Membre actif, contribue aux échanges et à l'entraide." },
  { rang:"Rang III", nom:"Sentinelle", description:"Encadre les nouveaux et veille sur le territoire." },
  { rang:"Rang IV", nom:"Titan", description:"Pilier de la guilde, référence en élevage et combat." }
];
const FALLBACK_TEAM = [
  { initiales:"RO", nom:"Ronflex_On_Top", role:"Fondateur" },
  { initiales:"IM", nom:"ImMat_", role:"Co-fondateur" },
  { initiales:"SR", nom:"Suzu_Rcorps", role:"Gérant de la Pension" }
];

async function loadStats(){
  const stats = await loadJSON('data/stats.json', FALLBACK_STATS);
  const grid = document.getElementById('statsGrid');
  grid.innerHTML = stats.map((s,i)=>`
    <div class="stat" style="--i:${i}">
      <b data-count="${s.value}">0</b>
      <span>${s.label}</span>
    </div>
  `).join('');
  grid.querySelectorAll('.stat b').forEach(el=>statIO.observe(el));
}

async function loadGrades(){
  const grades = await loadJSON('data/grades.json', FALLBACK_GRADES);
  const grid = document.getElementById('gradesGrid');
  grid.innerHTML = grades.map(g=>`
    <div class="grade-card">
      <div class="grade-rank">${g.rang}</div>
      <h4>${g.nom}</h4>
      <p>${g.description}</p>
    </div>
  `).join('');
}

async function loadTeam(){
  const team = await loadJSON('data/team.json', FALLBACK_TEAM);
  const list = document.getElementById('teamList');
  list.innerHTML = team.map(m=>`
    <div class="responsable">
      <div class="resp-avatar">${m.initiales}</div>
      <span>${m.nom}<br><small>${m.role}</small></span>
    </div>
  `).join('');
}

loadStats();
loadGrades();
loadTeam();

/* ---------------- Hero particles (feuilles / poussières) ---------------- */
const particleWrap = document.getElementById('particles');
const glyphs = ['✦','·','❉','z'];
for(let i=0;i<22;i++){
  const p = document.createElement('span');
  p.className='particle';
  p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
  p.style.left = Math.random()*100+'%';
  p.style.bottom = '-5%';
  p.style.fontSize = (10+Math.random()*16)+'px';
  p.style.animationDuration = (10+Math.random()*14)+'s';
  p.style.animationDelay = (Math.random()*14)+'s';
  particleWrap.appendChild(p);
}

/* ---------------- Recruitment form ---------------- */
document.getElementById('recruitForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.submit-btn');
  const data = new FormData(form);
  const val = (k)=> (data.get(k) || '—').toString().trim() || '—';
  const originalLabel = btn.innerHTML;
  btn.innerHTML = 'Envoi en cours…';
  btn.disabled = true;

  try{
    await sendToDiscord(DISCORD_WEBHOOKS.recruitment, {
      title: '🛡️ Nouvelle candidature — RonflexCorp',
      color: 4093862,
      fields: [
        { name: 'Pseudo Minecraft', value: val('pseudo_minecraft'), inline: true },
        { name: 'Pseudo Discord', value: val('pseudo_discord'), inline: true },
        { name: 'Âge', value: val('age'), inline: true },
        { name: 'Temps de jeu / semaine', value: val('temps_jeu'), inline: true },
        { name: 'Expérience Cobblemon', value: val('experience'), inline: true },
        { name: 'Motivations', value: val('motivations'), inline: false }
      ],
      timestamp: new Date().toISOString()
    });
    document.getElementById('recruitFormBody').style.display='none';
    document.getElementById('recruitSuccess').classList.add('show');
  }catch(err){
    btn.innerHTML = originalLabel;
    btn.disabled = false;
    if(err.message === 'webhook-not-configured'){
      alert("Le webhook Discord du recrutement n'est pas encore configuré.\nOuvre js/main.js et renseigne DISCORD_WEBHOOKS.recruitment (voir le README).");
    }else{
      alert("L'envoi a échoué. Vérifie ta connexion et réessaie, ou contacte-nous directement sur Discord.");
    }
  }
});

document.getElementById('contactForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.submit-btn');
  const data = new FormData(form);
  const val = (k)=> (data.get(k) || '—').toString().trim() || '—';
  const originalLabel = btn.innerHTML;
  btn.innerHTML = 'Envoi en cours…';
  btn.disabled = true;

  try{
    await sendToDiscord(DISCORD_WEBHOOKS.contact, {
      title: '📞 Nouveau message — Formulaire de contact',
      color: 4093862,
      fields: [
        { name: 'Nom', value: val('nom'), inline: true },
        { name: 'Email / Discord', value: val('contact'), inline: true },
        { name: 'Message', value: val('message'), inline: false }
      ],
      timestamp: new Date().toISOString()
    });
    btn.innerHTML = 'Message envoyé ✓';
    btn.style.background = '#3F7FA6';
    form.reset();
    setTimeout(()=>{ btn.innerHTML = originalLabel; btn.style.background=''; btn.disabled=false; }, 3000);
  }catch(err){
    btn.innerHTML = originalLabel;
    btn.disabled = false;
    if(err.message === 'webhook-not-configured'){
      alert("Le webhook Discord du contact n'est pas encore configuré.\nOuvre js/main.js et renseigne DISCORD_WEBHOOKS.contact (voir le README).");
    }else{
      alert("L'envoi a échoué. Vérifie ta connexion et réessaie, ou contacte-nous directement sur Discord.");
    }
  }
});

/* ---------------- Pension Pokémon catalog ---------------- */
/* Charge le catalogue depuis data/pokemon.json (votre backend/API pourra remplacer ce fichier
   ou cette fonction par un vrai fetch() vers votre serveur). Si le fichier est introuvable
   (ex. ouverture du site en double-clic, sans serveur local), une génération de démonstration
   prend le relais automatiquement. */
const TYPE_COLORS = {
  "Normal":"#9A9A82","Feu":"#E08A3C","Eau":"#3F7FA6","Plante":"#5C9A5C","Électrik":"#D9B33C",
  "Glace":"#7FC4C4","Combat":"#B5473A","Poison":"#8B5FA0","Sol":"#B79256","Vol":"#8FA8D9",
  "Psy":"#C9679A","Insecte":"#8FA53C","Roche":"#A79461","Spectre":"#5C5A82","Dragon":"#5C6FD9",
  "Ténèbres":"#4A4640","Acier":"#8C97A6","Fée":"#D98FB3"
};

function seededRand(seed){ let x=Math.sin(seed)*10000; return x-Math.floor(x); }

function generateDemoData(){
  const NATURES = ["Calme","Modeste","Audacieux","Rigide","Prudent","Naïf","Jovial","Adamant","Timide","Doux"];
  const NAMES = ["Torvégo","Braisillon","Cindracorne","Marégoule","Sylvenoix","Fongivert","Zaptille","Glaçonelle","Igloudon","Grondeur",
  "Venenox","Sablior","Draconelle","Aéropic","Mysterine","Insectra","Roclide","Ombraline","Ferrolyn","Charmelune",
  "Tortoceane","Flamivore","Terraclisse","Ombrelys","Voltacite","Nivorage","Grifflame","Aquaflor","Toximouth","Duskram"];
  const types = Object.keys(TYPE_COLORS);
  return NAMES.map((name,i)=>{
    const t1 = types[Math.floor(seededRand(i*7+1)*types.length)];
    let t2 = null;
    if(seededRand(i*3+2) > 0.55){ t2 = types[Math.floor(seededRand(i*11+3)*types.length)]; if(t2===t1) t2=null; }
    const level = 5 + Math.floor(seededRand(i*13+4)*95);
    const ivStats = [0,1,2,3,4,5].map(k => Math.floor(seededRand(i*61+16+k*3)*32));
    const ivDisplay = ivStats.join('/');
    const ivSum = ivStats.reduce((a,b)=>a+b,0);
    const shiny = seededRand(i*19+6) > 0.86;
    const legendary = seededRand(i*23+7) > 0.9;
    const price = legendary ? 800+Math.floor(seededRand(i*29+8)*1200) : (shiny? 250+Math.floor(seededRand(i*31+9)*400) : 20+Math.floor(seededRand(i*37+10)*180));
    const avail = ["Disponible","Disponible","Disponible","Réservé","Vendu"][Math.floor(seededRand(i*41+11)*5)];
    const sex = seededRand(i*43+12) > 0.5 ? "♂" : (seededRand(i*47+13) > 0.15 ? "♀" : "—");
    return {
      id:i, name, types:[t1,t2].filter(Boolean), level, sex,
      nature: NATURES[Math.floor(seededRand(i*53+14)*NATURES.length)],
      talent: ["Ténacité","Peau Dure","Régénération","Cœur de Fer","Insomnia","Absorption"][Math.floor(seededRand(i*59+15)*6)],
      iv: ivSum, ivDisplay, ev: "252/252/4", shiny, legendary, price, avail, sex
    };
  });
}

let MONS = [];
let state = { search:"", sort:"recent", avail:"all", types:new Set(), page:1 };
const PER_PAGE = 6;

async function loadCatalog(){
  try{
    const res = await fetch('data/pokemon.json');
    if(!res.ok) throw new Error('pokemon.json indisponible');
    MONS = await res.json();
  }catch(err){
    MONS = generateDemoData();
  }
  renderChips();
  renderCatalog();
}

function monSvg(mon){
  const c = TYPE_COLORS[mon.types[0]];
  const c2 = mon.shiny ? "#C9A66B" : "#F2E8D5";
  return `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="78" rx="34" ry="8" fill="#00000022"/>
  <path d="M14 55C14 28 30 12 50 12C70 12 86 28 86 55C86 70 70 78 50 78C30 78 14 70 14 55Z" fill="${c}"/>
  <path d="M14 55C14 70 30 78 50 78C70 78 86 70 86 55C86 62 68 68 50 68C32 68 14 62 14 55Z" fill="${c2}"/>
  <circle cx="40" cy="46" r="2.6" fill="#233039"/><circle cx="60" cy="46" r="2.6" fill="#233039"/>
  <path d="M40 58Q50 64 60 58" stroke="#233039" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
}

function renderChips(){
  const wrap = document.getElementById('typeChips');
  const allTypes = Object.keys(TYPE_COLORS);
  wrap.innerHTML = `<button class="chip ${state.types.size===0?'active':''}" data-type="__all">Tous les types</button>` +
    allTypes.map(t=>`<button class="chip ${state.types.has(t)?'active':''}" data-type="${t}">${t}</button>`).join('');
  wrap.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const t = chip.dataset.type;
      if(t==='__all'){ state.types.clear(); }
      else{
        state.types.has(t) ? state.types.delete(t) : state.types.add(t);
      }
      state.page = 1;
      renderChips(); renderCatalog();
    });
  });
}

function getFiltered(){
  let list = MONS.filter(m=>{
    if(state.search && !m.name.toLowerCase().includes(state.search.toLowerCase())) return false;
    if(state.avail!=='all' && m.avail !== state.avail) return false;
    if(state.types.size>0 && !m.types.some(t=>state.types.has(t))) return false;
    return true;
  });
  switch(state.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'level-desc': list.sort((a,b)=>b.level-a.level); break;
    case 'iv-desc': list.sort((a,b)=>b.iv-a.iv); break;
    default: list.sort((a,b)=>b.id-a.id);
  }
  return list;
}

function renderCatalog(){
  const list = getFiltered();
  const grid = document.getElementById('catalogGrid');
  const empty = document.getElementById('emptyState');
  const totalPages = Math.max(1, Math.ceil(list.length/PER_PAGE));
  state.page = Math.min(state.page, totalPages);
  const pageItems = list.slice((state.page-1)*PER_PAGE, state.page*PER_PAGE);

  if(pageItems.length===0){ grid.innerHTML=''; empty.classList.add('show'); }
  else{
    empty.classList.remove('show');
    grid.innerHTML = pageItems.map(m=>`
      <div class="mon-card ${m.legendary?'legendary':''} ${m.shiny?'shiny':''}">
        <div class="mon-media">
          ${monSvg(m)}
          ${m.legendary?'<span class="mon-legendary-badge">★ Légendaire</span>':''}
          <span class="mon-avail ${m.avail==='Réservé'?'reserved':m.avail==='Vendu'?'sold':''}">${m.avail}</span>
        </div>
        <div class="mon-body">
          <div class="mon-top"><h4>${m.name}</h4><span class="lvl">Nv. ${m.level} ${m.sex}</span></div>
          <div class="mon-types">${m.types.map(t=>`<span class="type-pill" style="background:${TYPE_COLORS[t]}">${t}</span>`).join('')}</div>
          <div class="mon-stats">
            <div>Nature <b>${m.nature}</b></div>
            <div>Talent <b>${m.talent}</b></div>
            <div class="iv-row" style="grid-column:1/-1;">IV (PV/Att/Déf/AtSp/DéfSp/Vit) <b>${m.ivDisplay}</b></div>
            <div>EV <b>${m.ev}</b></div>
          </div>
          <div class="mon-footer">
            <div class="mon-price">${m.price}$</div>
            <button class="mon-cta">Voir la fiche</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  const pag = document.getElementById('pagination');
  pag.innerHTML = Array.from({length:totalPages}).map((_,i)=>
    `<button class="page-btn ${state.page===i+1?'active':''}" data-page="${i+1}">${i+1}</button>`
  ).join('');
  pag.querySelectorAll('.page-btn').forEach(b=>b.addEventListener('click', ()=>{
    state.page = parseInt(b.dataset.page,10);
    renderCatalog();
    document.getElementById('pension').scrollIntoView({behavior:'smooth', block:'start'});
  }));
}

document.getElementById('searchInput').addEventListener('input', (e)=>{ state.search=e.target.value; state.page=1; renderCatalog(); });
document.getElementById('sortSelect').addEventListener('change', (e)=>{ state.sort=e.target.value; renderCatalog(); });
document.getElementById('availSelect').addEventListener('change', (e)=>{ state.avail=e.target.value; state.page=1; renderCatalog(); });

loadCatalog();
