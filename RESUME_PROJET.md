# Résumé technique du projet — Étudiants Étrangers

Ce document sert de base factuelle pour la rédaction du rapport de projet. Il décrit l'état réel du code au moment de la rédaction (dernier commit poussé : `595a671`). Le projet est **déployé et fonctionnel en production** — voir §11.

---

## 1. Contexte

**Objectif** : une plateforme web d'accompagnement pour les étudiants étrangers venant étudier en France, structurée autour de deux volets et d'un assistant conversationnel :

- **Volet éducatif** : recherche d'écoles et de formations (par filière, ville, type de cursus), et génération de recherches d'offres d'entreprises (stage/alternance) sur des plateformes externes spécialisées.
- **Volet administratif** : checklist personnalisée des démarches à effectuer (titre de séjour, aides, droit au travail étudiant), et consultation des aides disponibles (CAF, bourses, santé, transport...). Ce volet est désormais protégé par un **vrai compte utilisateur** (inscription/connexion), chaque étudiant ne voyant que sa propre checklist.
- **Chatbot** : assistant conversationnel basé sur l'API Claude (Anthropic), capable de répondre aux questions sur les deux volets ci-dessus.

**Délai** : projet réalisé sur un délai d'un mois. Premier commit le 15/08/2026, développement actif du 19/08/2026 au 04/09/2026 (voir §9 pour le détail chronologique).

**Stade actuel** : MVP fonctionnel de bout en bout (recherche de formations, authentification réelle, checklist interactive liée au compte, aides, chatbot, liens vers offres externes), **déployé et vérifié en production** (Neon + Render + Vercel — voir §11).

---

## 2. Stack technique

### Back-end
- **Node.js** + **Express 5** — serveur API REST
- **PostgreSQL 18** (instance locale) — base de données
- **Prisma ORM 7.9.1** — modélisation, migrations, requêtes (avec `@prisma/adapter-pg` + driver `pg`)
- **Authentification** : `bcryptjs` (hash des mots de passe) + `jsonwebtoken` (JWT)
- **API chatbot** : `@anthropic-ai/sdk`, modèle `claude-opus-5`
- Utilitaires : `cors`, `dotenv`, `nodemon` (rechargement à chaud en dev)

### Front-end
- **React 19** + **Vite 8** — build et dev server
- **react-router-dom 7** — routage client (SPA, 8 routes)
- **React Context** (`AuthContext`) — état d'authentification partagé dans toute l'app
- CSS pur (pas de framework CSS type Tailwind/Bootstrap) — design system maison via variables CSS (`front/src/index.css`)
- **Google Fonts** : Sora (titres) + Inter (texte courant)
- `oxlint` — lint

### Base de données / ORM
- PostgreSQL, schéma `public`, connexion via `DATABASE_URL` dans `back/.env` (non commité — un `back/.env.example` fournit le squelette)
- Prisma gère le schéma, les migrations (7 migrations appliquées à ce jour) et le client généré (`back/src/generated/prisma`, exclu de git)

### Chatbot
- Anthropic SDK, une seule route `POST /api/chatbot/message`
- La clé API (`ANTHROPIC_API_KEY`) est stockée uniquement en local dans `back/.env`, jamais commitée

### Authentification
- Mots de passe hashés avec **bcrypt** (via `bcryptjs`, implémentation pure JavaScript choisie pour éviter la compilation native de `bcrypt` sur Windows)
- Sessions gérées par **JWT** (`jsonwebtoken`), signés avec `JWT_SECRET` (généré aléatoirement, stocké uniquement dans `back/.env`)
- Voir §7 pour le détail du flux et §9 pour la justification du choix JWT vs sessions classiques

---

## 3. Schéma de données complet

Contenu réel de `back/prisma/schema.prisma` (5 modèles) :

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String // hash bcrypt, jamais le mot de passe en clair
  firstName    String
  lastName     String
  country      String?
  createdAt    DateTime @default(now())

  checklistItems ChecklistItem[]
}

// Volet educatif : formations proposees par les etablissements
model School {
  id        String     @id @default(uuid())
  name      String
  city      String
  website   String? // site officiel de l'etablissement
  createdAt DateTime   @default(now())

  formations Formation[]
}

