const OrderService = require('../services/order.service');

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const order = await OrderService.createOrder(orderData);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ error: error.message });
    }
};




