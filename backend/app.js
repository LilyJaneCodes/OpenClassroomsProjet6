require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB :', error.message);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/', (req, res, next) => {
  res.send('Mon Vieux Grimoire : serveur opérationnel !');
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Mise à disposition des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error(error);

    if (error.code === 'INVALID_IMAGE_CONTENT') {
    return res.status(400).json({
      error: 'Le fichier envoyé ne contient pas une image valide.'
    });
  }

  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      error: 'Format de fichier non autorisé. Seules les images JPG et PNG sont acceptées.'
    });
  }

  if (error instanceof require('multer').MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.'
      });
    }

    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({
    error: 'Une erreur est survenue sur le serveur.'
  });
});

module.exports = app;