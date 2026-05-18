const Product = require('../models/product');
const Category = require('../models/category');
const { Op } = require('sequelize');

// Get all products with filtering and pagination
const getProducts = async (filters) => {
    const { categoryId, search, sortBy, page = 1, limit = 12, minPrice, maxPrice } = filters;
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

    return {
        data: rows,
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
    };
};

// Get product by ID
const getProductById = async (id) => {
    const product = await Product.findByPk(id, {
        include: [{ model: Category, as: 'category' }]
    });

    if (!product) {
        return null;
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

    return {
        product,
        relatedProducts
    };
};

// Get products by specific filters
const getFilteredProducts = async (filters) => {
    const { categoryId, isNew, isHotSale, sortBy, limit = 8 } = filters;
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

    return {
        data: products
    };
};

// Get top 10 best-selling products
const getBestSellingProducts = async (limit = 10) => {
    const products = await Product.findAll({
        order: [['sold', 'DESC']],
        limit: parseInt(limit),
        attributes: { exclude: ['description'] },
        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    });

    return {
        data: products
    };
};

// Get top 10 most viewed products
const getMostViewedProducts = async (limit = 10) => {
    const products = await Product.findAll({
        order: [['rating', 'DESC'], ['reviewCount', 'DESC']],
        limit: parseInt(limit),
        attributes: { exclude: ['description'] },
        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    });

    return {
        data: products
    };
};

// Get products by category with pagination
const getProductsByCategory = async (categoryId, page = 1, limit = 12) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
        where: { categoryId: categoryId },
        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['description'] }
    });

    return {
        data: rows,
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
    };
};

module.exports = {
    getProducts,
    getProductById,
    getFilteredProducts,
    getBestSellingProducts,
    getMostViewedProducts,
    getProductsByCategory
};
