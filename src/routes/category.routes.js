const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/category.controller')


router.get('/getCategories', categoryController.getAllCategories);

router.post('/addCategory', categoryController.addCategory);

router.delete('/deleteCategory/:id', categoryController.deleteCategory);

router.put('/updateCategory/:id', categoryController.updateCategory);

router.get('/getCategory/:id', categoryController.getCategoryById);

router.get('/getCategories/name/:name', categoryController.getCategoryByName);

router.get('/getCategories/menu/:menuId', categoryController.getCategoryByMenuId);



module.exports = router;