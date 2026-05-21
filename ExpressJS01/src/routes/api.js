const express = require('express');
const { createUser, handleLogin, getUser, getAccount, handleSendOtp, handleVerifyOtpAndReset } = require('../controllers/userController');
const { getProducts, getProductById, getFilteredProducts, getBestSellingProducts, getMostViewedProducts, getProductsByCategory } = require('../controllers/productController');
const { getCategories, getCategoryById } = require('../controllers/categoryController');
const { getCartController, addToCartController, updateCartItemController, removeFromCartController, clearCartController } = require('../controllers/cartController');
const { createOrderController, getOrdersController, getOrderByIdController, getOrderStatusHistoryController, requestCancellationController } = require('../controllers/orderController');
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

// Cart routes
routerAPI.get("/cart", getCartController);
routerAPI.post("/cart", addToCartController);
routerAPI.put("/cart/:cartItemId", updateCartItemController);
routerAPI.delete("/cart/:cartItemId", removeFromCartController);
routerAPI.delete("/cart-clear", clearCartController);

// Order routes
routerAPI.post("/orders", createOrderController);
routerAPI.get("/orders", getOrdersController);
routerAPI.get("/orders/:orderId", getOrderByIdController);
routerAPI.get("/orders/:orderId/status-history", getOrderStatusHistoryController);
routerAPI.post("/orders/:orderId/cancel", requestCancellationController);

module.exports = routerAPI;