const { createOrder, getOrders, getOrderById, getOrderStatusHistory, requestCancellation } = require('../services/orderService');

// Create order (checkout)
const createOrderController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress, recipientName, recipientPhone, notes } = req.body;

        const result = await createOrder(userId, {
            shippingAddress,
            recipientName,
            recipientPhone,
            notes
        });

        return res.status(201).json({
            message: 'Order created successfully',
            data: result.order
        });
    } catch (error) {
        console.error('Error in createOrderController:', error);
        return res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get user's orders
const getOrdersController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, offset = 0 } = req.query;

        const result = await getOrders(userId, parseInt(limit), parseInt(offset));

        return res.status(200).json({
            message: 'Orders retrieved successfully',
            data: result.orders,
            total: result.total
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving orders',
            error: error.message
        });
    }
};

// Get order by ID
const getOrderByIdController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        const order = await getOrderById(userId, orderId);

        return res.status(200).json({
            message: 'Order retrieved successfully',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving order',
            error: error.message
        });
    }
};

// Get order status history
const getOrderStatusHistoryController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        const history = await getOrderStatusHistory(userId, orderId);

        return res.status(200).json({
            message: 'Order status history retrieved successfully',
            data: history
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving order status history',
            error: error.message
        });
    }
};

// Request order cancellation
const requestCancellationController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                message: 'Cancellation reason is required'
            });
        }

        const order = await requestCancellation(userId, orderId, reason);

        return res.status(200).json({
            message: 'Order cancellation processed',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error requesting cancellation',
            error: error.message
        });
    }
};

module.exports = {
    createOrderController,
    getOrdersController,
    getOrderByIdController,
    getOrderStatusHistoryController,
    requestCancellationController
};
