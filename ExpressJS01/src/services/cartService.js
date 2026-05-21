const { Cart, CartItem } = require('../models/cart');
const Product = require('../models/product');
const { sequelize } = require('../config/database');

// Get user's cart with items
const getCart = async (userId) => {
    try {
        let cart = await Cart.findOne({
            where: { userId },
            include: {
                association: 'items',
                include: {
                    association: 'product',
                    attributes: ['id', 'name', 'price', 'discount', 'images', 'stock']
                }
            }
        });

        if (!cart) {
            cart = await Cart.create({ userId, totalItems: 0, totalPrice: 0 });
        }

        return cart;
    } catch (error) {
        throw error;
    }
};

// Add item to cart
const addToCart = async (userId, productId, quantity) => {
    const transaction = await sequelize.transaction();
    try {
        console.log('addToCart called with:', { userId, productId, quantity });
        
        // Verify product exists and has stock
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }

        // Get or create cart
        let cart = await Cart.findOne({ where: { userId } }, { transaction });
        if (!cart) {
            cart = await Cart.create(
                { userId, totalItems: 0, totalPrice: 0 },
                { transaction }
            );
        }

        // Check if item already exists in cart
        let cartItem = await CartItem.findOne(
            { where: { cartId: cart.id, productId } },
            { transaction }
        );

        const itemPrice = parseFloat(product.price) - (parseFloat(product.discount) || 0);

        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new Error(`Insufficient stock. Available: ${product.stock}`);
            }
            cartItem.quantity = newQuantity;
            cartItem.totalPrice = itemPrice * newQuantity;
        } else {
            // Create new cart item
            cartItem = await CartItem.create(
                {
                    cartId: cart.id,
                    productId,
                    quantity,
                    price: itemPrice,
                    totalPrice: itemPrice * quantity
                },
                { transaction }
            );
        }

        await cartItem.save({ transaction });

        // Update cart totals
        const items = await CartItem.findAll(
            { where: { cartId: cart.id } },
            { transaction }
        );

        let totalItems = 0;
        let totalPrice = 0;
        items.forEach(item => {
            totalItems += item.quantity;
            totalPrice += parseFloat(item.totalPrice);
        });

        cart.totalItems = totalItems;
        cart.totalPrice = totalPrice;
        await cart.save({ transaction });

        await transaction.commit();

        // Fetch cart with items to return complete data
        const updatedCart = await getCart(userId);
        return { success: true, cart: updatedCart };
    } catch (error) {
        await transaction.rollback();
        console.error('Error in addToCart service:', error);
        throw error;
    }
};

// Update cart item quantity
const updateCartItem = async (userId, cartItemId, quantity) => {
    const transaction = await sequelize.transaction();
    try {
        const cartItem = await CartItem.findByPk(cartItemId, { transaction });
        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        // Verify user owns this cart item
        const cart = await Cart.findByPk(cartItem.cartId, { transaction });
        if (cart.userId !== userId) {
            throw new Error('Unauthorized');
        }

        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        // Check stock
        const product = await Product.findByPk(cartItem.productId);
        if (product.stock < quantity) {
            throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }

        cartItem.quantity = quantity;
        cartItem.totalPrice = parseFloat(cartItem.price) * quantity;
        await cartItem.save({ transaction });

        // Update cart totals
        const items = await CartItem.findAll(
            { where: { cartId: cart.id } },
            { transaction }
        );

        let totalItems = 0;
        let totalPrice = 0;
        items.forEach(item => {
            totalItems += item.quantity;
            totalPrice += parseFloat(item.totalPrice);
        });

        cart.totalItems = totalItems;
        cart.totalPrice = totalPrice;
        await cart.save({ transaction });

        await transaction.commit();

        // Fetch cart with items to return complete data
        const updatedCart = await getCart(userId);
        return { success: true, cart: updatedCart };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Remove item from cart
const removeFromCart = async (userId, cartItemId) => {
    const transaction = await sequelize.transaction();
    try {
        const cartItem = await CartItem.findByPk(cartItemId, { transaction });
        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        const cart = await Cart.findByPk(cartItem.cartId, { transaction });
        if (cart.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await cartItem.destroy({ transaction });

        // Update cart totals
        const items = await CartItem.findAll(
            { where: { cartId: cart.id } },
            { transaction }
        );

        let totalItems = 0;
        let totalPrice = 0;
        items.forEach(item => {
            totalItems += item.quantity;
            totalPrice += parseFloat(item.totalPrice);
        });

        cart.totalItems = totalItems;
        cart.totalPrice = totalPrice;
        await cart.save({ transaction });

        await transaction.commit();

        // Fetch cart with items to return complete data
        const updatedCart = await getCart(userId);
        return { success: true, cart: updatedCart };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Clear entire cart
const clearCart = async (userId) => {
    const transaction = await sequelize.transaction();
    try {
        const cart = await Cart.findOne({ where: { userId } }, { transaction });
        if (!cart) {
            throw new Error('Cart not found');
        }

        await CartItem.destroy(
            { where: { cartId: cart.id } },
            { transaction }
        );

        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save({ transaction });

        await transaction.commit();

        // Fetch cart with items to return complete data
        const updatedCart = await getCart(userId);
        return { success: true, cart: updatedCart };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
