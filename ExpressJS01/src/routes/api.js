const express = require('express');
const { createUser, handleLogin, getUser, getAccount, handleSendOtp, handleVerifyOtpAndReset } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

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