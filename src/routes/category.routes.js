const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/category.controller')


router.get('/getCategories', categoryController.getCategories);

router.get('/getCategories/:id', categoryController.getCategoryById);

router.post('/createCategory', categoryController.createCategory);

router.delete('/deleteCategory/:id', categoryController.deleteCategory);

router.put('/updateCategory/:id', categoryController.updateCategory);

router.get('/getCategories/name/:name', categoryController.getCategoryByName);

router.get('/getCategories/menu/:menuId', categoryController.getCategoryByMenuId);

router.get('/getCategoriesKyotviet', categoryController.getCategoriesKyotviet);

router.post('/createCategoryKyotviet', categoryController.createCategoryKyotviet);




module.exports = router;