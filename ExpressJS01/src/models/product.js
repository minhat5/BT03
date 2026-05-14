const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./category');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: ['https://via.placeholder.com/500x500?text=No+Image']
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isNew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isHotSale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    tableName: 'products',
    timestamps: true
});

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

module.exports = Product;
