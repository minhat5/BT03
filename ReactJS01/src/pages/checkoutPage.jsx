import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import { Form, Input, Button, Radio, Spin, message, Empty, Alert } from 'antd';
import { createOrderApi } from '../util/api';
import './checkoutPage.css';

const CheckoutPage = () => {
    const [form] = Form.useForm();
    const { cart, loading: cartLoading, clearCartItems } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    if (!auth?.isAuthenticated) {
        return (
            <div className="checkout-container">
                <Empty
                    description="Vui lòng đăng nhập để tiếp tục thanh toán"
                    style={{ marginTop: 50 }}
                >
                    <Button type="primary" onClick={() => navigate('/login')}>
                        Đi tới Đăng nhập
                    </Button>
                </Empty>
            </div>
        );
    }

    if (cartLoading) {
        return (
            <div className="checkout-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="checkout-container">
                <Empty
                    description="Giỏ hàng của bạn trống"
                    style={{ marginTop: 50 }}
                >
                    <Button type="primary" onClick={() => navigate('/cart')}>
                        Quay lại giỏ hàng
                    </Button>
                </Empty>
            </div>
        );
    }

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const response = await createOrderApi(
                values.shippingAddress,
                values.recipientName,
                values.recipientPhone,
                values.notes || ''
            );

            if (response && response.data) {
                message.success('Đơn hàng được tạo thành công!');
                // Clear cart after successful order creation
                await clearCartItems();
                // Redirect to orders page
                navigate('/orders');
            }
        } catch (error) {
            message.error(error.response?.data?.error || 'Lỗi khi tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Thanh toán</h1>
            <div className="checkout-content">
                <div className="checkout-form-wrapper">
                    <Alert
                        message="Hiện tại, chúng tôi chỉ hỗ trợ phương thức thanh toán Tiền mặt khi nhận hàng (COD)"
                        type="info"
                        style={{ marginBottom: 20 }}
                        showIcon
                    />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <h3>Thông tin giao hàng</h3>

                        <Form.Item
                            name="recipientName"
                            label="Tên người nhận"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên người nhận' }
                            ]}
                        >
                            <Input placeholder="Nhập tên người nhận" />
                        </Form.Item>

                        <Form.Item
                            name="recipientPhone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số' }
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            name="shippingAddress"
                            label="Địa chỉ giao hàng"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Nhập địa chỉ giao hàng đầy đủ"
                                rows={3}
                            />
                        </Form.Item>

                        <Form.Item
                            name="notes"
                            label="Ghi chú (Tùy chọn)"
                        >
                            <Input.TextArea
                                placeholder="Ghi chú đặc biệt cho giao hàng"
                                rows={2}
                            />
                        </Form.Item>

                        <h3>Phương thức thanh toán</h3>
                        <Form.Item>
                            <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <Radio value="COD">
                                    <div className="payment-option">
                                        <span className="payment-name">Tiền mặt khi nhận hàng (COD)</span>
                                        <span className="payment-desc">Thanh toán khi bạn nhận được đơn hàng</span>
                                    </div>
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                block
                                size="large"
                                loading={loading}
                                onClick={() => form.submit()}
                                disabled={loading}
                            >
                                Đặt hàng
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div className="checkout-summary">
                    <div className="summary-card">
                        <h3>Tóm tắt đơn hàng</h3>

                        <div className="summary-items">
                            {cart.items?.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-info">
                                        <span>{item.product?.name}</span>
                                        <span className="item-qty">x {item.quantity}</span>
                                    </div>
                                    <span className="item-price">${parseFloat(item.totalPrice).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <hr />

                        <div className="summary-row">
                            <span>Tổng phụ:</span>
                            <span>${parseFloat(cart.totalPrice).toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Vận chuyển:</span>
                            <span>$0.00</span>
                        </div>
                        <div className="summary-row">
                            <span>Thuế:</span>
                            <span>$0.00</span>
                        </div>

                        <hr />

                        <div className="summary-row total">
                            <span>Tổng cộng:</span>
                            <span>${parseFloat(cart.totalPrice).toFixed(2)}</span>
                        </div>

                        <Button
                            block
                            style={{ marginTop: 20 }}
                            onClick={() => navigate('/cart')}
                        >
                            Quay lại giỏ hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
