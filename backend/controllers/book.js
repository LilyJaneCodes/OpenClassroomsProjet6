const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body,
    userId: req.auth.userId
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};


exports.modifyBook = (req, res, next) => {
  const bookObject = { ...req.body };
  delete bookObject._id;
  delete bookObject.userId;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      if (book.userId.toString() !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée !' });
      }

      Book.updateOne(
        { _id: req.params.id },
        { $set: bookObject }
      )
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
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

      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(400).json({ error }));
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