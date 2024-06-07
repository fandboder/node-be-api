const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.get('/getAccounts', accountController.getAllAccounts);

module.exports = router;