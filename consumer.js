const Kafka = require('node-rdkafka');
const express = require('express');
const app = express();
const cors = require('cors');

// Utilisez CORS pour autoriser les requêtes de tous les domaines
app.use(cors());

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

app.listen(4000, () => {
    console.log('Server is listening on port 4000');
});
