import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import axios from '../../util/axios.customize';
import ProductSlider from '../../components/product/ProductSlider';
import HorizontalProductSlider from '../../components/product/HorizontalProductSlider';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/v1/api/categories');
                if (res && res.success) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Banner - Ultra Premium */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                    <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
                </div>

                {/* Content */}
                <div className="relative container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-200 mb-3 font-semibold">🚀 TechShop Premium</p>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                            Mua Sắm Công Nghệ <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Tương Lai</span>
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                            Khám phá những sản phẩm công nghệ tốt nhất với giá ưu đãi, giao hàng nhanh chóng và bảo hành chính hãng 100%.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="/search"
                                className="inline-flex items-center justify-center rounded-full bg-white text-blue-600 px-8 py-3.5 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                ✨ Mua Ngay
                            </a>
                            <a
                                href="/search?sortBy=best-selling"
                                className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3.5 font-bold text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur"
                            >
                                🔥 Xem Bán Chạy
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative shapes */}
                <div className="absolute -right-20 -bottom-20 w-60 h-60 border-2 border-white/10 rounded-full" />
                <div className="absolute -left-10 top-20 w-40 h-40 border-2 border-white/10 rounded-full" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {/* Categories Section - Premium Grid */}
                <section className="mb-20">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                🎯 Danh Mục Sản Phẩm
                            </h2>
                            <div className="h-1.5 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mt-2" />
                        </div>
                        <a href="/search" className="text-blue-600 font-bold hover:text-blue-700 text-lg transition-colors">
                            Xem tất cả →
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <a
                                key={category.id}
                                href={`/category/${category.id}`}
                                className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/80 text-sm line-clamp-2">
                                        {category.description}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Hot Sale Products */}
                <ProductSlider 
                    title="🔥 Sản phẩm bán chạy"
                    queryParams={{ isHotSale: 'true', sortBy: 'best-selling' }}
                />

                {/* Best Selling Products - Horizontal */}
                <HorizontalProductSlider 
                    title="⭐ 10 Sản phẩm bán chạy nhất"
                    apiEndpoint="/v1/api/products/best-selling?limit=10"
                />

                {/* New Products */}
                <ProductSlider 
                    title="✨ Sản phẩm mới nhất"
                    queryParams={{ isNew: 'true', sortBy: 'newest' }}
                />

                {/* Most Viewed Products - Horizontal */}
                <HorizontalProductSlider 
                    title="👁️ 10 Sản phẩm xem nhiều nhất"
                    apiEndpoint="/v1/api/products/most-viewed?limit=10"
                />

                {/* All Products */}
                <ProductSlider 
                    title="📱 Tất cả sản phẩm"
                    queryParams={{ sortBy: 'rating' }}
                />

                {/* Special Offer Banner */}
                <section className="mt-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 text-white text-center shadow-2xl">
                    <h3 className="text-3xl font-bold mb-4">🎁 Ưu Đãi Đặc Biệt</h3>
                    <p className="text-lg text-blue-100 mb-6">
                        Hãy đăng ký nhận bản tin để nhận thêm 10% giảm giá cho lần mua tiếp theo
                    </p>
                    <div className="flex gap-3 max-w-sm mx-auto">
                        <input 
                            type="email" 
                            placeholder="Nhập email của bạn..."
                            className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none"
                        />
                        <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:shadow-lg transition">
                            Đăng ký
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
