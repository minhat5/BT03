import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getOrderDetailApi, getOrderStatusHistoryApi, requestOrderCancellationApi } from '../util/api';
import { Button, Spin, Empty, message, Steps, Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './orderDetail.css';

const ORDER_STATUS = {
    1: { label: 'Đơn hàng mới', color: '#faad14' },
    2: { label: 'Đã xác nhận', color: '#13c2c2' },
    3: { label: 'Đang chuẩn bị', color: '#1890ff' },
    4: { label: 'Đang giao', color: '#722ed1' },
    5: { label: 'Đã giao', color: '#52c41a' },
    6: { label: 'Đã hủy', color: '#f5222d' },
    7: { label: 'Yêu cầu hủy', color: '#ff7875' }
};

const OrderDetail = () => {
    const { orderId } = useParams();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellationModal, setCancellationModal] = useState(false);
    const [cancellationForm] = Form.useForm();
    const [cancelling, setCancelling] = useState(false);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const [orderRes, historyRes] = await Promise.all([
                getOrderDetailApi(orderId),
                getOrderStatusHistoryApi(orderId)
            ]);

            if (orderRes && orderRes.data) {
                setOrder(orderRes.data);
            }
            if (historyRes && historyRes.data) {
                setStatusHistory(historyRes.data);
            }
        } catch {
            message.error('Error loading order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const handleCancelRequest = async (values) => {
        try {
            setCancelling(true);
            const response = await requestOrderCancellationApi(orderId, values.reason);
            if (response.data) {
                message.success('Cancellation request submitted');
                setOrder(response.data.data);
                setCancellationModal(false);
                cancellationForm.resetFields();
                await fetchOrderDetails();
            }
        } catch (error) {
            message.error(error.response?.data?.error || 'Error submitting cancellation request');
        } finally {
            setCancelling(false);
        }
    };

    const canCancelOrder = () => {
        if (!order) return false;
        const createdAt = new Date(order.createdAt);
        const now = new Date();
        const minutesElapsed = (now - createdAt) / (1000 * 60);

        return minutesElapsed <= 30 && (order.status === 1 || order.status === 2);
    };

    const canRequestCancellation = () => {
        if (!order) return false;
        return order.status === 3; // Can request cancellation if in "Preparing" status
    };

    if (!auth?.isAuthenticated) {
        return (
            <div className="order-detail-container">
                <Empty
                    description="Vui lòng đăng nhập để xem chi tiết đơn hàng"
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
            <div className="order-detail-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-detail-container">
                <Empty description="Order not found" />
            </div>
        );
    }

    const minutesElapsed = (new Date() - new Date(order.createdAt)) / (1000 * 60);
    const minutesRemaining = Math.max(0, 30 - Math.floor(minutesElapsed));

    return (
        <div className="order-detail-container">
            <Button onClick={() => navigate('/orders')} style={{ marginBottom: 20 }}>
                ← Quay lại Đơn hàng
            </Button>

            <div className="order-detail-content">
                <div className="order-header">
                    <div>
                        <h1>Đơn hàng #{order.orderCode}</h1>
                        <p className="order-date">
                            Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                    <div className="order-status-badge" style={{ borderColor: ORDER_STATUS[order.status]?.color }}>
                        <span style={{ color: ORDER_STATUS[order.status]?.color }}>
                            {ORDER_STATUS[order.status]?.label}
                        </span>
                    </div>
                </div>

                {minutesRemaining > 0 && (canCancelOrder() || canRequestCancellation()) && (
                    <div className="cancellation-info">
                        {canCancelOrder() && (
                            <>
                                <ExclamationCircleOutlined style={{ marginRight: 10, color: '#faad14' }} />
                                <span>Bạn có thể hủy đơn hàng này trong {minutesRemaining} phút</span>
                                <Button
                                    danger
                                    size="small"
                                    onClick={() => setCancellationModal(true)}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Hủy đơn hàng
                                </Button>
                            </>
                        )}
                        {canRequestCancellation() && (
                            <>
                                <ExclamationCircleOutlined style={{ marginRight: 10, color: '#faad14' }} />
                                <span>Đơn hàng của bạn đang được chuẩn bị. Bạn có thể yêu cầu hủy.</span>
                                <Button
                                    danger
                                    size="small"
                                    onClick={() => setCancellationModal(true)}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Yêu cầu hủy
                                </Button>
                            </>
                        )}
                    </div>
                )}

                <div className="order-timeline">
                    <h3>Trạng thái đơn hàng</h3>
                    <Steps
                        current={Math.min(order.status - 1, 4)}
                        items={[
                            { title: 'Đơn hàng mới', description: ORDER_STATUS[1]?.label },
                            { title: 'Đã xác nhận', description: ORDER_STATUS[2]?.label },
                            { title: 'Đang chuẩn bị', description: ORDER_STATUS[3]?.label },
                            { title: 'Đang giao', description: ORDER_STATUS[4]?.label },
                            { title: 'Đã giao', description: ORDER_STATUS[5]?.label }
                        ]}
                    />
                </div>

                <div className="order-details-grid">
                    <div className="details-card">
                        <h3>Thông tin giao hàng</h3>
                        <p><strong>Người nhận:</strong> {order.recipientName}</p>
                        <p><strong>Điện thoại:</strong> {order.recipientPhone}</p>
                        <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
                        {order.notes && <p><strong>Ghi chú:</strong> {order.notes}</p>}
                    </div>

                    <div className="details-card">
                        <h3>Thông tin thanh toán</h3>
                        <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
                        <p><strong>Trạng thái:</strong> {order.paymentStatus}</p>
                        <p><strong>Tổng cộng:</strong> ${parseFloat(order.totalPrice).toFixed(2)}</p>
                    </div>
                </div>

                <div className="order-items">
                    <h3>Sản phẩm</h3>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.product?.name}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${parseFloat(item.totalPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="status-history">
                    <h3>Lịch sử trạng thái</h3>
                    <div className="history-timeline">
                        {statusHistory.map((entry, index) => (
                            <div key={index} className="history-entry">
                                <div className="history-dot" style={{ background: ORDER_STATUS[entry.status]?.color }}></div>
                                <div className="history-content">
                                    <p className="history-status">{ORDER_STATUS[entry.status]?.label}</p>
                                    <p className="history-notes">{entry.notes}</p>
                                    <p className="history-time">
                                        {new Date(entry.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                title="Hủy đơn hàng"
                open={cancellationModal}
                onCancel={() => {
                    setCancellationModal(false);
                    cancellationForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={cancellationForm}
                    layout="vertical"
                    onFinish={handleCancelRequest}
                >
                    <Form.Item
                        name="reason"
                        label="Lý do hủy"
                        rules={[
                            { required: true, message: 'Vui lòng cung cấp lý do hủy đơn hàng' }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Tại sao bạn muốn hủy đơn hàng này?"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            block
                            loading={cancelling}
                            danger
                            onClick={() => cancellationForm.submit()}
                        >
                            {canRequestCancellation() ? 'Yêu cầu hủy' : 'Hủy đơn hàng'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrderDetail;
