/**
 * Format price to Vietnamese currency format
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('vi-VN');
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discount - Discount percentage or amount
 * @returns {number} Discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discount) => {
    return originalPrice * (1 - discount / 100);
};

/**
 * Generate rating stars HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {array} Array of star elements
 */
export const generateStars = (rating) => {
    return [...Array(5)].map((_, i) => i < Math.floor(rating) ? '★' : '☆');
};

/**
 * Truncate text to specific length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Check if product is in stock
 * @param {number} stock - Stock quantity
 * @returns {boolean} Is in stock
 */
export const isInStock = (stock) => {
    return stock > 0;
};

/**
 * Get discount badge text
 * @param {number} discount - Discount percentage
 * @returns {string} Badge text
 */
export const getDiscountBadge = (discount) => {
    if (discount >= 50) return '🔥 SỐC';
    if (discount >= 30) return '💥 ĐT';
    if (discount >= 20) return '⚡ CK';
    if (discount > 0) return `-${discount}%`;
    return '';
};

/**
 * Build query string from object
 * @param {object} filters - Filter object
 * @returns {string} Query string
 */
export const buildQueryString = (filters) => {
    return Object.entries(filters)
        .filter(([, value]) => value !== '' && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
};

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} Debounced function
 */
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Get category badge color
 * @param {string} categoryName - Category name
 * @returns {string} Color class
 */
export const getCategoryColor = (categoryName) => {
    const colors = {
        'Laptop': 'bg-blue-500',
        'Smartphone': 'bg-green-500',
        'Tablet': 'bg-purple-500',
        'Smartwatch': 'bg-pink-500'
    };
    return colors[categoryName] || 'bg-gray-500';
};
