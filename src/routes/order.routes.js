const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/order', orderController.createOrder);

router.get('/orders/:orderId', orderController.getOrderById);

router.get('/orders', orderController.getOrders);

router.delete('/orders/:orderId', orderController.deleteOrder);

router.put('/orders/:orderId', orderController.updateOrder);

module.exports = router;
