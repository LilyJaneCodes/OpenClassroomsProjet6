const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Mon Vieux Grimoire : serveur opérationnel !');
});

app.get('/api/livres', (req, res) => {
  res.json([
    {
      id: '1',
      titre: 'Exemple de livre',
      auteur: 'Auteur fictif',
      description: 'Un livre de démonstration',
      imageUrl: 'https://example.com/livre.jpg'
    }
  ]);
});

module.exports = app;