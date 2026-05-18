const express = require('express');
const { createUser, handleLogin, getUser, getAccount, handleSendOtp, handleVerifyOtpAndReset } = require('../controllers/userController');
const { getProducts, getProductById, getFilteredProducts, getBestSellingProducts, getMostViewedProducts, getProductsByCategory } = require('../controllers/productController');
const { getCategories, getCategoryById } = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Public routes (no auth required)
routerAPI.get("/products", getProducts);
routerAPI.get("/products/featured", getFilteredProducts);
routerAPI.get("/products/best-selling", getBestSellingProducts);
routerAPI.get("/products/most-viewed", getMostViewedProducts);
routerAPI.get("/products/category/:categoryId", getProductsByCategory);
routerAPI.get("/products/:id", getProductById);
routerAPI.get("/categories", getCategories);
routerAPI.get("/categories/:id", getCategoryById);

// Protected routes
routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post(`/forgot-password/send-otp`, handleSendOtp);
routerAPI.post(`/forgot-password/reset`, handleVerifyOtpAndReset);
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;