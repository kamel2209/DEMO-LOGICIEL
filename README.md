# Prototype — ProPlomb Marseille (démo, aucune donnée réelle)

Ce dossier contient un prototype fonctionnel du service : formulaire de déclenchement
de demande d'avis (côté artisan) + tableau de bord (côté professionnel), avec :
- envoi SMS/email **simulé** (affiché dans le terminal, pas de vrai SMS envoyé — aucun compte externe requis pour tester),
- génération de réponse IA **simulée localement** (règles simples adaptées à la note ; à brancher sur l'API Claude en production),
- détection de nouvel avis **simulée** via un petit panneau de test dans le dashboard (remplace l'API Google, en attendant l'accès).

## Installation (à faire une seule fois)

**Pré-requis : Node.js installé sur votre PC.**
Si ce n'est pas déjà fait : téléchargez-le sur https://nodejs.org (version "LTS"), installez-le normalement (Suivant, Suivant, Terminer), puis redémarrez votre terminal.

Ensuite, dans ce dossier, ouvrez un terminal (clic droit → "Ouvrir dans le terminal" sous Windows 11) et lancez :

```
npm install
node seed.js
```

## Lancer la démo

```
node server.js
```

Puis ouvrez dans votre navigateur :
- **http://localhost:3000** → la page que l'artisan utilise sur le terrain après une intervention
- **http://localhost:3000/dashboard** → le tableau de bord du professionnel

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

## Tester le parcours complet

1. Sur la page d'accueil, remplissez un prénom + un téléphone ou un email fictif, cliquez sur "Envoyer la demande d'avis".
2. Regardez le terminal : le message SMS/email simulé s'affiche (c'est ce que le client recevrait réellement en production).
3. Allez sur `/dashboard`, descendez jusqu'au panneau **"🧪 Outil de démonstration"** en bas de page, et simulez un nouvel avis (positif, neutre, ou négatif).
4. Cliquez sur **"✨ Générer une proposition de réponse"** — une réponse adaptée à la note apparaît.
5. Modifiez-la si besoin, puis cliquez sur **"✅ Valider et publier"** — elle passe dans la liste des réponses publiées.

## Ce qui est simulé vs ce qui sera réel en production

| Fonction | Dans ce prototype | En production |
|---|---|---|
| Lien d'avis Google | Lien factice | Vrai lien généré depuis Google Business Profile du client |
| Envoi SMS/Email | Affiché dans le terminal | Envoyé réellement via Brevo |
| Détection nouvel avis | Bouton de simulation manuelle | Alerte Google transférée (V1) ou API (V1.1) |
| Réponse IA | Règles simples locales | API Claude (Anthropic) |
| Base de données | Fichier local (SQLite) | Base hébergée (Supabase, UE) |

## Fichiers du projet

- `server.js` — serveur principal (API + pages)
- `db.js` — structure de la base de données
- `services/notify.js` — envoi SMS/email (à remplacer par Brevo en prod)
- `services/ai-reply.js` — génération de réponse (à remplacer par l'API Claude en prod)
- `public/trigger.html` — page de déclenchement (artisan)
- `public/dashboard.html` — tableau de bord (professionnel)
- `seed.js` — crée le client de démo "ProPlomb Marseille"
