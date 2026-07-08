# RonflexCorp — Site de guilde Cobblemon

Site web premium et responsive pour la guilde **RonflexCorp**.

## Structure du projet

Le site est découpé en plusieurs pages (et non plus une seule one-page à ancres) :

```
ronflexcorp/
├── index.html                    → Accueil (Hero + accès rapide aux autres pages)
├── presentation.html             → Présentation (histoire, valeurs, rangs, galerie)
├── recrutement.html              → Recrutement (critères, règles, formulaire de candidature)
├── contact.html                  → Contact (équipe, Discord, formulaire de contact)
├── css/
│   └── style.css                 → tous les styles (palette, typographie, animations, responsive)
├── js/
│   ├── main.js                   → commun à toutes les pages : nav, burger, scroll reveal,
│   │                                particules du Hero
│   ├── home.js                   → statistiques animées de l'Accueil
│   ├── presentation.js           → rangs de la guilde (Présentation)
│   ├── recrutement.js            → formulaire de candidature
│   └── contact.js                → équipe + formulaire de contact
├── assets/
│   ├── logo.svg / logo-footer.svg   → logo RonflexCorp (nav, footer)
│   ├── mascot-hero.svg              → mascotte affichée dans le Hero
│   ├── mascot-loader.svg            → mascotte affichée pendant le chargement
│   ├── mountains.svg                → décor du Hero
│   └── gallery-1.svg … gallery-4.svg → illustrations de la galerie (section Présentation)
└── README.md
```

Chaque page reprend la même nav et le même footer. Pour ajouter une page, dupliquez la nav/footer
d'une page existante et ajoutez le lien correspondant dans `.nav-links` et `.footer-links` de
**toutes** les pages.

## Lancer le site en local

Depuis le dossier `ronflexcorp/` :

```bash
python3 -m http.server 8000
```

puis ouvrez `http://localhost:8000` dans votre navigateur.

## Images / droits d'auteur

Toutes les illustrations du dossier `assets/` sont des créations originales (SVG dessinés pour
ce projet), inspirées par les couleurs et la silhouette de Ronflex, mais ne reproduisent aucun
artwork officiel Nintendo / Game Freak / The Pokémon Company. Si vous souhaitez utiliser de vrais
artworks ou sprites officiels, vous devrez les héberger vous-même et vérifier que leur usage
respecte les droits du titulaire de la licence — ce n'est pas un contenu que je peux générer
ou intégrer directement.

## Personnalisation rapide

- **Couleurs** : variables CSS en haut de `css/style.css` (`:root { --deep-blue: ... }`)
- **Typographies** : Fraunces (titres), Work Sans (texte courant), JetBrains Mono (données/labels)
- **Textes** : directement dans le fichier `.html` de la page concernée
- **Statistiques animées du Hero** : attribut `data-count` sur chaque `<b>` dans la section stats
