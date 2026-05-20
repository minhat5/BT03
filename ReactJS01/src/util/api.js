import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
};

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
};

const sendOtpApi = (email) => {
    const URL_API = `/v1/api/forgot-password/send-otp`;
    const data = { email };
    return axios.post(URL_API, data);
};

const resetPasswordWithOtpApi = (email, otp, newPassword) => {
    const URL_API = `/v1/api/forgot-password/reset`;
    const data = { email, otp, newPassword };
    return axios.post(URL_API, data);
};

const getBestSellingProductsApi = (limit = 10) => {
    const URL_API = `/v1/api/products/best-selling?limit=${limit}`;
    return axios.get(URL_API);
};

const getMostViewedProductsApi = (limit = 10) => {
    const URL_API = `/v1/api/products/most-viewed?limit=${limit}`;
    return axios.get(URL_API);
};

const getProductsByCategoryApi = (categoryId, page = 1, limit = 12) => {
    const URL_API = `/v1/api/products/category/${categoryId}?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

// Cart APIs
const getCartApi = () => {
    const URL_API = "/v1/api/cart";
    return axios.get(URL_API);
};

const addToCartApi = (productId, quantity) => {
    const URL_API = "/v1/api/cart";
    const data = { productId, quantity };
    return axios.post(URL_API, data);
};

const updateCartItemApi = (cartItemId, quantity) => {
    const URL_API = `/v1/api/cart/${cartItemId}`;
    const data = { quantity };
    return axios.put(URL_API, data);
};

const removeFromCartApi = (cartItemId) => {
    const URL_API = `/v1/api/cart/${cartItemId}`;
    return axios.delete(URL_API);
};

const clearCartApi = () => {
    const URL_API = "/v1/api/cart-clear";
    return axios.delete(URL_API);
};

// Order APIs
const createOrderApi = (shippingAddress, recipientName, recipientPhone, notes = '') => {
    const URL_API = "/v1/api/orders";
    const data = { shippingAddress, recipientName, recipientPhone, notes };
    return axios.post(URL_API, data);
};

const getOrdersApi = (limit = 10, offset = 0) => {
    const URL_API = `/v1/api/orders?limit=${limit}&offset=${offset}`;
    return axios.get(URL_API);
};

const getOrderDetailApi = (orderId) => {
    const URL_API = `/v1/api/orders/${orderId}`;
    return axios.get(URL_API);
};

const getOrderStatusHistoryApi = (orderId) => {
    const URL_API = `/v1/api/orders/${orderId}/status-history`;
    return axios.get(URL_API);
};

const requestOrderCancellationApi = (orderId, reason) => {
    const URL_API = `/v1/api/orders/${orderId}/cancel`;
    const data = { reason };
    return axios.post(URL_API, data);
};

export {
    createUserApi, loginApi, getUserApi, sendOtpApi, resetPasswordWithOtpApi,
    getBestSellingProductsApi, getMostViewedProductsApi, getProductsByCategoryApi,
    getCartApi, addToCartApi, updateCartItemApi, removeFromCartApi, clearCartApi,
    createOrderApi, getOrdersApi, getOrderDetailApi, getOrderStatusHistoryApi, requestOrderCancellationApi
};