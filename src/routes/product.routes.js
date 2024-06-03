const exports = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

//Route to get all products
router.get('/products', productController.getAllProducts);


module.exports = router;
