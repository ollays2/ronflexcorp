/* ---------------- ItemShop — chargement dynamique depuis data/itemshop.json ---------------- */
/* Ce fichier peut être mis à jour directement depuis Discord via la commande /shop du bot,
   ou en éditant data/itemshop.json à la main sur GitHub. */

const FALLBACK_ITEMSHOP = [
  { icone:"🍯", nom:"Super Bonbon", description:"Fait gagner un niveau instantanément à un Pokémon de votre équipe.", prix:"45$", badge:"Disponible" },
  { icone:"🌙", nom:"Pierre Lune", description:"Nécessaire à l'évolution de plusieurs espèces sensibles à la lune.", prix:"60$", badge:"Disponible" },
  { icone:"🎾", nom:"Lot de Poké Balls", description:"10 Poké Balls standards, idéales pour agrandir votre équipe.", prix:"30$", badge:"Disponible" },
  { icone:"🍇", nom:"Assortiment de Baies", description:"Baies de soin et de statut pour préparer vos combats et échanges.", prix:"20$", badge:"Disponible" },
  { icone:"💊", nom:"Vitamines (PV/Att/Déf...)", description:"Boostent les EV d'une statistique au choix pour l'élevage compétitif.", prix:"25$", badge:"Disponible" },
  { icone:"🧿", nom:"Charme Chroma", description:"Améliore vos chances de croiser un Pokémon chromatique.", prix:"Sur demande", badge:"Réservé Titans" },
];

async function loadShop(path, fallback, gridId){
  let items;
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('not ok');
    items = await res.json();
  }catch(err){
    console.warn(`${path} introuvable ou invalide, utilisation des données par défaut.`);
    items = fallback;
  }

  const grid = document.getElementById(gridId);
  if(!grid) return;

  if(items.length === 0){
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:40px 0;">😴 Boutique vide pour le moment — revenez bientôt.</p>`;
    return;
  }

  grid.innerHTML = items.map((it,i) => `
    <div class="shop-card" style="--i:${i}">
      <span class="shop-icon">${it.icone || '🛒'}</span>
      <h4>${it.nom}</h4>
      <p>${it.description || ''}</p>
      <div class="shop-footer">
        <span class="shop-price">${it.prix}</span>
        <span class="shop-badge">${it.badge || 'Disponible'}</span>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadShop('data/itemshop.json', FALLBACK_ITEMSHOP, 'itemGrid');
});
