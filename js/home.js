/* ---------------- Statistiques animées (Accueil) ---------------- */
const FALLBACK_STATS = [
  { label:"Membres", value:6 },
  { label:"Pokémon dispo.", value:0 },
  { label:"Pokémon vendus", value:0 },
  { label:"Transactions", value:0 },
  { label:"Niveau moyen", value:0 }
];

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

async function loadStats(){
  const stats = await loadJSON('data/stats.json', FALLBACK_STATS);
  const grid = document.getElementById('statsGrid');
  if(!grid) return;
  grid.innerHTML = stats.map((s,i)=>`
    <div class="stat" style="--i:${i}">
      <b data-count="${s.value}">0</b>
      <span>${s.label}</span>
    </div>
  `).join('');
  grid.querySelectorAll('.stat b').forEach(el=>statIO.observe(el));
}

loadStats();
