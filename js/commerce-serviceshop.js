/* ---------------- ServiceShop — chargement dynamique depuis data/serviceshop.json ---------------- */
/* Ce fichier peut être mis à jour directement depuis Discord via la commande /shop du bot,
   ou en éditant data/serviceshop.json à la main sur GitHub. */

const FALLBACK_SERVICESHOP = [
  { icone:"🥚", nom:"Élevage IV/EV sur-mesure", description:"Un Titan vous éclot le Pokémon de vos rêves selon vos IV, nature et talent souhaités.", prix:"Dès 100$", badge:"Sur devis" },
  { icone:"✨", nom:"Reproduction Shiny", description:"Chasse ciblée pour obtenir la variante chromatique de l'espèce de votre choix.", prix:"Dès 300$", badge:"Sur devis" },
  { icone:"🎓", nom:"Coaching combat", description:"Séance avec un Titan pour progresser en stratégie de combat et team-building.", prix:"50$/h", badge:"Disponible" },
  { icone:"🚚", nom:"Transport & dépôt", description:"Faites transporter ou stocker vos Pokémon en toute sécurité à la Pension.", prix:"15$", badge:"Disponible" },
  { icone:"🏷️", nom:"Accompagnement de rang", description:"Un Titan vous guide pour gravir plus vite les échelons de la guilde.", prix:"Offert", badge:"Membres" },
  { icone:"🛌", nom:"Garde de Pokémon", description:"Confiez vos Pokémon à la Pension pendant vos absences prolongées.", prix:"10$/semaine", badge:"Disponible" },
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
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--cream);padding:40px 0;">😴 Aucun service disponible pour le moment — revenez bientôt.</p>`;
    return;
  }

  grid.innerHTML = items.map((it,i) => `
    <div class="shop-card" style="--i:${i}">
      <span class="shop-icon">${it.icone || '🛠️'}</span>
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
  loadShop('data/serviceshop.json', FALLBACK_SERVICESHOP, 'serviceGrid');
});
