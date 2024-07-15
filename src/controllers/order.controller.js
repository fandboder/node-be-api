const OrderService = require('../services/order.service');

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await OrderService.createOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ error: error.message });
    }
}

exports.createOrders = async (req, res) => {
    try {
        const ordersData = req.body;
        const createOrders = await OrderService.createOrders(ordersData);
        res.status(201).json(createOrders);
    } catch (error) {
        console.error('Error creating multiple orders:', error);
        res.status(400).json({ error: error.message });
    }
}


exports.createOrdersKiotviet = async (req, res) => {
    try {
        const order = await OrderService.createOrdersKiotviet(req.body);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
}