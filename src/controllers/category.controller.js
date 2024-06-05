const Category = require('../models/categoty.model')

// Retrieve all categories
exports.getAllCategorise = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Error while getting categories:', error);
        res.status(500).json({ error: 'Error while getting categories' });
    }
}

// Add a new category
exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(201).json({ message: 'Category added seccessfully', category: newCategory });
    } catch (error) {
        console.error('Error while adding category: ', error);
        res.status(500).json({ error: 'Error while adding category' });
    }
}

//Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const result = await Category.destroy({ where: { category_id: categoryId } });
        if (result === 0) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json({ message: 'Category deleted successfully' });
        }
    } catch (error) {
        console.error('Error while deleting category: ', error);
        res.status(500).json({ error: 'Error while deleting category' });
    }
};

//Update a category
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;

        const [updated] = await Category.update({ name }, { where: { category_id: categoryId } });

        if (updated) {
            const updatedCategory = await Category.findOne({ where: { category_id: categoryId } });
            res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        console.error('Error while updating category: ', error);
        res.status(500).json({ error: 'Error while updating category' });
    }
};