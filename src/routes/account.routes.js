const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.get('/getAccounts', accountController.getAllAccounts);

router.post('/addAccount', accountController.addAccount);

module.exports = router;