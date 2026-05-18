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

export {
    createUserApi, loginApi, getUserApi, sendOtpApi, resetPasswordWithOtpApi,
    getBestSellingProductsApi, getMostViewedProductsApi, getProductsByCategoryApi
};