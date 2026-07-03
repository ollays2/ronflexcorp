/* ---------------- Équipe & rôles de modération (Contact) ---------------- */
const FALLBACK_TEAM = [
  { initiales:"RO", nom:"Ronflex_On_Top", icon:"👑", role:"Fondateur du Sommeil", couleur:"#C9A66B" },
  { initiales:"IM", nom:"ImMat_", icon:"🛡️", role:"Co-Gardien Suprême", couleur:"#3F7FA6" },
  { initiales:"SR", nom:"Suzu_Rcorps", icon:"💤", role:"Maître de la Pension", couleur:"#6FA0C2" },
  { initiales:"—", nom:"Poste vacant", icon:"⚙️", role:"Veilleur (modérateur)", couleur:"#8C97A6" }
];

async function loadTeam(){
  const team = await loadJSON('data/team.json', FALLBACK_TEAM);
  const list = document.getElementById('teamList');
  if(!list) return;
  list.innerHTML = team.map(m=>`
    <div class="responsable">
      <div class="resp-avatar" style="box-shadow:0 0 0 2px ${m.couleur || 'var(--gold-soft)'};">${m.initiales}</div>
      <span>${m.nom}<br><small style="color:${m.couleur || 'var(--light-blue-soft)'}">${m.icon ? m.icon+' ' : ''}${m.role}</small></span>
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
