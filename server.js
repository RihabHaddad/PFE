const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./src/Routes/authRoutes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AdminRoute = require('./src/Routes/userRoutes');
const PassRoutes = require('./src/Routes/passRoutes');
const AssureRoutes = require('./src/Routes/assureRoutes');
const RegistrationcarRoutes = require('./src/Routes/registrationRoutes');
const User = require('./src/Models/userModel');


// Middleware pour le traitement des données JSON
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {

  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
})
mongoose.connect('mongodb://root:rootpassword@192.168.136.7:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB', err));

// Routes d'authentification
app.use('/api/auth', authRoutes);
app.use('/api/car', RegistrationcarRoutes)
app.use('/api/Admins', AdminRoute);
app.use('/', PassRoutes);
app.use('/api/assures', AssureRoutes);

app.get('/search', (req, res) => {
  const searchTerm = req.query.username;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Veuillez fournir un terme de recherche valide' });
  }

  User.find({
    $or: [
      { firstName: { $regex: new RegExp(searchTerm, 'i') } },
      { lastName: { $regex: new RegExp(searchTerm, 'i') } },
      { email: { $regex: new RegExp(searchTerm, 'i') } }
    ]
  })
    .then(users => {
      if (users.length === 0) {
        return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
      }
      res.json(users);
    })
    .catch(error => res.status(500).json({ message: 'Une erreur est survenue lors de la recherche des utilisateurs', error }));
});




// Démarrer le serveur
app.listen(8002, () => {
  console.log('Serveur démarré sur le port 8002');
});
