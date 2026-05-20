import { createContext, useState, useEffect } from 'react';
import { getCartApi, addToCartApi, updateCartItemApi, removeFromCartApi, clearCartApi } from '../../util/api';

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await getCartApi();
            if (response && response.data) {
                setCart(response.data);
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart on mount
    useEffect(() => {
        if (!cart) {
            fetchCart();
        }
    }, []);

    const addToCart = async (productId, quantity) => {
        try {
            setLoading(true);
            const response = await addToCartApi(productId, quantity);
            if (response && response.data) {
                setCart(response.data);
                return { success: true, data: response.data };
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            setLoading(true);
            const response = await updateCartItemApi(cartItemId, quantity);
            if (response && response.data) {
                setCart(response.data);
                return { success: true, data: response.data };
            }
        } catch (err) {
            console.error('Error updating cart item:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            setLoading(true);
            const response = await removeFromCartApi(cartItemId);
            if (response && response.data) {
                setCart(response.data);
                return { success: true, data: response.data };
            }
        } catch (err) {
            console.error('Error removing from cart:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const clearCartItems = async () => {
        try {
            setLoading(true);
            const response = await clearCartApi();
            if (response && response.data) {
                setCart(response.data);
                return { success: true, data: response.data };
            }
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                fetchCart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCartItems
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
