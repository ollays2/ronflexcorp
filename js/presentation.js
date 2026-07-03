/* ---------------- Rangs de la guilde (Présentation) ---------------- */
const FALLBACK_GRADES = [
  { rang:"Rang I", icon:"💤", nom:"Ronfleur", couleur:"#F2E8D5", description:"Vient d'arriver, encore à moitié endormi." },
  { rang:"Rang II", icon:"🌿", nom:"Somnambule", couleur:"#5C9A5C", description:"Se déplace dans la guilde même les yeux fermés — actif, présent, fiable." },
  { rang:"Rang III", icon:"🛡️", nom:"Gardien du Territoire", couleur:"#3F7FA6", description:"Veille sur les nouveaux comme Ronflex veille sur sa clairière." },
  { rang:"Rang IV", icon:"⭐", nom:"Titan Assoupi", couleur:"#C9A66B", description:"Un pilier si imposant qu'on le croirait immobile — jusqu'à ce qu'il agisse." }
];

async function loadGrades(){
  const grades = await loadJSON('data/grades.json', FALLBACK_GRADES);
  const grid = document.getElementById('gradesGrid');
  if(!grid) return;
  grid.innerHTML = grades.map(g=>`
    <div class="grade-card" style="--grade-color:${g.couleur || 'var(--gold)'}">
      <div class="grade-rank">${g.icon ? g.icon+' ' : ''}${g.rang}</div>
      <h4>${g.nom}</h4>
      <p>${g.description}</p>
    </div>
  `).join('');
}

loadGrades();
