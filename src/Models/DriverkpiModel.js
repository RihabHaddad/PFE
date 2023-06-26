const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriveKPISchema = new Schema({

  DriverId: {
    type: String
  },  
  MeanSpeed:{
    type: String
  },
  
  MaxSpeed:{
    type: String 
  },
  SPEED:{
    type: String 
  },
  EngineSpeed:{
    type: String 
  },
  StdSpeed:{
    type: String 
  },
  time:{
    type:String
  },
  HarshAcceleration:{
    type:String
  },

  HarshBraking:{
    type:String
  } ,

  NightDriving:{
    type:String
  }

});
const DriveKPI = mongoose.model('DriveKPI', DriveKPISchema);
module.exports = DriveKPI;

