const User = require('../Models/userModel');


exports.createAssure = async (req, res) => {
  try {
    const { username, firstName, lastName, email, phoneNumber, cin, drivingLicense } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'L\'utilisateur existe déjà' });
    }

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      cin,
      drivingLicense
    });

    const createdUser = await newUser.save();

    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
  }
};


exports.getAllAssure =  async (req, res, next) => {
  try {
    const results = await User.find({}, { __v: 0 });
    res.send(results);
  } catch (error) {
    console.log(error.message);
  }
},
exports.getAssureById = async (req, res) => {
  try {
    const assureId = req.params.id;

    // Rechercher l'assuré par ID dans la base de données
    const assure = await User.findById(assureId);

    if (!assure) {
      return res.status(404).json({ message: 'Assuré non trouvé.' });
    }

    res.status(200).json(assure);
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération de l\'assuré.' });
  }
};


exports.updateAssure = async (req, res) => {
  try {
    const assureId = req.params.id;
    const updates = req.body;

    // Mettre à jour l'assuré dans la base de données
    const updatedAssure = await Assure.findByIdAndUpdate(assureId, updates, { new: true });

    if (!updatedAssure) {
      return res.status(404).json({ message: 'Assuré non trouvé.' });
    }

    res.status(200).json(updatedAssure);
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour de l\'assuré.' });
  }
};
exports.deleteAssure = async (req, res) => {
  try {
    const assureId = req.params.id;
    const deletedAssure = await Assure.findByIdAndDelete(assureId);

    if (!deletedAssure) {
      return res.status(404).json({ message: 'Assuré non trouvé.' });
    }

    res.status(200).json({ message: 'Assuré supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'assuré.' });
  }
};
