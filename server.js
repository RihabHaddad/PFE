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
const DriveKPI = require('./src/Models/DriverkpiModel');
const http = require('http');


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
app.get('/kpi/:driverId', async (req, res) => {
  try {
    const driverId = req.params.driverId;
    console.log('Requested driverId:', driverId);

    // Utilisez le modèle DriveKPI pour récupérer les KPI du driver
    console.log('Fetching driver KPIs...');
    const driverKPIs = await DriveKPI.find({ DriverId: driverId });
    console.log('Driver KPIs:', driverKPIs);

    res.status(200).json(driverKPIs);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des KPI du driver.' });
  }
});

    
 

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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
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

const Kafka = require('node-rdkafka');



app.get('/api/latestSpeedData', (req, res) => {
    // Get the latest speed and time from the arrays
    const latestSpeed = speedData.length > 0 ? speedData[speedData.length - 1] : 0;
    const latestTime = timeData.length > 0 ? new Date(timeData[timeData.length - 1]) : new Date();

    res.json({
        time: latestTime,
        speed: latestSpeed
    });
});

//kafka

const kafkaConf = {
  'group.id': 'my-consumer-group',
  'metadata.broker.list': '192.168.136.6:9092'
};

const topicName = 'rawdata';

const consumer = new Kafka.KafkaConsumer(kafkaConf, {});

consumer.connect();

let driver1SpeedData = []; // Array to store speed data for DriverId 1
let driver1TimeData = [];  // Array to store time data for DriverId 1

consumer.on('ready', () => {
  consumer.subscribe([topicName]);
  consumer.consume();
});

consumer.on('data', (message) => {
  const messageValue = message.value.toString();
  console.log(`Message received: ${messageValue}`);

  // Parse the messageValue and extract relevant data
  const data = JSON.parse(messageValue);
  console.log('Parsed data:', data);

  const currentTime = new Date(data.time).getTime(); // Convert time to milliseconds
  const currentSpeed = parseFloat(data.SPEED);
  const driverId = data.DriverId;

  // Check if the DriverId matches the desired value (1)
  if (driverId === "1") {
      // Add data to arrays for DriverId 1
      driver1SpeedData.push(currentSpeed);
      driver1TimeData.push(currentTime);
  }
});

app.get('/api/driver1Data', (req, res) => {
  // Convert driver1TimeData to an array of formatted date strings
  const formattedDriver1TimeData = driver1TimeData.map(time => new Date(time).toLocaleString());

  // Return the arrays of driver1SpeedData and formattedDriver1TimeData
  res.json({
      speedData: driver1SpeedData,
      timeData: formattedDriver1TimeData
  });
});


//kafka notif 


consumer.connect();

const sseConnections = new Map();



consumer.on('data', (message) => {
    const messageValue = message.value.toString();
    const data = JSON.parse(messageValue);

    const currentSpeed = parseFloat(data.SPEED);
    const driverId = data.DriverId;

    if (currentSpeed > 100) {
        const notification = {
            driverId,
            speed: currentSpeed,
            message: `Driver ${driverId} has exceeded the speed limit with a speed of ${currentSpeed} km/h`
        };

        const sseResponse = `data: ${JSON.stringify(notification)}\n\n`;
        if (sseConnections.has(driverId)) {
            sseConnections.get(driverId).forEach(connection => {
                connection.write(sseResponse);
            });
        }
    }
});

app.use(express.static(__dirname + '/public'));

app.get('/sse/:driverId', (req, res) => {
    const driverId = req.params.driverId;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*' // Allow CORS
    });

    if (!sseConnections.has(driverId)) {
        sseConnections.set(driverId, []);
    }
    
    sseConnections.get(driverId).push(res);

    req.on('close', () => {
        const connections = sseConnections.get(driverId);
        const index = connections.indexOf(res);
        if (index !== -1) {
            connections.splice(index, 1);
            if (connections.length === 0) {
                sseConnections.delete(driverId);
            }
        }
    });
});
//map
const driverLocations = new Map();
consumer.on('data', (message) => {
  const messageValue = message.value.toString();
  const data = JSON.parse(messageValue);

  const driverId = data.DriverId;
  const latitude = parseFloat(data.Latitude);
  const longitude = parseFloat(data.Longitude);

  // Mettez à jour la localisation du conducteur dans la Map
  driverLocations.set(driverId, { latitude, longitude });
});

app.get('/api/drivers', (req, res) => {
  const driversArray = Array.from(driverLocations, ([driverId, location]) => ({ driverId, ...location }));
  res.json(driversArray);
});





app.get('/api/total-distance/:driverId', async (req, res) => {
const mongoURI = 'mongodb://root:rootpassword@192.168.136.7:27017/';
const mongoDB = 'PFE';
const mongoTotalCollection = 'TotalDistance';
  const driverId = req.params.driverId;

  const client = new MongoClient(mongoURI);
  await client.connect();
  const db = client.db(mongoDB);
  const totalCollection = db.collection(mongoTotalCollection);

  try {
    const result = await totalCollection.findOne({ 'DriverId': driverId });
    res.json(result ? result.TotalDistance : 0);
  } catch (error) {
    console.error('Failed to fetch total distance:', error);
    res.status(500).json({ error: 'Failed to fetch total distance' });
  } finally {
    client.close();
  }
});
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
