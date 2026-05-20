import { useContext, useState } from 'react';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import { Button, InputNumber, Empty, Spin, message, Popconfirm } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import './cartPage.css';

const CartPage = () => {
    const { cart, loading, updateCartItem, removeFromCart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loadingItems, setLoadingItems] = useState({});

    if (!auth?.isAuthenticated) {
        return (
            <div className="cart-container">
                <Empty
                    description="Vui lòng đăng nhập để xem giỏ hàng"
                    style={{ marginTop: 50 }}
                >
                    <Button type="primary" onClick={() => navigate('/login')}>
                        Đi tới Đăng nhập
                    </Button>
                </Empty>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="cart-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-container">
                <Empty
                    description="Giỏ hàng của bạn trống"
                    style={{ marginTop: 50 }}
                >
                    <Button type="primary" onClick={() => navigate('/')}>
                        Tiếp tục mua sắm
                    </Button>
                </Empty>
            </div>
        );
    }

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity <= 0) return;

        setLoadingItems(prev => ({ ...prev, [cartItemId]: true }));
        const result = await updateCartItem(cartItemId, newQuantity);
        if (!result.success) {
            message.error(result.error);
        }
        setLoadingItems(prev => ({ ...prev, [cartItemId]: false }));
    };

    const handleRemoveItem = async (cartItemId) => {
        setLoadingItems(prev => ({ ...prev, [cartItemId]: true }));
        const result = await removeFromCart(cartItemId);
        if (result.success) {
            message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } else {
            message.error(result.error);
        }
        setLoadingItems(prev => ({ ...prev, [cartItemId]: false }));
    };

    return (
        <div className="cart-container">
            <h1>Giỏ hàng</h1>
            <div className="cart-content">
                <div className="cart-items-wrapper">
                    {cart.items.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="item-image">
                                <img
                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                    alt={item.product?.name}
                                />
                            </div>
                            <div className="item-details">
                                <h3>{item.product?.name}</h3>
                                <p className="item-price">
                                    ${parseFloat(item.price).toFixed(2)}
                                </p>
                            </div>
                            <div className="item-quantity">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<MinusOutlined />}
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || loadingItems[item.id]}
                                />
                                <InputNumber
                                    min={1}
                                    value={item.quantity}
                                    onChange={(val) => handleQuantityChange(item.id, val)}
                                    disabled={loadingItems[item.id]}
                                    style={{ width: 60 }}
                                />
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    disabled={loadingItems[item.id]}
                                />
                            </div>
                            <div className="item-total">
                                <p>${parseFloat(item.totalPrice).toFixed(2)}</p>
                            </div>
                            <div className="item-actions">
                                <Popconfirm
                                    title="Xóa sản phẩm"
                                    description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                                    onConfirm={() => handleRemoveItem(item.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button
                                        danger
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        disabled={loadingItems[item.id]}
                                    />
                                </Popconfirm>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-card">
                        <h3>Tóm tắt đơn hàng</h3>
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
                            type="primary"
                            block
                            size="large"
                            onClick={() => navigate('/checkout')}
                            style={{ marginTop: 20 }}
                        >
                            Tiến hành thanh toán
                        </Button>
                        <Button
                            block
                            style={{ marginTop: 10 }}
                            onClick={() => navigate('/')}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
