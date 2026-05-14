const Category = require('../models/category');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name', 'description', 'image'],
            order: [['name', 'ASC']]
        });

        return res.status(200).json({
            success: true,
            data: categories
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

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({
            success: true,
            data: category
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
