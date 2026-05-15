const productService = require('../services/productService');

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
    try {
        const result = await productService.getProducts(req.query);

        return res.status(200).json({
            success: true,
            data: result.data,
            total: result.total,
            page: result.page,
            pages: result.pages
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

        const result = await productService.getProductById(id);

        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({
            success: true,
            data: result.product,
            related: result.relatedProducts
        });
    } catch (error) {
        console.log('Error in getProductById:', error);
        return res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Get products by specific filters
const getFilteredProducts = async (req, res) => {
    try {
        const result = await productService.getFilteredProducts(req.query);

        return res.status(200).json({
            success: true,
            data: result.data
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
