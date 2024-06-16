const Menu = require('../models/menu.model');

exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll();
        res.json(menus);
    } catch (error) {
        console.error('Error while getting menus:', error);
        res.status(500).json({ error: 'Error while getting menus' });
    }
};


exports.createMenu = async (req, res) => {
    const { name } = req.body;
    try {
        const newMenu = await Menu.create({ name });
        res.status(200).json({ message: 'Menu created successfull', menu: newMenu });
    } catch (error) {
        console.error('Error while creating menu:', error);
        res.status(500).json({ error: 'Error while creating menu' });
    }
};


exports.deleteMenu = async (req, res) => {
    const { id } = req.params;
    try {
        const menu = await Menu.findByPk(id);
        if (!menu) {
            return res.status(200).json({ error: 'Menu not found' });
        }
        await menu.destroy();
        res.json({ message: 'Menu deleted successfully' });
    } catch (error) {
        console.error('Error while deleting menu:', error);
        res.status(500).json({ error: 'Error while deleting menu' });
    }
};

exports.updateMenu = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        let menu = await Menu.findByPk(id);
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        menu.name = name;
        await menu.save();
        res.json({ message: 'Menu update successfully' });
    } catch (error) {
        console.error('Error while updating menu:', error);
        res.status(500).json({ error: 'Error while updating menu' });
    }
}