const { Order, OrderItem, OrderStatusHistory, ORDER_STATUS } = require('../models/order');
const { Cart, CartItem } = require('../models/cart');
const Product = require('../models/product');
const { sequelize } = require('../config/database');

// Generate unique order code
const generateOrderCode = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD${timestamp}${random}`.slice(0, 20);
};

// Create order from cart (COD payment)
const createOrder = async (userId, shippingData) => {
    const transaction = await sequelize.transaction();
    try {
        const { shippingAddress, recipientName, recipientPhone, notes } = shippingData;

        // Validate required fields
        if (!shippingAddress || !recipientName || !recipientPhone) {
            throw new Error('Shipping address, recipient name and phone are required');
        }

        // Get user's cart
        const cart = await Cart.findOne({
            where: { userId },
            include: {
                association: 'items',
                include: {
                    association: 'product'
                }
            }
        }, { transaction });

        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Verify all products have sufficient stock
        for (const cartItem of cart.items) {
            if (cartItem.product.stock < cartItem.quantity) {
                throw new Error(`Insufficient stock for ${cartItem.product.name}`);
            }
        }

        // Create order
        const orderCode = generateOrderCode();
        const order = await Order.create({
            orderCode,
            userId,
            totalPrice: cart.totalPrice,
            totalItems: cart.totalItems,
            status: ORDER_STATUS.NEW,
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            shippingAddress,
            recipientName,
            recipientPhone,
            notes: notes || ''
        }, { transaction });

        // Create order items and update product stock
        for (const cartItem of cart.items) {
            await OrderItem.create({
                orderId: order.id,
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                price: cartItem.price,
                totalPrice: cartItem.totalPrice
            }, { transaction });

            // Update product stock and sold count
            const product = cartItem.product;
            product.stock -= cartItem.quantity;
            product.sold += cartItem.quantity;
            await product.save({ transaction });
        }

        // Create initial status history
        await OrderStatusHistory.create({
            orderId: order.id,
            status: ORDER_STATUS.NEW,
            notes: 'Order placed successfully'
        }, { transaction });

        // Clear cart
        await CartItem.destroy(
            { where: { cartId: cart.id } },
            { transaction }
        );

        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save({ transaction });

        // Schedule automatic confirmation after 30 minutes
        scheduleAutoConfirmation(order.id);

        await transaction.commit();

        // Fetch complete order with all associations
        const completeOrder = await getOrderById(userId, order.id);
        return { success: true, order: completeOrder };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get user's orders
const getOrders = async (userId, limit = 10, offset = 0) => {
    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    association: 'items',
                    include: {
                        association: 'product',
                        attributes: ['id', 'name', 'price', 'images']
                    }
                },
                {
                    association: 'statusHistory',
                    order: [['createdAt', 'DESC']]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const total = await Order.count({ where: { userId } });

        return { orders, total };
    } catch (error) {
        throw error;
    }
};

// Get order details
const getOrderById = async (userId, orderId) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId, userId },
            include: [
                {
                    association: 'items',
                    include: {
                        association: 'product',
                        attributes: ['id', 'name', 'price', 'images']
                    }
                },
                {
                    association: 'statusHistory',
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!order) {
            throw new Error('Order not found');
        }

        return order;
    } catch (error) {
        throw error;
    }
};

// Get order status history
const getOrderStatusHistory = async (userId, orderId) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            throw new Error('Order not found');
        }

        const statusHistory = await OrderStatusHistory.findAll({
            where: { orderId },
            order: [['createdAt', 'DESC']]
        });

        return statusHistory;
    } catch (error) {
        throw error;
    }
};

// Update order status (admin/system function)
const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    const transaction = await sequelize.transaction();
    try {
        const order = await Order.findByPk(orderId, { transaction });
        if (!order) {
            throw new Error('Order not found');
        }

        const oldStatus = order.status;
        order.status = newStatus;

        // Set appropriate timestamps
        if (newStatus === ORDER_STATUS.CONFIRMED) {
            order.confirmedAt = new Date();
        } else if (newStatus === ORDER_STATUS.SHIPPING) {
            order.shippedAt = new Date();
        } else if (newStatus === ORDER_STATUS.DELIVERED) {
            order.deliveredAt = new Date();
        } else if (newStatus === ORDER_STATUS.CANCELLED) {
            order.cancelledAt = new Date();
        }

        await order.save({ transaction });

        // Record status change in history
        await OrderStatusHistory.create({
            orderId,
            status: newStatus,
            notes
        }, { transaction });

        await transaction.commit();

        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Request order cancellation
const requestCancellation = async (userId, orderId, reason) => {
    const transaction = await sequelize.transaction();
    try {
        const order = await Order.findOne({
            where: { id: orderId, userId }
        }, { transaction });

        if (!order) {
            throw new Error('Order not found');
        }

        // Check if cancellation is allowed
        const createdAt = new Date(order.createdAt);
        const now = new Date();
        const minutesElapsed = (now - createdAt) / (1000 * 60);

        // Can only cancel within 30 minutes if status is NEW or CONFIRMED
        if (minutesElapsed > 30 && (order.status === ORDER_STATUS.NEW || order.status === ORDER_STATUS.CONFIRMED)) {
            throw new Error('Cancellation window has expired (30 minutes)');
        }

        // If already being prepared or later, can only request cancellation
        if (order.status === ORDER_STATUS.PREPARING) {
            order.status = ORDER_STATUS.CANCEL_REQUESTED;
            order.cancellationReason = reason;
            order.cancellationRequestedAt = new Date();
        } else if (order.status === ORDER_STATUS.NEW || order.status === ORDER_STATUS.CONFIRMED) {
            // Direct cancellation for new/confirmed orders
            order.status = ORDER_STATUS.CANCELLED;
            order.cancellationReason = reason;
            order.cancelledAt = new Date();

            // Restore product stock
            const orderItems = await OrderItem.findAll({
                where: { orderId: order.id }
            }, { transaction });

            for (const item of orderItems) {
                const product = await Product.findByPk(item.productId, { transaction });
                if (product) {
                    product.stock += item.quantity;
                    product.sold -= item.quantity;
                    await product.save({ transaction });
                }
            }
        } else {
            throw new Error(`Cannot cancel order in status: ${order.status}`);
        }

        await order.save({ transaction });

        await OrderStatusHistory.create({
            orderId,
            status: order.status,
            notes: `Cancellation requested: ${reason}`
        }, { transaction });

        await transaction.commit();

        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Auto-confirm order after 30 minutes
const scheduleAutoConfirmation = (orderId) => {
    setTimeout(async () => {
        try {
            const order = await Order.findByPk(orderId);
            if (order && order.status === ORDER_STATUS.NEW) {
                await updateOrderStatus(orderId, ORDER_STATUS.CONFIRMED, 'Auto-confirmed after 30 minutes');
                console.log(`Order ${orderId} auto-confirmed`);
            }
        } catch (error) {
            console.error(`Error auto-confirming order ${orderId}:`, error);
        }
    }, 30 * 60 * 1000); // 30 minutes
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    getOrderStatusHistory,
    updateOrderStatus,
    requestCancellation,
    ORDER_STATUS
};
