# WaveCheck

WaveCheck est un site web (100% gratuit) pour tester la qualité d’Internet à l’échelle mondiale.

## Stack

- HTML / CSS / JavaScript (sans build)
- Leaflet.js (carte)
- Chart.js (graphiques)
- i18next (multilingue)
- ip-api.com (détection pays / ville)
- Firebase (stockage optionnel)
- LibreSpeed (test de débit via serveur public ou auto-hébergé)

## Démarrage

- Ouvrir `html/index.html` dans un navigateur.
- Pour tester sur un serveur local (recommandé pour éviter des soucis CORS), utilisez un serveur statique.

## Firebase (optionnel)

Renseignez vos paramètres dans `firebase/config.js`. Si non configuré, l’app fonctionne en mode “local” (sans enregistrement cloud).

