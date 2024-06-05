const Category = require('../models/categoty.model')

exports.getAllCategories = async () => {
    try {
        const categories = await Category.findAll();
        return categories;
    } catch (error) {
        console.error('Error while getting categories:', error);
        throw new Error('Error while getting categories');
    }
}