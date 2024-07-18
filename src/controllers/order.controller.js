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


exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(400).json({ error: error.message });
    }
};




