const Order = require('../models/order.model');
const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
dotenv.config();

const apiUrl = 'https://publicfnb.kiotapi.com/orders';

class OrderService {
    async createOrder(orderData) {
        try {
            const { productId, price, quantity, note } = orderData;

            const order = await Order.create({
                productId,
                price,
                quantity,
                note
            });

            return order;
        } catch (error) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }

    async createOrders(ordersData) {
        const createdOrders = [];
        for (let orderData of ordersData) {
            try {
                const createdOrder = await this.createOrder(orderData);
                createdOrders.push(createdOrder);
            } catch (error) {
                console.error(`Error creating order: ${error.message}`);
            }
        }
        return createdOrders;
    }

    async createOrdersKiotviet(ordersKiotvetData) {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.post(apiUrl, ordersKiotvetData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new OrderService();