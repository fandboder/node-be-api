const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/createOrder', orderController.createOrder);

router.get('/orders/:orderId', orderController.getOrderById);

module.exports = router;
