const Account = require('../models/account.model');
const jwt = require('jsonwebtoken')

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
        res.status(201).json({ message: 'Add account success', account: newAccount });
    } catch (error) {
        console.error('Error while adding account: ', error);
        res.status(404).json({ error: 'Error while adding account' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteAccount = await Account.destroy({ where: { id: id } });
        if (deleteAccount) {
            res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        console.error('Error while deleting account: ', error);
        res.status(500).json({ error: 'Error while deleting account' });
    }
};

exports.updateAccount = async (req, res) => {
    const accountId = req.params.id;
    const { username, password, position } = req.body;

    try {
        const updatedAccount = await Account.update(
            { username, password, position },
            { where: { id: accountId } }
        );

        if (updatedAccount[0] === 1) {
            res.status(200).json({ message: 'Account updated successfully' });
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const account = await Account.findOne({ where: { username: username } });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        if (password !== account.password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        const token = jwt.sign(
            { id: account.id, username: account.username, position: account.position },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
        console.error('Error while logging in: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};