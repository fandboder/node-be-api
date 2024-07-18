const Order = require('../models/order.model');
const OrderDetail = require('../models/orderDetail.model');
const OrderDetailTopping = require('../models/orderDetailTopping.model');
const { sequelize } = require('../config/database');
const moment = require('moment-timezone');

class OrderService {
    async createOrder(orderData) {
        const transaction = await sequelize.transaction();
        try {
            const { totalPrice, note, orderDetails } = orderData;

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
            const orderDate = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const order = await Order.create({
                orderDate,
                totalPrice,
                note
            }, { transaction });


            for (let detail of orderDetails) {
                const orderDetail = await OrderDetail.create({
                    orderId: order.id,
                    productId: detail.productId,
                    name: detail.name,
                    basePrice: detail.basePrice,
                    quantity: detail.quantity
                }, { transaction });


                if (detail.toppings && detail.toppings.length > 0) {
                    for (let topping of detail.toppings) {
                        await OrderDetailTopping.create({
                            orderId: orderDetail.id,
                            toppingId: topping.toppingId,
                            name: topping.name,
                            basePrice: topping.basePrice,
                            quantity: topping.quantity
                        }, { transaction });
                    }
                }
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error creating order: ${error.message}`);
        }
    }


    async getOrderById(orderId) {
        try {
            const order = await Order.findOne({
                where: { id: orderId },
                include: [{
                    model: OrderDetail,
                    include: [{
                        model: OrderDetailTopping,
                    }]
                }]
            });
            return order;
        } catch (error) {
            throw new Error(`Error fetching order: ${error.message}`);
        }
    }
}

module.exports = new OrderService();
