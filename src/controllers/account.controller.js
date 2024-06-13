const Account = require('../models/account.model');

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
        const deleteAccount = await Account.destroy({ where: { account_id: id } });
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
            { where: { account_id: accountId } }
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
