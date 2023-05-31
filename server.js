const express = require('express');
const app = express();
const authRoutes = require('./src/Routes/authRoutes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AdminRoute = require('./src/Routes/userRoutes');

// Middleware pour le traitement des données JSON
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb://root:rootpassword@192.168.136.7:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB', err));

// Routes d'authentification
app.use('/api/auth', authRoutes);

app.use('/api/Admins', AdminRoute);
// Démarrer le serveur
app.listen(8000, () => {
  console.log('Serveur démarré sur le port 3000');
});
