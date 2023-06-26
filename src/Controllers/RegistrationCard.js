const mongoose = require('mongoose');
const RegistrationCard = require('../Models/registrationCardModel.js');

exports.createNewRegistration= async (req, res, next) => {
    try {
      const registration = new RegistrationCard(req.body);
      const result = await registration.save();
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
  
  exports.getAllRegistration=async (req, res, next) => {
    try {
      const registrations = await RegistrationCard.find({}, { __v: 0 });
      res.send(registrations);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  
  exports.findRegistrationById= async (req, res, next) => {
    const id = req.params.id;
    try {
      const registration = await RegistrationCard.findById(id);
      if (!registration) {
        throw createError(404, 'Registration does not exist.');
      }
      res.send(registration);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid registration id'));
        return;
      }
      next(error);
    }
  },
  
  exports.updateRegistration= async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
  
      const result = await RegistrationCard.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'Registration does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Registration Id'));
      }
      next(error);
    }
  },
  
  exports.deleteRegistration= async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await RegistrationCard.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, 'Registration does not exist in the collection');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Registration id'));
        return;
      }
      next(error);
    }
  },
  
  exports.getAllCardNumber= async (req, res, next) => {
    try {
      const cardNumbers = await RegistrationCard.distinct('DriverId');
      res.send(cardNumbers);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
  