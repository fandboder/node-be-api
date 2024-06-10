const Account = require('../models/account.model');
const { trace } = require('../routes/account.routes');

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.json(accounts);
    } catch (error) {
        console.error('Error while getting accounts: ', error);
        res.status(500).json({ error: 'Error while getting accounts' });
    }
};

exports.addAccount = async (req, res) => {
    try {
        const { username, password, position } = req.body;
        const newAccount = await Account.create({ username, password, position });
        res.status(201).json({ message: 'Add account seccess', account: newAccount });
    } catch (error) {
        console.error('Error while adding account: ', error);
        res.status(404).json({ error: 'Error while adding account' });
    }
};

