const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/category.controller')


router.get('/getCategories', categoryController.getAllCategorise);

router.post('/addCategory', categoryController.addCategory);

router.delete('/deleteCategory/:id', categoryController.deleteCategory);

module.exports = router;