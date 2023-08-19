const mongoose = require('mongoose');

exports.createNewAccident = async (req, res, next) => {
    console.log(req.params);
    console.log(req.body);
  try {
    const AccidentObj = new Accident(req.body);
    const result = await AccidentObj.save();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    if (error.name === 'ValidationError') {
      next(createError(422, error.message));
      return;
    }
    next(error);
  }
},
exports.getAccidentInfoByDeviceIdAndDate = async (req, res, next) => {

    try {
      const id = req.params.DriverId;
      const results = await Accident.find({"DriverID": id });
      console.log(id);
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },
  exports.getAllAccidents= async (req, res, next) => {
    try {
      const results = await Accident.find({}, { __v: 0 });
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
    
  },
 

  exports.findNumberAccidentByDeviceId = async (req, res, next) => {
    const id = req.params.DriverId;
    console.log(id);
    try {
      const accident = await Accident.countDocuments({DriverId:id});
      if (!accident) {
        throw createError(404, 'accident does not exist.');
      }
      else {
        res.json(accident);
      }
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid accident/DriverId'));
        return;
      }
      next(error);
    }

  }

  const getTotalAssures = async () => {
    try {
      const countResult = await Assure.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
          },
        },
      ]);
  
      if (countResult.length > 0) {
        const totalAssures = countResult[0].total;
        console.log('Total assures:', totalAssures);
        return totalAssures;
      } else {
        console.log('No assures found.');
        return 0;
      }
    } catch (error) {
      console.error('Error while fetching total assures:', error);
      return 0;
    }
  };
  
  module.exports = {
    getTotalAssures,
  };