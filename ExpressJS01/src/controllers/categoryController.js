const categoryService = require('../services/categoryService');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const result = await categoryService.getCategories();

        return res.status(200).json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.log('Error in getCategories:', error);
        return res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await categoryService.getCategoryById(id);

        if (!result) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.log('Error in getCategoryById:', error);
        return res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

module.exports = {
    getCategories,
    getCategoryById
};
