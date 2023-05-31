const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');

router.get('/', UserController.getAllAdmins);
router.put('/updateuser/:id', UserController.updateAdmin);
router.delete('/deleteuser/:id', UserController.deleteAdmin);

module.exports = router;
