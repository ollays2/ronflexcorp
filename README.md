# RonflexCorp — Site du serveur Minecraft Cobblemon

Site web premium et responsive pour le serveur **RonflexCorp**, un serveur Minecraft Cobblemon.

## Structure du projet

Le site est découpé en 4 pages dédiées :

```
ronflexcorp/
├── index.html                    → Accueil (présentation du serveur, accès rapide aux autres pages)
├── launcher.html                 → Launcher (téléchargement du modpack, connexion au serveur, FAQ)
├── wiki.html                     → Wiki (régions, gymnases, élevage, économie, PvP, events, commandes)
├── boutique.html                 → Boutique (grades cosmétiques)
├── css/
│   └── style.css                 → tous les styles (palette, typographie, animations, responsive)
├── js/
│   ├── main.js                   → commun à toutes les pages : nav, burger, scroll reveal,
│   │                                particules du Hero, copie de l'IP du serveur
│   ├── home.js                   → statistiques animées de l'Accueil
│   └── boutique.js               → grades affichés dans la Boutique
├── data/
│   ├── stats.json                → statistiques affichées sur l'Accueil
│   └── boutique.json             → grades et avantages de la Boutique
├── assets/
│   └── Snorlax_600_3331126.jpg, snorlax-cafe.jpg, snorlax-foret.jpg → mascotte RonflexCorp
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

Toutes les illustrations du dossier `assets/` sont des créations originales inspirées par les
couleurs et la silhouette de Ronflex, mais ne reproduisent aucun artwork officiel Nintendo /
Game Freak / The Pokémon Company / Cobblemon. Si vous souhaitez utiliser de vrais artworks ou
sprites officiels, vous devrez les héberger vous-même et vérifier que leur usage respecte les
droits du titulaire de la licence.

## Personnalisation rapide

- **Couleurs** : variables CSS en haut de `css/style.css` (`:root { --deep-blue: ... }`)
- **Typographies** : Fraunces (titres), Work Sans (texte courant), JetBrains Mono (données/labels)
- **Textes** : directement dans le fichier `.html` de la page concernée
- **Adresse du serveur** : attribut `data-copy` sur les boutons `.copy-btn` (Accueil et Launcher)
- **Statistiques animées du Hero** : `data/stats.json`
- **Grades de la Boutique** : `data/boutique.json`
