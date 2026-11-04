# Mon Vieux Grimoire

## Présentation du projet

Mon Vieux Grimoire est une application web permettant aux utilisateurs de partager leurs lectures et de découvrir de nouveaux livres.

L'application permet notamment de :
- Créer un compte et se connecter.
- Ajouter un livre avec ses informations et une image.
- Consulter les livres disponibles.
- Modifier ou supprimer ses propres livres.
- Noter les livres.
- Calculer automatiquement la note moyenne de chaque livre.

Le projet est développé avec React pour le frontend et Node.js / Express pour le backend. Les données sont stockées dans une base de données MongoDB Atlas.

## Prérequis

Pour installer et lancer le projet, vous devez disposer des éléments suivants :

- [Node.js](https://nodejs.org/) (version LTS recommandée).
- npm (installé avec Node.js).
- [Git](https://git-scm.com/).
- Un compte MongoDB Atlas avec un cluster et un utilisateur de base de données configurés.

## Installation du projet

### 1. Cloner le dépôt

Clonez le dépôt GitHub puis accédez au dossier du projet :

```bash
git clone URL_DU_DEPOT
cd OpenClassroomsProjet6
```

### 2. Installation du frontend

Ouvrez un terminal dans le dossier frontend :

```bash
cd frontend
npm install
```

### 3. Installation du backend

Ouvrez un deuxième terminal à la racine du projet, puis exécutez :

```bash
cd backend
npm install
```

## Configuration de la base de données

Le backend utilise MongoDB Atlas pour stocker les données.

Pour configurer la connexion :

1. Connectez-vous à votre compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Créez ou sélectionnez un cluster.
3. Créez un utilisateur de base de données avec un identifiant et un mot de passe.
4. Configurez les autorisations réseau pour permettre la connexion au cluster.
5. Récupérez votre chaîne de connexion MongoDB.

### Création du fichier .env

Dans le dossier `backend`, créez un fichier nommé `.env`.

Ajoutez les variables suivantes en remplaçant les valeurs d'exemple par vos propres informations :

```env
MONGODB_URI=mongodb+srv://UTILISATEUR:MOT_DE_PASSE@VOTRE_CLUSTER.mongodb.net/NOM_DE_LA_BASE
PORT=4000
```

**Important :** le fichier `.env` contient des informations confidentielles. Il ne doit jamais être partagé ni envoyé sur GitHub.

## Lancement de l'application

L'application nécessite le démarrage de deux serveurs indépendants.

### 1. Démarrer le backend

Dans un premier terminal, depuis le dossier `backend` :

```bash
npm run dev
```

Le serveur backend démarre sur le port 4000.

Il est également possible de lancer le serveur sans Nodemon avec :

```bash
npm start
```

### 2. Démarrer le frontend

Dans un deuxième terminal, depuis le dossier `frontend` :

```bash
npm start
```

Le frontend React démarre sur le port 3000.

## Accéder à l'application

Une fois les deux serveurs démarrés, ouvrez votre navigateur à l'adresse suivante :

**http://localhost:3000**

Vous pouvez désormais utiliser l'application Mon Vieux Grimoire.

---

Projet réalisé dans le cadre de la formation Développeur Web OpenClassrooms.