model Formation {
  id          String   @id @default(uuid())
  title       String
  description String?
  type        String // ex: alternance, stage, initiale
  field       String // ex: Informatique, Commerce, Droit
  school      School   @relation(fields: [schoolId], references: [id])
  schoolId    String
  createdAt   DateTime @default(now())
}

// Aides disponibles (CAF, bourses, etc.)
model Aid {
  id          String   @id @default(uuid())
  name        String // ex: "APL", "Bourse CROUS"
  provider    String // ex: "CAF", "CROUS"
  category    String // ex: logement, bourse, sante, transport
  description String?
  eligibility String? // conditions resumees
  amount      String? // texte libre (montants variables)
  url         String? // lien officiel pour la demarche
  createdAt   DateTime @default(now())
}

// Volet administratif : checklist personnalisee par utilisateur
model ChecklistItem {
  id          String   @id @default(uuid())
  label       String
  description String?
  done        Boolean  @default(false)
  category    String // titre_de_sejour, aides, droit_au_travail
  url         String? // lien vers le site officiel de la demarche
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime @default(now())
}
```

### Relations
```
User        1───* ChecklistItem   (userId)
School      1───* Formation       (schoolId)
Aid                                (table autonome, pas de FK)
```

### Notes
- Un modèle `JobOffer` a existé (offres stockées en base) puis a été **entièrement supprimé** (migration `20260901120000_drop_job_offer`) au profit d'une génération de liens externes — voir §9.
- `Aid` et `ChecklistItem` ne sont **pas reliés entre eux** — décision explicite pour garder le MVP simple (voir §9).
- `User.password` a été **renommé en `passwordHash`** (migration `20260904090000_password_hash`) pour documenter explicitement dans le schéma que ce champ contient un hash bcrypt et jamais un mot de passe en clair.

### Migrations (dans l'ordre)
1. `20260819190506_init` — création initiale (`User`, `School`, `Formation`, `JobOffer`, `ChecklistItem`)
2. `20260819192538_checklist_description_and_aid` — ajout `ChecklistItem.description` + création du modèle `Aid`
3. `20260819204154_add_field_to_formation_and_joboffer` — ajout du champ `field` (filière) à `Formation` et `JobOffer`
4. `20260819213123_add_category_to_aid` — ajout `Aid.category`
5. `20260831234601_add_urls_to_school_offer_checklist` — ajout `School.website`, `JobOffer.url`, `ChecklistItem.url`
6. `20260901120000_drop_job_offer` — suppression complète du modèle/table `JobOffer`
7. `20260904090000_password_hash` — renommage `User.password` → `User.passwordHash` (les tables `User`/`ChecklistItem`, qui ne contenaient que des données de seed, ont été vidées avant la migration pour éviter une violation de contrainte `NOT NULL`)

---

## 4. Structure du projet

```
etudiants-etrangers-app/
├── README.md
├── RESUME_PROJET.md
├── back/
│   ├── .env                  (non commité — DATABASE_URL, PORT, ANTHROPIC_API_KEY, JWT_SECRET)
│   ├── .env.example          (squelette commité, sans valeurs sensibles)
│   ├── .gitignore
│   ├── package.json
│   ├── prisma.config.ts      (config Prisma 7, charge dotenv, seed command)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js           (script de peuplement — écoles, formations, aides, user démo)
│   │   └── migrations/       (7 migrations, voir §3)
│   └── src/
│       ├── app.js            (config Express : cors, json, montage des routers)
│       ├── server.js         (point d'entrée, écoute sur process.env.PORT)
│       ├── prisma.js         (instance PrismaClient partagée, via adapter-pg)
│       ├── claude.js         (client Anthropic SDK)
│       ├── middleware/
│       │   └── auth.js       (middleware requireAuth : verifie le JWT, pose req.userId)
│       ├── routes/
│       │   ├── auth.routes.js        (POST /register, POST /login)
│       │   ├── education.routes.js   (GET /formations)
│       │   ├── admin.routes.js       (checklist protegee + aides publiques)
│       │   └── chatbot.routes.js     (POST /message)
│       └── generated/prisma/ (client Prisma généré — exclu de git)
│
└── front/
    ├── index.html             (fonts Google, lien favicon)
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   ├── favicon.svg        (logo — voir §8)
    │   └── icons.svg
    └── src/
        ├── main.jsx           (point d'entrée, BrowserRouter + AuthProvider)
        ├── App.jsx            (déclaration des 8 routes)
        ├── index.css          (design system global : tokens CSS, classes utilitaires partagées)
        ├── api/               (couche d'appel HTTP vers le back-end)
        │   ├── client.js      (wrapper fetch générique, attache le token JWT, gestion d'erreurs)
        │   ├── auth.js        (register, login)
        │   ├── education.js   (getFormations)
        │   ├── admin.js       (checklist + aides)
        │   └── chatbot.js     (sendMessage)
        ├── context/
        │   └── AuthContext.jsx  (état utilisateur/token partagé, login/register/logout)
        ├── components/
        │   ├── Layout.jsx / Layout.css   (barre de navigation + état de connexion + <Outlet/>)
        │   └── Icons.jsx      (icônes SVG custom réutilisables)
        ├── data/
        │   └── jobPlatforms.js  (générateur de liens vers les plateformes d'emploi — voir §7)
        ├── assets/
        │   └── hero-students.jpg  (photo bannière accueil — voir §8)
        └── pages/
            ├── Home.jsx / Home.css
            ├── Formations.jsx
            ├── Offers.jsx
            ├── Checklist.jsx / Checklist.css
            ├── Aids.jsx
            ├── Chat.jsx / Chat.css
            ├── Register.jsx    (inscription)
            ├── Login.jsx       (connexion)
            └── Auth.css        (styles partages Register/Login)
```

---

## 5. Routes API existantes

Base URL en local : `http://localhost:4000`

| Méthode | Route | Auth requise | Description |
|---|---|---|---|
| GET | `/health` | non | Healthcheck (`{ status: "ok" }`) |
| POST | `/api/auth/register` | non | Crée un compte. Corps : `{ email, password, firstName, lastName, country? }`. Réponse : `{ token, user }` (`201`, ou `409` si l'email existe déjà). |
| POST | `/api/auth/login` | non | Connecte un utilisateur. Corps : `{ email, password }`. Réponse : `{ token, user }` (`401` générique si email ou mot de passe incorrect — pas de distinction pour éviter l'énumération de comptes). |
| GET | `/api/education/formations?field=&city=&type=` | non | Liste les formations, filtres combinables : `field` (exact), `city` (recherche partielle insensible à la casse sur la ville de l'école), `type` (exact). Inclut les infos de l'école liée. |
| GET | `/api/admin/checklist` | **oui** | Liste les étapes de checklist de l'utilisateur connecté (déduit du token), triées par date croissante. |
| POST | `/api/admin/checklist` | **oui** | Crée une étape pour l'utilisateur connecté. Corps : `{ label, description, category }`. |
| PATCH | `/api/admin/checklist/item/:id` | **oui** | Coche/décoche une étape. Corps : `{ done }`. Vérifie que l'étape appartient à l'utilisateur connecté (sinon `404`). |
| GET | `/api/admin/aids?category=` | non | Liste les aides, filtre optionnel par `category`, triées par nom. |
| POST | `/api/chatbot/message` | non | Envoie l'historique de conversation au chatbot. Corps : `{ messages: [{ role, content }] }`. Réponse : `{ reply }`. |

**Auth requise** = le header `Authorization: Bearer <token>` doit contenir un JWT valide (middleware `requireAuth`), sinon `401`.

**Changement important** : les routes checklist ne prennent plus `:userId` dans l'URL (c'était le cas avant l'ajout de l'authentification) — l'utilisateur est désormais systématiquement déduit du token, jamais d'une valeur fournie par le client.

---

## 6. Pages front-end

| Page | Route | Contenu affiché | API appelée |
|---|---|---|---|
| **Home** | `/` | Bannière plein écran (photo + titre + CTA), grille de 5 cartes de navigation | Aucune |
| **Formations** | `/formations` | Recherche d'écoles/formations avec filtres filière/ville/type ; lien vers le site de l'école si renseigné | `GET /api/education/formations` |
| **Offers** | `/offres` | Sélection filière + type (stage/alternance), génère des cartes-liens vers des plateformes de recherche d'emploi externes (voir §7) | Aucune (génération locale de liens) |
| **Checklist** | `/checklist` | Si connecté : checklist groupée par catégorie, cases à cocher, lien vers le site officiel de la démarche, formulaire d'ajout d'étape. Si non connecté : message d'invite avec boutons vers Connexion/Inscription | `GET/POST /api/admin/checklist`, `PATCH /api/admin/checklist/item/:id` |
| **Aids** | `/aides` | Liste des aides disponibles, filtre par catégorie | `GET /api/admin/aids` |
| **Chat** | `/chat` | Interface de chat avec bulles utilisateur/assistant, historique côté client | `POST /api/chatbot/message` |
| **Register** | `/inscription` | Formulaire d'inscription (prénom, nom, email, mot de passe, pays optionnel) ; redirige vers `/checklist` après succès | `POST /api/auth/register` |
| **Login** | `/connexion` | Formulaire de connexion (email, mot de passe) ; redirige vers `/checklist` après succès | `POST /api/auth/login` |

La **barre de navigation** (`Layout.jsx`) affiche désormais un état de connexion : prénom de l'utilisateur + bouton "Déconnexion" si connecté, sinon boutons "Connexion" / "Inscription".

---

## 7. Fonctionnalités spécifiques

### Authentification
- **Inscription/connexion** : `back/src/routes/auth.routes.js`. Le mot de passe est hashé avec `bcrypt.hash(password, 10)` avant stockage ; jamais renvoyé au client (`toPublicUser()` retire `passwordHash` de la réponse). Un JWT est signé (`jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" })`) et renvoyé avec les infos publiques de l'utilisateur.
- **Reconnaissance de l'utilisateur connecté** : le frontend stocke le token dans `localStorage` (`front/src/api/client.js`) et l'attache automatiquement à chaque requête (`Authorization: Bearer <token>`). Le middleware `requireAuth` (`back/src/middleware/auth.js`) vérifie la signature du token et pose `req.userId`, utilisé par les routes protégées — le client ne fournit jamais lui-même son identité.
- **Isolation des données entre utilisateurs** : les routes checklist n'acceptent plus de `userId` en paramètre d'URL (supprimé lors de l'ajout de l'auth). Pour l'action `PATCH /checklist/item/:id` qui cible une ressource par son propre id, une vérification de propriété est faite via `updateMany({ where: { id, userId: req.userId } })` — si l'étape n'appartient pas à l'utilisateur connecté, aucune ligne n'est modifiée et une `404` générique est renvoyée (sans révéler si l'id existe chez un autre utilisateur).
- **Pourquoi JWT plutôt que des sessions classiques** : voir §9.
- **État côté frontend** : `front/src/context/AuthContext.jsx` (React Context) centralise `{ user, isAuthenticated, login, register, logout }`, avec le token et les infos utilisateur mis en cache dans `localStorage` pour persister la connexion entre rechargements de page.

### Chatbot
- Route unique : `POST /api/chatbot/message`
- Modèle utilisé : **`claude-opus-5`**, `max_tokens: 1024`
- **Prompt système** (constante `SYSTEM_PROMPT` dans `back/src/routes/chatbot.routes.js`) :
  > *"Tu es un assistant d'orientation pour des etudiants etrangers en France. Tu aides sur deux volets : educatif (choix d'ecoles/formations, alternance, stages) et administratif (titre de sejour, aides disponibles, droit au travail etudiant). Reponds de maniere claire et concise, et precise quand une demarche doit etre verifiee aupres d'une source officielle (prefecture, CROUS, etc.)."*
- Pas de mémoire côté serveur : le front envoie l'intégralité de l'historique de la conversation à chaque message, le serveur relaie tel quel à l'API Anthropic avec le system prompt.
- Le chatbot n'est **pas** protégé par authentification (accessible sans compte), contrairement à la checklist.

### Liens externes vers les offres d'emploi
Le module `front/src/data/jobPlatforms.js` génère, à partir de la filière et du type de contrat choisis par l'étudiant, une liste de cartes-liens (pas d'appel API, tout est calculé côté client) :

| Plateforme | Paramètre de requête | Statut de vérification |
|---|---|---|
| **La Bonne Alternance** | `?display=list&page=fiche&type=lba&job=<filière>` | ✅ Vérifié manuellement — n'apparaît que si le type sélectionné est **Alternance** (ce site ne référence que des offres d'alternance) |
| **Indeed** | `?q=<filière> <type>` | ✅ Vérifié manuellement |
| **HelloWork** | `?k=<filière> <type>` | ✅ Vérifié manuellement |
| **Apec** | `?motsCles=<filière> <type>` | ✅ Vérifié manuellement |
| **JobTeaser** | `?q=<filière> <type>` | ✅ Vérifié manuellement |
| **Welcome to the Jungle** | `?query=<filière> <type>` | ⚠️ Non fiable — ce site a changé son UX vers un système de "matching" qui ignore ce paramètre pour un visiteur anonyme. La carte reste affichée avec une note visible. |

Tous les liens s'ouvrent dans un nouvel onglet (`target="_blank" rel="noreferrer"`).

---

## 8. Choix de design

### Palette de couleurs
Définie via variables CSS dans `front/src/index.css`, avec équivalents dark mode (`prefers-color-scheme: dark`) :

| Rôle | Light | Dark |
|---|---|---|
| Accent principal (violet) | `#7c3aed` | `#a78bfa` |
| Accent secondaire (bleu ciel) | `#0ea5e9` | `#38bdf8` |
| Fond | `#ffffff` | `#131019` |
| Texte | `#5c5870` | `#a8a4b8` |
| Titres | `#18132b` | `#f3f1f9` |

La barre de navigation utilise un violet plein fixe (`#7c3aed` / `#6d28d9` au survol) **indépendant du thème clair/sombre**. Les nouveaux boutons Connexion/Inscription/Déconnexion réutilisent cette palette (boutons outline blancs sur fond violet, bouton plein blanc pour l'action principale "Inscription").

### Typographie
- **Sora** (600/700) pour les titres — chargée via Google Fonts
- **Inter** (400/500/600) pour le texte courant — chargée via Google Fonts

Les pages Inscription/Connexion réutilisent exactement les mêmes composants de formulaire (`.card`, `.btn`, `.error-banner`) que le reste du site — aucune nouvelle brique visuelle introduite pour l'authentification.

### Logo
SVG custom (`front/public/favicon.svg`, utilisé à la fois comme favicon et comme mark dans la navbar) : une toque de diplômé stylisée surmontée d'un bouton, avec un cordon de pompon descendant vers un petit globe. Remplit unique en violet `#7c3aed`.

### Photo (bannière d'accueil)
`front/src/assets/hero-students.jpg` — photo fournie directement par l'utilisateur, représentant un groupe de 4 étudiants échangeant sur un campus. Optimisée de 2,2 Mo/6169×4113px à 127 Ko/1400×933px. Affichée en arrière-plan plein écran avec un calque sombre semi-transparent (`rgba(13, 10, 26, 0.6)`).

---

## 9. Historique des décisions importantes

- **Pourquoi `School` et `Formation` sont deux modèles séparés** : une école propose plusieurs formations ; les séparer évite de dupliquer le nom/la ville de l'école sur chaque ligne de formation.

- **Pourquoi `Aid` et `ChecklistItem` restent non reliés** : décision explicite pour garder le MVP simple.

- **Pourquoi des champs `field`/`category` structurés plutôt qu'une recherche texte libre** : un filtre par égalité exacte est fiable, contrairement à une recherche `contains` qui génère des faux positifs.

- **Pourquoi des liens externes plutôt qu'une base de données pour les offres d'entreprises** : des offres stockées en base deviennent obsolètes en quelques semaines et nécessiteraient une maintenance manuelle continue. La solution retenue génère des liens de recherche pré-remplis vers des moteurs déjà tenus à jour par des tiers.

- **Pourquoi JWT plutôt que des sessions classiques (04/09/2026)** : une session classique nécessite un état côté serveur (store en mémoire, en base ou dans Redis) associant un id de session à l'utilisateur. Un JWT est auto-porteur — signé avec `JWT_SECRET`, il contient déjà l'identité de l'utilisateur, donc le serveur n'a rien à stocker pour vérifier une requête. Choisi ici parce que l'architecture est déjà une API REST stateless consommée par un SPA, et pour éviter d'ajouter une dépendance (Redis, table `Session`) dans un délai d'un mois. **Contrepartie assumée** : un JWT ne peut pas être révoqué immédiatement avant son expiration (fixée à 7 jours) sans ajouter une liste noire côté serveur — non implémenté, jugé disproportionné pour l'échelle du projet.

- **Pourquoi `bcryptjs` plutôt que `bcrypt`** : même algorithme et hashs strictement compatibles, mais `bcryptjs` est une implémentation 100% JavaScript qui évite la compilation native (node-gyp) que requiert le paquet `bcrypt` — un point de fragilité connu sur Windows sans outils de build installés.

- **Pourquoi le `userId` a été retiré des URLs de la checklist (04/09/2026)** : avant l'authentification, la checklist était accessible via `/checklist/:userId` avec un identifiant collé manuellement par l'utilisateur — n'importe qui pouvait consulter/modifier la checklist de n'importe qui en changeant l'URL. Avec l'ajout de l'authentification, cette faille n'a plus de raison d'exister : l'utilisateur est désormais déduit du JWT, jamais fourni par le client. Une vérification de propriété a aussi été ajoutée sur `PATCH /checklist/item/:id` (voir §7).

- **Pourquoi pas d'authentification complète dès le début** : contrainte de délai initiale — priorité donnée aux fonctionnalités cœur (recherche, checklist, aides, chatbot) avant d'investir dans un vrai système de comptes, avec un contournement temporaire (identifiant collé manuellement) le temps que le reste de l'app soit fonctionnel. Ce contournement a été entièrement retiré une fois l'authentification en place.

- **Pourquoi la palette violette** : ancrée sur les couleurs du mark abstrait généré par défaut par le scaffold Vite, conservées et affinées plutôt que remplacées.

- **Évolution de la section d'accueil** (SVG → photo → bannière plein écran) et **refonte de la navbar en violet plein** : itérations successives sur demande explicite pour renforcer l'identité visuelle du site.

---

## 10. État d'avancement

### Fait et testé
- Schéma de données complet (5 modèles), 7 migrations
- Script de seed réaliste : 12 écoles, 29 formations, 13 aides, 1 utilisateur démo avec mot de passe hashé et 3 étapes de checklist
- **Authentification complète** : inscription, connexion, hashage bcrypt, JWT, middleware de protection, isolation des données entre utilisateurs
- 9 routes API back-end fonctionnelles
- 8 pages front-end (dont Register/Login), navbar avec état de connexion
- Design system cohérent (palette, typographie, logo), light/dark mode
- Chatbot fonctionnel de bout en bout
- Parcours d'authentification testé manuellement dans un navigateur réel : inscription → redirection checklist → ajout d'étape → déconnexion → checklist inaccessible → reconnexion → donnée retrouvée. Testé aussi côté API : doublon d'email (409), mauvais mot de passe (401), accès sans token (401)
- **Déploiement en production** (Neon + Render + Vercel), vérifié fonctionnalité par fonctionnalité — voir §11

### Reste à faire
- **Tests automatisés** : aucun test unitaire ou d'intégration n'a été écrit ; toutes les vérifications ont été faites manuellement (navigateur, `curl`)
- **Révocation de token** : pas de mécanisme pour invalider un JWT avant son expiration (7 jours) — acceptable pour le MVP, à mentionner comme limite connue
- **Vérification des URLs saisies "de mémoire"** : certaines URLs du seed (sites des écoles, pages carrière d'entreprises) n'ont pas toutes été revérifiées en direct
- **Cold start Render** : sur le plan gratuit, le backend s'endort après une période d'inactivité et met 30-50s à répondre à la première requête suivante — acceptable pour une démo, à surveiller si le trafic augmente
- **Rapport de projet** : ce document sert de base ; reste à rédiger le rapport final (démarche, difficultés rencontrées, captures d'écran, bilan)

---

## 11. Déploiement en production

### Base de données — Neon
Instance PostgreSQL managée hébergée chez **Neon**. Le schéma et les migrations ont été appliqués avec `prisma migrate deploy`, puis la base a été peuplée avec `prisma db seed` (mêmes données que la seed locale : 12 écoles, 29 formations, 13 aides, 1 utilisateur démo). Connexion en TLS (`sslmode=require`, imposé par Neon). Identifiants de connexion non documentés ici — stockés uniquement dans la variable `DATABASE_URL` de Render.

### Back-end — Render
- **URL** : https://etudiants-etrangers-app.onrender.com
- **Build Command** : `npm install && npx prisma migrate deploy`
- **Start Command** : `npm start`
- **Variables d'environnement configurées** (noms uniquement, valeurs non documentées ici) :
  - `DATABASE_URL` — chaîne de connexion Neon
  - `ANTHROPIC_API_KEY` — clé de l'API Claude
  - `JWT_SECRET` — secret de signature des tokens, généré spécifiquement pour la production (différent de celui utilisé en local)
  - `CORS_ORIGIN` — restreint les origines autorisées à l'URL Vercel du front (voir plus bas)
  - `PORT` — injectée automatiquement par Render, non définie manuellement

### Front-end — Vercel
- **URL** : https://etudiants-etrangers-app.vercel.app
- **Root Directory** : `front`, build Vite standard (`vite build`, dossier `dist`)
- **Variable d'environnement** : `VITE_API_URL` = `https://etudiants-etrangers-app.onrender.com/api`

### CORS entre les deux
Le front (Vercel) et le back (Render) sont sur des domaines différents, donc chaque appel `fetch` du front vers l'API est une requête cross-origin. Le back autorise cela via le middleware `cors` (`back/src/app.js`), configuré avec la variable `CORS_ORIGIN` pointant explicitement vers l'URL Vercel — seul ce domaine est autorisé à appeler l'API en production (contre `origin: true`, permissif, utilisé par défaut quand `CORS_ORIGIN` est absent, ce qui reste le comportement en local).

### Vérification de bout en bout (confirmé fonctionnel)
Le site a été testé directement en production, dans un navigateur réel, page par page :

| Élément vérifié | Résultat |
|---|---|
| `GET /health` (Render) | ✅ `{"status":"ok"}` |
| Lecture de données réelles via Neon (`/api/education/formations`) | ✅ 29 formations retournées |
| Chargement direct de sous-routes React (`/formations`, `/connexion`...) | ✅ (après correctif, voir ci-dessous) |
| Inscription puis connexion (compte démo du seed) | ✅ JWT émis et vérifié, navbar met à jour l'état connecté |
| Checklist protégée par JWT | ✅ données de l'utilisateur connecté chargées et modifiables |
| Aides, formations, offres (liens externes) | ✅ |
| Chatbot (`POST /api/chatbot/message`) | ✅ (après correctif, voir ci-dessous) |

### Deux incidents trouvés et corrigés pendant cette vérification
Utile à documenter dans le rapport : deux problèmes réels ont été détectés en testant le déploiement, ni l'un ni l'autre visibles en local.

1. **404 sur toute route chargée directement ou rafraîchie** (`commit 5042fe1`). Vercel sert un site statique et ne savait pas retomber sur `index.html` pour les routes gérées côté client par React Router — un lien direct vers `/formations` ou un F5 sur une page renvoyait la 404 générique de Vercel au lieu de l'application. Corrigé par l'ajout de `front/vercel.json` avec une règle de réécriture (`rewrites`) qui redirige toute route vers `index.html`.

2. **Erreur 401 sur le chatbot en production** (`commit 595a671`). La route chatbot n'avait aucun `try/catch` autour de l'appel à l'API Anthropic : quand `ANTHROPIC_API_KEY` était invalide côté Render, le SDK levait une erreur avec `status: 401` qui remontait telle quelle jusqu'au client (page d'erreur HTML brute d'Express, sans JSON exploitable). Après correction de la clé sur Render, et ajout d'un `try/catch` renvoyant une erreur JSON propre (`502`) en cas de problème futur avec l'API Anthropic, le chatbot répond correctement.
