# Edge

Appli perso d'apprentissage du trading (ICT/SMC, risque, psychologie, Pine Script, macro BTC et or).
PWA sans dépendance : HTML, CSS et JavaScript, hébergée gratuitement sur GitHub Pages.

## Contenu

| Fichier | Rôle |
|---|---|
| `data/lecons.js` | Programme de leçons, dans l'ordre |
| `data/fiches.js` | Fiches de référence + règles du jour |
| `data/cartes.js` | Flashcards (répétition espacée) |
| `data/quiz.js` | Questions de quiz |
| `app.js` | Toute la logique de l'appli |
| `apps-script/Code.gs` | Passerelle privée vers le Google Sheet "Journal de trading" |

Pour ajouter du contenu, il suffit d'ajouter des entrées dans les fichiers `data/`, puis d'incrémenter `CACHE` dans `sw.js` pour que le téléphone récupère la nouvelle version.

## Installer sur l'iPhone

1. Ouvrir l'adresse GitHub Pages de l'appli dans **Safari** (pas Chrome).
2. Bouton Partager, puis **Sur l'écran d'accueil**.
3. Ouvrir Edge depuis l'icône : plein écran, fonctionne hors ligne.

La progression est stockée sur le téléphone. Réglages > Exporter pour en garder une copie.

## Relier le journal de trading (une seule fois, environ 3 minutes)

1. Ouvrir le Google Sheet "Journal de trading".
2. Menu **Extensions > Apps Script**.
3. Remplacer le contenu de `Code.gs` par celui de `apps-script/Code.gs`.
4. Remplacer `REMPLACE-MOI-PAR-UNE-CLE-LONGUE` par une clé à toi (longue, sans espace). Enregistrer.
5. **Déployer > Nouveau déploiement**, type **Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
6. Autoriser l'accès quand Google le demande, puis copier l'URL qui se termine par `/exec`.
7. Dans l'appli : Réglages, coller l'URL et la clé, puis **Tester**.

Le Sheet reste privé : le script ne renvoie les trades qu'à qui connaît la clé. La clé et l'URL ne sont stockées que sur le téléphone, jamais dans ce dépôt.

Après une modification du script, il faut faire **Déployer > Gérer les déploiements > Modifier > Nouvelle version** pour que la mise à jour soit prise en compte.
