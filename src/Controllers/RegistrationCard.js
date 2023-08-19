const mongoose = require('mongoose');
const RegistrationCard = require('../Models/registrationCardModel.js');

exports.createNewRegistration = async (req, res) => {
  try {
    const cardData = req.body;

    const newCard = new RegistrationCard({
      vehicleNumber: cardData.vehicleNumber,
      ownerName: cardData.ownerName,
      registrationDate: cardData.registrationDate,
      expiryDate: cardData.expiryDate,
      NumContrat: cardData.NumContrat,
      DriverId: cardData.DriverId,
      NumImmatricule: cardData.NumImmatricule,
      NumSerie: cardData.NumSerie,
      ClassBonus: cardData.ClassBonus,
      Marque: cardData.Marque,
      Puissance: cardData.Puissance,
      NbrePlace: cardData.NbrePlace,
    });
    const savedCard = await newCard.save();

    res.status(201).json(savedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the registration card.' });
  }
};
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


exports.getvoitureparmarque = async (req, res) => {
  try {
    const carsCountByMarque = await RegistrationCard.aggregate([
      { $group: { _id: '$marque', count: { $sum: 1 } } },
      { $project: { marque: '$_id', count: 1, _id: 0 } }, // Rename _id to marque
    ]);
    res.json(carsCountByMarque);
  } catch (error) {
    console.error('Error while fetching car count by marque:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des voitures par marque.' });
  }
};

   
  }
    
    
    
    
  