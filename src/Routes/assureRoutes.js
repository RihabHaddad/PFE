const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const assureController = require('../Controllers/AssureController');
router.post('/addassure', assureController.createAssure);
router.get('/', assureController.getAllAssure);
router.put('/updateAssure/:id', assureController.updateAssure);
router.delete('/deleteassure/:id', assureController.deleteAssure);
router.get('/:id', assureController.getAssureById);

  



module.exports = router;
