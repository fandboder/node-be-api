const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.get('/getProducts', productController.getAllProducts);

router.post('/addProduct', productController.createProduct);

router.delete('/deleteProduct/:id', productController.deleteProduct);

router.put('/updateProduct/:id', productController.updateProduct);

router.get('/getProducts/:id', productController.getProductById);

router.get('/getProducts/category/:categoryId', productController.getProductsByCategory);

router.get('/getProduct/:name', productController.getProductByName);
module.exports = router;
