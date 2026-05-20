import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, InputNumber, Button, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import axios from '../../util/axios.customize';
import ProductCard from '../../components/product/ProductCard';
import { CartContext } from '../../components/context/cart.context';
import { AuthContext } from '../../components/context/auth.context';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/v1/api/products/${id}`);
                if (res && res.success) {
                    setProduct(res.data);
                    setRelatedProducts(res.related || []);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                message.error('Không thể tải sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        // Kiểm tra đã đăng nhập chưa
        if (!auth?.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }

        try {
            const result = await addToCart(product.id, quantity);
            if (result.success) {
                message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
                setQuantity(1); // Reset quantity
            } else {
                message.error(result.error || 'Không thể thêm vào giỏ hàng');
            }
        } catch (error) {
            message.error('Lỗi khi thêm vào giỏ hàng');
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-600">Sản phẩm không tồn tại</p>
            </div>
        );
    }

    const discountedPrice = product.discount 
        ? (product.price * (1 - product.discount / 100)).toFixed(2)
        : product.price;

    const images = product.images || ['https://via.placeholder.com/600x600'];

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <a href="/" className="hover:text-blue-600">Trang chủ</a>
                    {' > '}
                    <a href={`/search?categoryId=${product.category?.id}`} className="hover:text-blue-600">
                        {product.category?.name}
                    </a>
                    {' > '}
                    <span>{product.name}</span>
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Images Section with Swiper */}
                        <div>
                            {/* Main Swiper */}
                            <Swiper
                                modules={[Navigation, Pagination, Thumbs]}
                                navigation
                                pagination={{ clickable: true }}
                                thumbs={{ swiper: thumbsSwiper }}
                                className="mb-4 rounded-lg overflow-hidden"
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="bg-gray-100 h-96 flex items-center justify-center">
                                            <img 
                                                src={image}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Thumbnail Swiper */}
                            {images.length > 1 && (
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    modules={[Thumbs]}
                                >
                                    {images.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <img 
                                                src={image}
                                                alt={`thumbnail-${index}`}
                                                className="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-600"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div>
                            {/* Title and Badges */}
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                            
                            <div className="flex gap-2 mb-4">
                                {product.isNew && (
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold">
                                        ⭐ Sản phẩm mới
                                    </span>
                                )}
                                {product.isHotSale && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                                        🔥 Bán chạy
                                    </span>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-xl">
                                            {i < Math.floor(product.rating) ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-600">
                                    {product.rating} ({product.reviewCount} đánh giá)
                                </span>
                                <span className="text-gray-600">
                                    Đã bán: <span className="font-bold">{product.sold}</span>
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6 pb-6 border-b">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-bold text-red-600">
                                        {parseFloat(discountedPrice).toLocaleString('vi-VN')}₫
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="text-2xl text-gray-400 line-through">
                                            {product.price.toLocaleString('vi-VN')}₫
                                        </span>
                                    )}
                                </div>
                                {product.discount > 0 && (
                                    <p className="text-orange-500 font-semibold">Tiết kiệm {product.discount}%</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="mb-6 pb-6 border-b">
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Tình trạng hàng:</span>{' '}
                                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                                    </span>
                                </p>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="mb-6 flex gap-4 items-center">
                                <span className="text-gray-700 font-semibold">Số lượng:</span>
                                <InputNumber 
                                    min={1}
                                    max={product.stock}
                                    value={quantity}
                                    onChange={setQuantity}
                                    disabled={product.stock === 0}
                                />
                                <Button 
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="!bg-blue-600 !border-blue-600"
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                            </div>

                            {/* Additional Actions */}
                            <div className="flex gap-4">
                                <Button 
                                    type="default"
                                    size="large"
                                    icon={<HeartOutlined />}
                                >
                                    Yêu thích
                                </Button>
                                <Button 
                                    type="default"
                                    size="large"
                                    icon={<ShareAltOutlined />}
                                >
                                    Chia sẻ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 border-blue-600 pb-2 inline-block">
                        Mô tả sản phẩm
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {product.description || 'Không có mô tả'}
                    </p>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-blue-600 pb-2 inline-block">
                            Sản phẩm tương tự
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
