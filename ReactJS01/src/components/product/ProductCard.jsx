import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const discountedPrice = product.discount 
        ? (product.price * (1 - product.discount / 100)).toFixed(2)
        : product.price;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Image Container */}
            <div 
                className="relative overflow-hidden bg-gray-100 h-48"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/300x300'}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
                
                {/* Badge Promotions */}
                <div className="absolute top-2 right-2 space-y-2">
                    {product.isHotSale && (
                        <span className="block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            🔥 BÁN CHẠY
                        </span>
                    )}
                    {product.isNew && (
                        <span className="block bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                            ⭐ MỚI
                        </span>
                    )}
                    {product.discount > 0 && (
                        <span className="block bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                {isHovered && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                        <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                            <ShoppingCartOutlined />
                            Thêm vào giỏ
                        </button>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <span key={i}>
                                {i < Math.floor(product.rating) ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-red-600">
                        {parseFloat(discountedPrice).toLocaleString('vi-VN')}₫
                    </span>
                    {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                            {product.price.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>

                {/* Stock & Sold */}
                <div className="text-xs text-gray-600 mb-2">
                    <p>Đã bán: <span className="font-semibold">{product.sold}</span></p>
                    <p>Hàng tồn: <span className="font-semibold">{product.stock}</span></p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
