require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                };
            } else {
                const payload = {
                    email: user.email,
                    name: user.name
                };
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
                );
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getUserService = async () => {
    try {
        let result = await User.findAll({ attributes: { exclude: ['password'] } });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const sendOtpService = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return { EC: 1, EM: `Email không tồn tại trong hệ thống` };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15);

        await User.update(
            { resetOtp: otp, resetOtpExpiration: expiration },
            { where: { email } }
        );

        const transporter = nodemailer.createTransport({
            service: `gmail`,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Mã OTP khôi phục mật khẩu`,
            text: `Mã OTP xác thực của bạn là: ${otp}. Mã có hiệu lực trong 15 phút.`
        });

        return { EC: 0, EM: `Mã OTP đã được gửi đến email` };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const verifyOtpAndResetPasswordService = async (email, otp, newPassword) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return { EC: 1, EM: `Email không tồn tại trong hệ thống` };
        }

        if (user.resetOtp !== otp) {
            return { EC: 1, EM: `Mã OTP không hợp lệ` };
        }

        const now = new Date();
        if (now > user.resetOtpExpiration) {
            return { EC: 1, EM: `Mã OTP đã hết hạn` };
        }

        const hashPassword = await bcrypt.hash(newPassword, saltRounds);
        await User.update(
            { password: hashPassword, resetOtp: null, resetOtpExpiration: null },
            { where: { email } }
        );

        return { EC: 0, EM: `Cập nhật mật khẩu thành công` };
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    createUserService, loginService, getUserService, sendOtpService, verifyOtpAndResetPasswordService
};