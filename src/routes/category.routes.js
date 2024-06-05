const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/category.controller')

router.get('/getCategories', categoryController.getAllCategorise);

module.exports = router;