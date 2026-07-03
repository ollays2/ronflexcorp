# RonflexCorp — Site de guilde Cobblemon

Site web premium et responsive pour la guilde **RonflexCorp**, avec catalogue de Pension Pokémon interactif.

## Structure du projet

Le site est découpé en plusieurs pages (et non plus une seule one-page à ancres) :

```
ronflexcorp/
├── index.html                    → Accueil (Hero + accès rapide aux autres pages)
├── presentation.html             → Présentation (histoire, valeurs, rangs, galerie)
├── recrutement.html              → Recrutement (critères, règles, formulaire de candidature)
├── commerce.html                 → Commerce (vue d'ensemble : PokeShop / ItemShop / ServiceShop)
├── commerce-pokeshop.html        → PokeShop (catalogue vivant de la Pension : recherche, filtres, tri, pagination)
├── commerce-itemshop.html        → ItemShop (objets, baies, accessoires de dressage)
├── commerce-serviceshop.html     → ServiceShop (élevage sur-mesure, coaching, autres services)
├── contact.html                  → Contact (équipe, Discord, formulaire de contact)
├── css/
│   └── style.css                 → tous les styles (palette, typographie, animations, responsive)
├── js/
│   ├── main.js                   → commun à toutes les pages : nav, burger, menu déroulant
│   │                                "Commerce", scroll reveal, particules du Hero
│   ├── home.js                   → statistiques animées de l'Accueil
│   ├── presentation.js           → rangs de la guilde (Présentation)
│   ├── recrutement.js            → formulaire de candidature
│   ├── contact.js                → équipe + formulaire de contact
│   └── commerce-pokeshop.js      → moteur du catalogue PokeShop (recherche, filtres, tri, pagination)
├── data/
│   └── pokemon.json    → catalogue de démonstration (30 fiches). Remplacez ce fichier par
│                          l'export de votre propre base de données pour afficher vos vrais
│                          Pokémon (même structure de champs à respecter, voir plus bas).
├── assets/
│   ├── logo.svg / logo-footer.svg   → logo RonflexCorp (nav, footer, section Pension)
│   ├── mascot-hero.svg              → mascotte affichée dans le Hero
│   ├── mascot-loader.svg            → mascotte affichée pendant le chargement
│   ├── mountains.svg                → décor du Hero
│   └── gallery-1.svg … gallery-4.svg → illustrations de la galerie (section Présentation)
└── README.md
```

Chaque page reprend la même nav (avec un menu déroulant "Commerce" listant PokeShop / ItemShop /
ServiceShop) et le même footer. Pour ajouter une page, dupliquez la nav/footer d'une page existante
et ajoutez le lien correspondant dans `.nav-links` et `.footer-links` de **toutes** les pages.

## Lancer le site en local

Les fichiers `data/pokemon.json` sont chargés via `fetch()`, ce qui nécessite un serveur local
(la plupart des navigateurs bloquent `fetch()` sur des fichiers ouverts en double-clic avec `file://`).

Depuis le dossier `ronflexcorp/` :

```bash
python3 -m http.server 8000
```

puis ouvrez `http://localhost:8000` dans votre navigateur.

*(Si vous ouvrez `index.html` directement sans serveur, le site fonctionne quand même : un
jeu de données de démonstration prend automatiquement le relais si `pokemon.json` ne peut pas
être chargé.)*

## Format d'une fiche Pokémon (data/pokemon.json)

```json
{
  "id": 0,
  "name": "Torvégo",
  "types": ["Roche", "Plante"],
  "level": 97,
  "sex": "♀",
  "nature": "Calme",
  "talent": "Absorption",
  "iv": 104,
  "ivDisplay": "30/24/15/15/1/19",
  "ev": "252/252/4",
  "shiny": false,
  "legendary": false,
  "price": 162,
  "avail": "Disponible"
}
```

- `ivDisplay` : IV par stat, ordre PV / Attaque / Défense / Attaque Spé. / Défense Spé. / Vitesse
- `avail` : `"Disponible"`, `"Réservé"` ou `"Vendu"`
- `types` : un tableau d'1 ou 2 types parmi ceux définis dans `TYPE_COLORS` (js/commerce-pokeshop.js)

Pour brancher une vraie API au lieu d'un fichier JSON statique, modifiez la fonction
`loadCatalog()` dans `js/commerce-pokeshop.js` (remplacez l'URL `data/pokemon.json` par
l'endpoint de votre backend).

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
