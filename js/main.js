/* ---------------- Configuration Discord ---------------- */
/* Crée un webhook dans Discord : Paramètres du serveur → Intégrations → Webhooks → Nouveau
   webhook → choisis le salon (ex. #recrutement, #contact) → Copier l'URL du webhook.
   Colle chaque URL ci-dessous. Tu peux utiliser le même salon/webhook pour les deux
   si tu préfères tout centraliser au même endroit. */
const DISCORD_WEBHOOKS = {
  recruitment: "https://discord.com/api/webhooks/1522621547246780569/5undPAVodPKY8taKA--F1hL1COPHJnkY72quSc90rc8A2b9Jiweirh0wLy8NUJrVME-I",
  contact: "https://discord.com/api/webhooks/1522630606159085818/pesaptEqdXzNabFPdXNQcy2AJ3BT-oibZu4UZGidgF8imL_v8JjuxXZh-d38rehpagcN"
};

function isWebhookConfigured(url){
  return typeof url === 'string' && url.startsWith('https://discord.com/api/webhooks/');
}

async function sendToDiscord(webhookUrl, embed){
  if(!isWebhookConfigured(webhookUrl)){
    throw new Error('webhook-not-configured');
  }
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  });
  if(!res.ok) throw new Error('discord-error-' + res.status);
}

/* ---------------- Helper : charge un JSON avec valeur de secours ---------------- */
/* Si le fichier est absent ou mal formé, une valeur de secours prend le relais
   pour qu'aucune page ne casse. */
async function loadJSON(path, fallback){
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('not ok');
    return await res.json();
  }catch(err){
    console.warn(`${path} introuvable ou invalide, utilisation des données par défaut.`);
    return fallback;
  }
}

/* ---------------- Loader ---------------- */
window.addEventListener('load', ()=>{
  const loader = document.getElementById('loader');
  if(loader) setTimeout(()=> loader.classList.add('hidden'), 500);
});

/* ---------------- Nav scroll state ---------------- */
const nav = document.getElementById('nav');
if(nav){
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ---------------- Nav burger (mobile) ---------------- */
const burger = document.getElementById('burger');
if(burger){
  burger.addEventListener('click', (e)=>{
    e.stopPropagation();
    const links = document.querySelector('.nav-links');
    const isOpen = links.classList.toggle('mobile-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', ()=>{
    const links = document.querySelector('.nav-links');
    if(links) links.classList.remove('mobile-open');
    document.body.style.overflow = '';
  });
});
document.addEventListener('click', (e)=>{
  const links = document.querySelector('.nav-links');
  if(links && links.classList.contains('mobile-open') && !links.contains(e.target) && e.target.id !== 'burger'){
    links.classList.remove('mobile-open');
    document.body.style.overflow = '';
  }
});

/* ---------------- Scroll reveal ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* stagger index for gallery/grid children */
document.querySelectorAll('.reveal-stagger').forEach(parent=>{
  [...parent.children].forEach((c,i)=> c.style.setProperty('--i', i));
});

/* ---------------- Hero particles (feuilles / poussières) ---------------- */
const particleWrap = document.getElementById('particles');
if(particleWrap){
  const glyphs = ['✦','·','❉','z'];
  for(let i=0;i<22;i++){
    const p = document.createElement('span');
    p.className='particle';
    p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    p.style.left = Math.random()*100+'%';
    p.style.bottom = '-5%';
    p.style.fontSize = (10+Math.random()*16)+'px';
    p.style.animationDuration = (10+Math.random()*14)+'s';
    p.style.animationDelay = (Math.random()*14)+'s';
    particleWrap.appendChild(p);
  }
}
