const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccidentSchema = new Schema({

  DriverId: {
    type: String,
    required: true
  },  

  Localisation: {
    lat: Number,
    lng: Number,
    alt: Number
  },

  Damage: {
    type: Boolean,
    required: true
  },
  Date: {
    type: Date,
    required: true
  }
});



const Accident = mongoose.model('Accident', AccidentSchema);
module.exports = Accident;

