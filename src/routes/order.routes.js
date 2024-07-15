const express = require("express");
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/createOrder', orderController.createOrder);

router.post('/createOrders', orderController.createOrders);

router.post('/createOrdersKiotviet', orderController.createOrdersKiotviet);

module.exports = router;