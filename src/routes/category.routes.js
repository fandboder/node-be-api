const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/category.controller')


router.get('/getCategories', categoryController.getAllCategories);

router.post('/addCategory', categoryController.addCategory);

router.delete('/deleteCategory/:id', categoryController.deleteCategory);

router.put('/updateCategory/:id', categoryController.updateCategory);


module.exports = router;