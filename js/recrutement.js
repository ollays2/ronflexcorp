/* ---------------- Formulaire de recrutement ---------------- */
const recruitForm = document.getElementById('recruitForm');
if(recruitForm){
  recruitForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    const data = new FormData(form);
    const val = (k)=> (data.get(k) || '—').toString().trim() || '—';
    const originalLabel = btn.innerHTML;
    btn.innerHTML = 'Envoi en cours…';
    btn.disabled = true;

    try{
      await sendToDiscord(DISCORD_WEBHOOKS.recruitment, {
        title: '🛡️ Nouvelle candidature — RonflexCorp',
        color: 4093862,
        fields: [
          { name: 'Pseudo Minecraft', value: val('pseudo_minecraft'), inline: true },
          { name: 'Pseudo Discord', value: val('pseudo_discord'), inline: true },
          { name: 'Âge', value: val('age'), inline: true },
          { name: 'Temps de jeu / semaine', value: val('temps_jeu'), inline: true },
          { name: 'Expérience Cobblemon', value: val('experience'), inline: true },
          { name: 'Motivations', value: val('motivations'), inline: false }
        ],
        timestamp: new Date().toISOString()
      });
      document.getElementById('recruitFormBody').style.display='none';
      document.getElementById('recruitSuccess').classList.add('show');
    }catch(err){
      btn.innerHTML = originalLabel;
      btn.disabled = false;
      if(err.message === 'webhook-not-configured'){
        alert("Le webhook Discord du recrutement n'est pas encore configuré.\nOuvre js/main.js et renseigne DISCORD_WEBHOOKS.recruitment (voir le README).");
      }else{
        alert("L'envoi a échoué. Vérifie ta connexion et réessaie, ou contacte-nous directement sur Discord.");
      }
    }
  });
}
