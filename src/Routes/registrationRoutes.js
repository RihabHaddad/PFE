const express = require('express');
const registrationController = require('../Controllers/RegistrationCard');

const router = express.Router();

router.post('/addcar', registrationController.createNewRegistration);
router.get('/', registrationController.getAllRegistration);
router.put('/updatecar/:id', registrationController.updateRegistration);
router.post('/deletecar/:id', registrationController.deleteRegistration);
router.delete('/:id', registrationController.findRegistrationById);

module.exports = router;
