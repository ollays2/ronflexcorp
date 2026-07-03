/* ---------------- Rangs de la guilde (Présentation) ---------------- */
const FALLBACK_GRADES = [
  { rang:"Rang I", nom:"Ronfleur", description:"Nouveau dresseur accueilli dans la guilde et sa pension." },
  { rang:"Rang II", nom:"Gardien", description:"Membre actif, contribue aux échanges et à l'entraide." },
  { rang:"Rang III", nom:"Sentinelle", description:"Encadre les nouveaux et veille sur le territoire." },
  { rang:"Rang IV", nom:"Titan", description:"Pilier de la guilde, référence en élevage et combat." }
];

async function loadGrades(){
  const grades = await loadJSON('data/grades.json', FALLBACK_GRADES);
  const grid = document.getElementById('gradesGrid');
  if(!grid) return;
  grid.innerHTML = grades.map(g=>`
    <div class="grade-card">
      <div class="grade-rank">${g.rang}</div>
      <h4>${g.nom}</h4>
      <p>${g.description}</p>
    </div>
  `).join('');
}

loadGrades();
