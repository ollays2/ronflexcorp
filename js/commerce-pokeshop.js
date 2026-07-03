/* ---------------- PokeShop (catalogue Pension Pokémon) ---------------- */
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
    const tc = seededRand(i*67+17) > 0.75;
    return {
      id:i, name, types:[t1,t2].filter(Boolean), level, sex,
      nature: NATURES[Math.floor(seededRand(i*53+14)*NATURES.length)],
      talent: ["Ténacité","Peau Dure","Régénération","Cœur de Fer","Insomnia","Absorption"][Math.floor(seededRand(i*59+15)*6)],
      tc, sprite: null,
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
          ${m.sprite ? `<img class="mon-sprite" src="${m.sprite}" alt="${m.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
          <div class="mon-fallback-icon" style="${m.sprite ? 'display:none;' : 'display:flex;'}">${monSvg(m)}</div>
          ${m.legendary?'<span class="mon-legendary-badge">★ Légendaire</span>':''}
          <span class="mon-avail ${m.avail==='Réservé'?'reserved':m.avail==='Vendu'?'sold':''}">${m.avail}</span>
        </div>
        <div class="mon-body">
          <div class="mon-top"><h4>${m.name}</h4><span class="lvl">Nv. ${m.level} ${m.sex}</span></div>
          <div class="mon-types">${m.types.map(t=>`<span class="type-pill" style="background:${TYPE_COLORS[t]}">${t}</span>`).join('')}</div>
          <div class="mon-stats">
            <div>Nature <b>${m.nature}</b></div>
            <div>Talent <b>${m.talent}</b>${m.tc?' <span class="tc-tag">TC</span>':''}</div>
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
  const clamp = (p) => Math.min(Math.max(p,1), totalPages);
  const jumps = [
    { label: '&laquo;&laquo;&laquo; -10', target: clamp(state.page-10), disabled: state.page<=1 },
    { label: '&laquo; -1', target: clamp(state.page-1), disabled: state.page<=1 },
    { label: `Page ${state.page} / ${totalPages}`, target: state.page, current: true },
    { label: '+1 &raquo;', target: clamp(state.page+1), disabled: state.page>=totalPages },
    { label: '+10 &raquo;&raquo;&raquo;', target: clamp(state.page+10), disabled: state.page>=totalPages },
  ];
  pag.innerHTML = jumps.map(j =>
    j.current
      ? `<span class="page-current">${j.label}</span>`
      : `<button class="page-btn page-jump" data-page="${j.target}" ${j.disabled?'disabled':''}>${j.label}</button>`
  ).join('');
  pag.querySelectorAll('.page-btn').forEach(b=>b.addEventListener('click', ()=>{
    state.page = parseInt(b.dataset.page,10);
    renderCatalog();
    document.getElementById('pokeshop').scrollIntoView({behavior:'smooth', block:'start'});
  }));
}

document.getElementById('searchInput').addEventListener('input', (e)=>{ state.search=e.target.value; state.page=1; renderCatalog(); });
document.getElementById('sortSelect').addEventListener('change', (e)=>{ state.sort=e.target.value; renderCatalog(); });
document.getElementById('availSelect').addEventListener('change', (e)=>{ state.avail=e.target.value; state.page=1; renderCatalog(); });

loadCatalog();
