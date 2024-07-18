const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/createOrder', orderController.createOrder);

router.get('/orders/:orderId', orderController.getOrderById);

router.get('/orders', orderController.getOrders);

router.delete('/orders/:orderId', orderController.deleteOrder);

module.exports = router;
