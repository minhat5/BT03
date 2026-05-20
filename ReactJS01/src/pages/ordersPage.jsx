import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getOrdersApi } from '../util/api';
import { Button, Spin, Empty, message, Pagination, Tabs, Tag } from 'antd';
import './ordersPage.css';

const ORDER_STATUS = {
    1: { label: 'Đơn hàng mới', color: '#faad14' },
    2: { label: 'Đã xác nhận', color: '#13c2c2' },
    3: { label: 'Đang chuẩn bị', color: '#1890ff' },
    4: { label: 'Đang giao', color: '#722ed1' },
    5: { label: 'Đã giao', color: '#52c41a' },
    6: { label: 'Đã hủy', color: '#f5222d' },
    7: { label: 'Yêu cầu hủy', color: '#ff7875' }
};

const OrdersPage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('all');
    const pageSize = 10;

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const offset = (page - 1) * pageSize;
            const response = await getOrdersApi(pageSize, offset);
            
            if (response && response.data) {
                setOrders(response.data);
                setTotal(response.total);
                setCurrentPage(page);
            }
        } catch {
            message.error('Lỗi khi tải đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!auth?.isAuthenticated) return;
        fetchOrders();
    }, [auth?.isAuthenticated]);

    const filterOrdersByStatus = (status) => {
        if (!orders || !Array.isArray(orders)) return [];
        if (status === 'all') return orders;
        return orders.filter(order => order.status === parseInt(status));
    };

    const getTabItems = () => [
        {
            key: 'all',
            label: 'Tất cả đơn hàng',
            children: renderOrdersList(orders)
        },
        {
            key: '1',
            label: 'Mới',
            children: renderOrdersList(filterOrdersByStatus('1'))
        },
        {
            key: '2',
            label: 'Đã xác nhận',
            children: renderOrdersList(filterOrdersByStatus('2'))
        },
        {
            key: '3',
            label: 'Đang chuẩn bị',
            children: renderOrdersList(filterOrdersByStatus('3'))
        },
        {
            key: '4',
            label: 'Đang giao',
            children: renderOrdersList(filterOrdersByStatus('4'))
        },
        {
            key: '5',
            label: 'Đã giao',
            children: renderOrdersList(filterOrdersByStatus('5'))
        },
        {
            key: '6',
            label: 'Đã hủy',
            children: renderOrdersList(filterOrdersByStatus('6'))
        }
    ];

    const renderOrdersList = (ordersList) => {
        if (!ordersList || !Array.isArray(ordersList) || ordersList.length === 0) {
            return <Empty description="Không tìm thấy đơn hàng" />;
        }

        return (
            <div className="orders-list">
                {ordersList.map((order) => (
                    <div
                        key={order.id}
                        className="order-card"
                        onClick={() => navigate(`/orders/${order.id}`)}
                    >
                        <div className="order-card-header">
                            <div>
                                <h3>Order #{order.orderCode}</h3>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Tag color={ORDER_STATUS[order.status]?.color}>
                                {ORDER_STATUS[order.status]?.label}
                            </Tag>
                        </div>

                        <div className="order-card-items">
                            {order.items?.slice(0, 3).map((item) => (
                                <div key={item.id} className="item-preview">
                                    <img
                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                                        alt={item.product?.name}
                                    />
                                    <div className="item-info">
                                        <p>{item.product?.name}</p>
                                        <p className="qty">x {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            {order.items?.length > 3 && (
                                <div className="more-items">
                                    +{order.items.length - 3} sản phẩm khác
                                </div>
                            )}
                        </div>

                        <div className="order-card-footer">
                            <div className="order-total">
                                <span>Tổng cộng:</span>
                                <strong>${parseFloat(order.totalPrice).toFixed(2)}</strong>
                            </div>
                            <Button
                                type="primary"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/orders/${order.id}`);
                                }}
                            >
                                Xem chi tiết
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (!auth?.isAuthenticated) {
        return (
            <div className="orders-container">
                <Empty
                    description="Vui lòng đăng nhập để xem đơn hàng của bạn"
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
            <div className="orders-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h1>Đơn hàng của tôi</h1>
            
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={getTabItems()}
            />

            {orders && Array.isArray(orders) && orders.length > 0 && (
                <div className="pagination-wrapper">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={(page) => fetchOrders(page)}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
