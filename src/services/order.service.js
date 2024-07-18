const { Sequelize } = require('sequelize');
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

                if (detail.OrderDetailToppings && detail.OrderDetailToppings.length > 0) {
                    for (let topping of detail.OrderDetailToppings) {
                        await OrderDetailTopping.create({
                            orderDetailId: orderDetail.id,
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


    async updateOrder(orderId, orderData) {
        const transaction = await sequelize.transaction();
        try {
            const { totalPrice, note, orderDetails } = orderData;

            // Tìm và cập nhật thông tin đơn hàng
            const order = await Order.findByPk(orderId, { transaction });
            if (!order) {
                throw new Error('Order not found');
            }

            await order.update({ totalPrice, note }, { transaction });

            // Xóa các chi tiết đơn hàng hiện tại và các topping liên quan
            const currentOrderDetails = await OrderDetail.findAll({ where: { orderId: order.id }, transaction });
            for (let detail of currentOrderDetails) {
                await OrderDetailTopping.destroy({ where: { orderDetailId: detail.id }, transaction });
                await detail.destroy({ transaction });
            }

            // Tạo lại các chi tiết đơn hàng và topping mới
            for (let detail of orderDetails) {
                const orderDetail = await OrderDetail.create({
                    orderId: order.id,
                    productId: detail.productId,
                    name: detail.name,
                    basePrice: detail.basePrice,
                    quantity: detail.quantity
                }, { transaction });

                if (detail.OrderDetailToppings && detail.OrderDetailToppings.length > 0) {
                    for (let topping of detail.OrderDetailToppings) {
                        await OrderDetailTopping.create({
                            orderDetailId: orderDetail.id,  // Correct field name
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
            throw new Error(`Error updating order: ${error.message}`);
        }
    }


    async getOrders() {
        try {
            const orders = await Order.findAll({
                include: [{
                    model: OrderDetail,
                    include: [{
                        model: OrderDetailTopping,
                    }]
                }]
            });
            return orders;
        } catch (error) {
            throw new Error(`Error fetching order: ${error.message}`);
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


    async deleteOrder(orderId) {
        const transaction = await sequelize.transaction();
        try {

            await OrderDetailTopping.destroy({
                where: {
                    orderDetailId: {
                        [Sequelize.Op.in]: Sequelize.literal(`(SELECT id FROM order_details WHERE orderId = ${orderId})`)
                    }
                },
                transaction
            });


            await OrderDetail.destroy({
                where: { orderId },
                transaction
            });


            const result = await Order.destroy({
                where: { id: orderId },
                transaction
            });

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error deleting order: ${error.message}`);
        }
    }
}

module.exports = new OrderService();
