/* ---------------- Équipe (Contact) ---------------- */
const FALLBACK_TEAM = [
  { initiales:"RO", nom:"Ronflex_On_Top", role:"Fondateur" },
  { initiales:"IM", nom:"ImMat_", role:"Co-fondateur" },
  { initiales:"SR", nom:"Suzu_Rcorps", role:"Gérant de la Pension" }
];

async function loadTeam(){
  const team = await loadJSON('data/team.json', FALLBACK_TEAM);
  const list = document.getElementById('teamList');
  if(!list) return;
  list.innerHTML = team.map(m=>`
    <div class="responsable">
      <div class="resp-avatar">${m.initiales}</div>
      <span>${m.nom}<br><small>${m.role}</small></span>
    </div>
  `).join('');
}
loadTeam();

/* ---------------- Formulaire de contact ---------------- */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', async (e)=>{
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
}
