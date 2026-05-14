const Product = require('../models/product');
const Category = require('../models/category');
const { Op } = require('sequelize');

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
    try {
        const { categoryId, search, sortBy, page = 1, limit = 12, minPrice, maxPrice } = req.query;
        const offset = (page - 1) * limit;

        let where = {};
        let order = [['createdAt', 'DESC']];

        // Filter by category
        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Search by name
        if (search) {
            where.name = {
                [Op.like]: `%${search}%`
            };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = minPrice;
            if (maxPrice) where.price[Op.lte] = maxPrice;
        }

        // Sort options
        if (sortBy === 'price-asc') {
            order = [['price', 'ASC']];
        } else if (sortBy === 'price-desc') {
            order = [['price', 'DESC']];
        } else if (sortBy === 'rating') {
            order = [['rating', 'DESC']];
        } else if (sortBy === 'newest') {
            order = [['createdAt', 'DESC']];
        } else if (sortBy === 'best-selling') {
            order = [['sold', 'DESC']];
        }

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
            order,
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: { exclude: ['description'] }
        });

        return res.status(200).json({
            success: true,
            data: rows,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.log('Error in getProducts:', error);
        return res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get related products (same category, excluding current product)
        const relatedProducts = await Product.findAll({
            where: {
                categoryId: product.categoryId,
                id: { [Op.ne]: id }
            },
            limit: 4,
            attributes: { exclude: ['description'] }
        });

        return res.status(200).json({
            success: true,
            data: product,
            related: relatedProducts
        });
    } catch (error) {
        console.log('Error in getProductById:', error);
        return res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Get products by specific filters
const getFilteredProducts = async (req, res) => {
    try {
        const { categoryId, isNew, isHotSale, sortBy, limit = 8 } = req.query;
        let where = {};

        if (categoryId) where.categoryId = categoryId;
        if (isNew === 'true') where.isNew = true;
        if (isHotSale === 'true') where.isHotSale = true;

        let order = [['createdAt', 'DESC']];
        if (sortBy === 'best-selling') order = [['sold', 'DESC']];
        if (sortBy === 'rating') order = [['rating', 'DESC']];

        const products = await Product.findAll({
            where,
            order,
            limit: parseInt(limit),
            attributes: { exclude: ['description'] }
        });

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.log('Error in getFilteredProducts:', error);
        return res.status(500).json({ message: 'Error fetching filtered products', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getFilteredProducts
};
