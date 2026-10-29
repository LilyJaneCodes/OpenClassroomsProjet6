require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const bookRoutes = require('./routes/book');

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

app.get((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/', (req, res, next) => {
  res.send('Mon Vieux Grimoire : serveur opérationnel !');
  next();
});

app.use('/api/books', bookRoutes);

module.exports = app;