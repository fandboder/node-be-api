const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.get('/accounts', accountController.getAllAccounts);

router.post('/account', accountController.addAccount);

router.delete('/account/:id', accountController.deleteAccount);

router.put('/account/:id', accountController.updateAccount);

router.post('/login', accountController.login);

router.get('/account/:id', accountController.getAccountById);

router.get('/accounts/username/:username', accountController.getAccountsByUsername);

module.exports = router;