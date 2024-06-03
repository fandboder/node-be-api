const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.get('/getProducts', productController.getAllProducts);

router.post('/addProduct', productController.createProduct);

router.delete('/deleteProduct/:id', productController.deleteProduct);

router.put('/updateProduct/:id', productController.updateProduct);

module.exports = router;
