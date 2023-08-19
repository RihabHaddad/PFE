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
const MongoClient = require('mongodb').MongoClient;

// Middleware pour le traitement des données JSON
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
  // ... (configuration CORS)
  next();
});

// Connexion à la base de données MongoDB
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
app.get('/calculateTotalUsers', async (req, res) => {
  try {
    const totalUsers = await calculateTotalUsersFromDatabase();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Une erreur s\'est produite lors du calcul du nombre total d\'utilisateurs :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors du calcul du nombre total d\'utilisateurs.' });
  }
});
app.get('/calculateCarsByBrand', async (req, res) => {
  try {
    const result = await calculateCarsByBrand();
    res.status(200).json(result);
  } catch (error) {
    console.error('Une erreur s\'est produite lors du calcul du nombre de voitures par marque :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors du calcul du nombre de voitures par marque.' });
  }
});
async function calculateCarsByBrand() {
  const url =  'mongodb://root:rootpassword@192.168.136.7:27017/';
  const dbName = 'test';
  const collectionName = 'registrationcards';

  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const pipeline = [
      {
        $group: {
          _id: '$Marque',
          totalCars: { $sum: 1 }
        }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();

    client.close();

    return result;
  } catch (error) {
    console.error('Erreur lors du calcul du nombre de voitures par marque :', error);
    throw error;
  }
}
// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  logger.error('Error middleware:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Fonction pour calculer le nombre total d'utilisateurs à partir de la base de données
async function calculateTotalUsersFromDatabase() {
  const url = 'mongodb://root:rootpassword@192.168.136.7:27017/';
  const dbName = 'test';
  const collectionName = 'users';

  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const totalUsers = await collection.countDocuments({});
    
    client.close();

    return totalUsers;
  } catch (error) {
    console.error('Erreur lors du calcul du nombre d\'utilisateurs :', error);
    throw error;
  }
}

// Démarrer le serveur
app.listen(8002, async () => {
  console.log('Serveur démarré sur le port 8002');
  
  try {
    const totalUsers = await calculateTotalUsersFromDatabase();
    console.log(`Le nombre total d'utilisateurs est : ${totalUsers}`);
  } catch (error) {
    console.error('Une erreur s\'est produite lors du calcul du nombre total d\'utilisateurs :', error);
  }
});
