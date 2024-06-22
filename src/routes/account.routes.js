const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.get('/getAccounts', accountController.getAllAccounts);

router.post('/addAccount', accountController.addAccount);

router.delete('/deleteAccount/:id', accountController.deleteAccount);

router.put('/updateAccount/:id', accountController.updateAccount);

router.post('/login', accountController.login);

router.get('/getAccount/:id', accountController.getAccountById);

module.exports = router;