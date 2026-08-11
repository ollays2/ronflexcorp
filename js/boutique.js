/* ---------------- Grades de la boutique ---------------- */
const FALLBACK_TIERS = [
  { nom:"Bronze", icon:"🥉", couleur:"#C9A66B", prix:"4,99 €", periode:"à vie", avantages:["Préfixe coloré dans le chat","+2 emplacements de claim","Accès au salon Discord VIP"] },
  { nom:"Argent", icon:"🥈", couleur:"#8FA6B0", prix:"9,99 €", periode:"à vie", avantages:["Tous les avantages Bronze","+5 emplacements de claim","1 slot d'élevage supplémentaire"] },
  { nom:"Or", icon:"🥇", couleur:"#C9A66B", prix:"19,99 €", periode:"à vie", featured:true, avantages:["Tous les avantages Argent","+10 emplacements de claim","Accès prioritaire au serveur"] },
  { nom:"Légendaire", icon:"⭐", couleur:"#3F7FA6", prix:"34,99 €", periode:"à vie", avantages:["Tous les avantages Or","Emplacements de claim illimités","Rôle Discord exclusif"] }
];

async function loadTiers(){
  const tiers = await loadJSON('data/boutique.json', FALLBACK_TIERS);
  const grid = document.getElementById('tierGrid');
  if(!grid) return;
  grid.innerHTML = tiers.map((t,i)=>`
    <div class="tier-card${t.featured ? ' featured' : ''}" style="--tier-color:${t.couleur || 'var(--gold)'};--i:${i}">
      <div class="tier-badge">${t.icon || '🏅'}</div>
      <h4>Rang ${t.nom}</h4>
      <div class="tier-price">${t.prix}</div>
      <span class="tier-period">${t.periode || 'à vie'}</span>
      <ul class="tier-features">
        ${(t.avantages || []).map(a=>`<li>${a}</li>`).join('')}
      </ul>
      <a href="https://discord.gg/UPFU88eyMu" target="_blank" rel="noopener" class="btn tier-cta">Obtenir le rang</a>
    </div>
  `).join('');
}

loadTiers();
