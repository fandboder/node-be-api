const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.get('/getProducts', productController.getProducts);

router.post('/createProduct', productController.createProduct);

router.delete('/deleteProduct/:id', productController.deleteProduct);

router.delete('/deleteProductKiotviet/:id', productController.deleteProductKiotviet);

router.put('/updateProduct/:id', productController.updateProduct);

router.get('/getProduct/:id', productController.getProductById);

router.get('/getProducts/category/:categoryId', productController.getProductsByCategory);

router.get('/getProducts/name/:name', productController.getProductByName);

router.get('/getProductsKiotviet', productController.getProductsKiotviet);

router.post('/createProductKiotviet', productController.createProductKiotviet);

module.exports = router;
