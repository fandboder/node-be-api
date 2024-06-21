const Category = require('../models/categoty.model')

class CategoriesService {
  async getAllCategories() {
      const Categories = await Category.findAll();
      return Categories;
  }
}

module.exports = new CategoriesService();
