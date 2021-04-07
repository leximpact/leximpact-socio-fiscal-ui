# Interface socio-fiscale LexImpact

Ceci est le code source de l'application `simulateur-socio-fiscal.leximpact.dev`.
Il comprend une représentation graphique des effets de la loi sociale et fiscale sur des situations de personnes.

## Installation

Ce dépôt requiert [NodeJS](https://nodejs.org/fr/) version 12 ou supérieure. 
Il est construit sur la base du framework [Svelte](https://svelte.dev/) (et [Tailwind](https://tailwindcss.com/)).
Il emploie l'API Web définie par [leximpact-socio-fiscal-api](https://github.com/leximpact/leximpact-socio-fiscal-api) pour faire appel au moteur de microsimulation socio-fiscale [OpenFisca-France](https://github.com/openfisca/openfisca-france) et calculer les effets de la loi.

Afin de l'installer, ouvrir un terminal et exécuter les commandes suivantes pour vous déplacer dans le répertoire du projet et installer les librairies nécessaires :

```shell
cd leximpact-socio-fiscal-ui/
npm install
``` 

## Exécuter l'application - mode développeur

Dans le répertoire de l'application `leximpact-socio-fiscal-ui`, exécuter la commande : 

```shell
npm run dev
```

La commande n'affiche pas d'erreur et conserve la main tout en restant à l'écoute des modifications de code.
L'application peut alors être consultée dans un navigateur à l'adresse indiquée (par défaut : `http://localhost:3000`) 

Bravo ! Vous êtes prêt·e·s à utiliser et contribuer à `leximpact-socio-fiscal-ui` 🎉
