const express = require("express");
const router = express.Router();
const toppingController = require('../controllers/topping.controller');

router.get('/getToppings', toppingController.getTopping);

router.get('/getToppings/:productId', toppingController.getToppingsByProductId);

router.delete('/deleteTopping/:productId', toppingController.deleteTopping);

module.exports = router;