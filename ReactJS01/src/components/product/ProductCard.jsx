import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    
    const discountedPrice = product.discount 
        ? (product.price * (1 - product.discount / 100)).toFixed(2)
        : product.price;

    const discount = product.discount > 0 ? Math.round(product.discount) : 0;

    return (
        <div className="group relative bg-white rounded-lg shadow hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Image Container - Premium */}
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-56"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/300x300'}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                        isHovered ? 'scale-125' : 'scale-100'
                    }`}
                />
                
                {/* Dark Overlay on Hover */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300" />
                )}

                {/* Top Right Badges */}
                <div className="absolute top-3 right-3 space-y-2 flex flex-col items-end">
                    {discount > 0 && (
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            -{discount}%
                        </div>
                    )}
                    {product.isHotSale && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <span>🔥</span>
                            <span>HOT</span>
                        </div>
                    )}
                    {product.isNew && (
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            NEW
                        </div>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                >
                    {isFavorite ? (
                        <HeartFilled className="text-red-500 text-lg" />
                    ) : (
                        <HeartOutlined className="text-gray-400 text-lg hover:text-red-500" />
                    )}
                </button>

                {/* Add to Cart Button - On Hover */}
                {isHovered && (
                    <button className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 font-bold text-center flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform translate-y-0 group-hover:translate-y-0">
                        <ShoppingCartOutlined className="text-lg" />
                        <span>Thêm vào giỏ</span>
                    </button>
                )}
            </div>

            {/* Product Info - Premium */}
            <div className="p-4 space-y-3">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 transition-colors duration-200 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-xs">
                                {i < Math.floor(parseFloat(product.rating) || 0) ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        {(parseFloat(product.rating) || 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                        ({product.reviewCount || 0})
                    </span>
                </div>

                {/* Price Section - Premium */}
                <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-red-600">
                            ₫{parseFloat(discountedPrice).toLocaleString('vi-VN')}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                ₫{Math.round(product.price).toLocaleString('vi-VN')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stock Indicator */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                        <span>Kho:</span>
                        <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300"
                            style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Sold Stats */}
                <div className="text-xs text-gray-600 pt-1 border-t border-gray-100">
                    <span>Đã bán: </span>
                    <span className="font-semibold text-gray-800">{product.sold.toLocaleString('vi-VN')}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
