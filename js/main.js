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
const statEls = document.querySelectorAll('.stat b');
const statIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animateCount(e.target);
      statIO.unobserve(e.target);
    }
  });
},{threshold:0.4});
statEls.forEach(el=>statIO.observe(el));
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
document.getElementById('recruitForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  document.getElementById('recruitFormBody').style.display='none';
  document.getElementById('recruitSuccess').classList.add('show');
});
document.getElementById('contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.textContent = 'Message envoyé ✓';
  btn.style.background = '#3F7FA6';
  e.target.reset();
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
