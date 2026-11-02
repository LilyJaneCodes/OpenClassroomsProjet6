const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json({ error })})
};


exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  delete bookObject.userId;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      if (book.userId.toString() !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée !' });
      }

      // On conserve l'ancienne URL uniquement si une nouvelle image est envoyée
      const oldImageUrl = req.file ? book.imageUrl : null;

      Book.updateOne(
        { _id: req.params.id },
        { $set: bookObject }
      )
        .then(() => {
          // Si une nouvelle image remplace l'ancienne, on supprime l'ancien fichier
          if (oldImageUrl && oldImageUrl.includes('/images/')) {
            const filename = oldImageUrl.split('/images/')[1];

            fs.unlink(`images/${filename}`, (error) => {
              if (error) {
                console.error('Erreur suppression ancienne image :', error);
              }
            });
          }

          res.status(200).json({ message: 'Livre modifié !' });
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      if (book.userId.toString() !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée !' });
      }

      // Vérification que l'image est hébergée sur notre serveur
      if (!book.imageUrl.includes('/images/')) {
        return Book.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: 'Livre supprimé !' });
          })
          .catch(error => res.status(400).json({ error }));
      }

      // Récupération du nom du fichier image
      const filename = book.imageUrl.split('/images/')[1];

      // Suppression de l'image sur le serveur
      fs.unlink(`images/${filename}`, (error) => {
        if (error) {
          console.error('Erreur suppression image :', error);
          return res.status(500).json({ message: error.message });
        }

        // Suppression du livre dans MongoDB
        Book.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: 'Livre supprimé !' });
          })
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }
      res.status(200).json(book);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const rating = {
    userId: req.auth.userId,
    grade: req.body.rating
  };

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      if (typeof rating.grade !== 'number' || rating.grade < 0 || rating.grade > 5) {
        return res.status(400).json({ message: 'La note doit être un nombre entre 0 et 5 !' });
      }

      const alreadyRated = book.ratings.some(
        rating => rating.userId === req.auth.userId
      );

      if (alreadyRated) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre !' });
      }

      book.ratings.push(rating);

      // Calcul de la moyenne des notes
      const totalRatings = book.ratings.reduce(
        (total, rating) => total + rating.grade,
        0
      );

      book.averageRating = totalRatings / book.ratings.length;

      book.save()
        .then(() => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};