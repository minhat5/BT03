const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../services/cartService');

const getCartController = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getCart(userId);
        return res.status(200).json({
            message: 'Cart retrieved successfully',
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving cart',
            error: error.message
        });
    }
};

const addToCartController = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity) {
            return res.status(400).json({
                message: 'productId and quantity are required'
            });
        }

        const result = await addToCart(userId, productId, parseInt(quantity));
        return res.status(200).json({
            message: 'Item added to cart successfully',
            data: result.cart
        });
    } catch (error) {
        console.error('Error in addToCartController:', error);
        return res.status(500).json({
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

const updateCartItemController = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        if (!quantity) {
            return res.status(400).json({
                message: 'quantity is required'
            });
        }

        const result = await updateCartItem(userId, cartItemId, parseInt(quantity));
        return res.status(200).json({
            message: 'Cart item updated successfully',
            data: result.cart
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating cart item',
            error: error.message
        });
    }
};

const removeFromCartController = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.user.id;

        const result = await removeFromCart(userId, cartItemId);
        return res.status(200).json({
            message: 'Item removed from cart successfully',
            data: result.cart
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error removing item from cart',
            error: error.message
        });
    }
};

const clearCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await clearCart(userId);
        return res.status(200).json({
            message: 'Cart cleared successfully',
            data: result.cart
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error clearing cart',
            error: error.message
        });
    }
};

module.exports = {
    getCartController,
    addToCartController,
    updateCartItemController,
    removeFromCartController,
    clearCartController
};
