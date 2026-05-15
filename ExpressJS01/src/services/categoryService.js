const Category = require('../models/category');

// Get all categories
const getCategories = async () => {
    const categories = await Category.findAll({
        attributes: ['id', 'name', 'description', 'image'],
        order: [['name', 'ASC']]
    });

    return {
        data: categories
    };
};

// Get category by ID
const getCategoryById = async (id) => {
    const category = await Category.findByPk(id);

    if (!category) {
        return null;
    }

    return {
        data: category
    };
};

module.exports = {
    getCategories,
    getCategoryById
};
