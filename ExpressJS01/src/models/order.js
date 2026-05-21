const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Product = require('./product');

// Order Status: 1. Mới, 2. Xác nhận, 3. Chuẩn bị, 4. Đang giao, 5. Đã giao, 6. Hủy, 7. Yêu cầu hủy
const ORDER_STATUS = {
    NEW: 1,
    CONFIRMED: 2,
    PREPARING: 3,
    SHIPPING: 4,
    DELIVERED: 5,
    CANCELLED: 6,
    CANCEL_REQUESTED: 7
};

const Order = sequelize.define('Order', {
    orderCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    totalPrice: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    totalItems: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: ORDER_STATUS.NEW,
        comment: '1=New, 2=Confirmed, 3=Preparing, 4=Shipping, 5=Delivered, 6=Cancelled, 7=CancelRequested'
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'COD',
        comment: 'Payment method: COD, WALLET, etc'
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'PENDING',
        comment: 'PENDING, PAID, FAILED'
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    recipientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipientPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cancellationRequestedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    confirmedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    shippedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'orders',
    timestamps: true
});

const OrderItem = sequelize.define('OrderItem', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'order_items',
    timestamps: true
});

const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'order_status_histories',
    timestamps: true
});

// Relationships
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

Order.hasMany(OrderStatusHistory, { foreignKey: 'orderId', as: 'statusHistory', onDelete: 'CASCADE' });
OrderStatusHistory.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = { Order, OrderItem, OrderStatusHistory, ORDER_STATUS };
