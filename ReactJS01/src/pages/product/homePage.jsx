import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import axios from '../../util/axios.customize';
import ProductSlider from '../../components/product/ProductSlider';

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
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-14 md:py-20">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/80 mb-3">TechShop</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Chào mừng đến TechShop
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                        Khám phá những sản phẩm công nghệ tốt nhất với giá ưu đãi, giao hàng nhanh và bảo hành chính hãng.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a
                            href="/search"
                            className="inline-flex items-center justify-center rounded-full bg-white text-blue-700 px-6 py-2.5 font-semibold shadow-lg hover:shadow-xl transition"
                        >
                            Mua ngay
                        </a>
                        <a
                            href="/search?sortBy=best-selling"
                            className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-2.5 font-semibold text-white hover:bg-white/10 transition"
                        >
                            Xem bán chạy
                        </a>
                    </div>
                </div>
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Categories Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Danh mục sản phẩm
                        </h2>
                        <a href="/search" className="text-blue-600 font-medium hover:text-blue-700">
                            Xem tất cả →
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {categories.map((category) => (
                            <div key={category.id} className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    <span className="absolute left-4 bottom-4 text-white text-lg font-semibold">
                                        {category.name}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                                        {category.description}
                                    </p>
                                    <a
                                        href={`/search?categoryId=${category.id}`}
                                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                                    >
                                        Khám phá
                                        <span aria-hidden="true">→</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hot Sale Products */}
                <ProductSlider 
                    title="🔥 Sản phẩm bán chạy"
                    queryParams={{ isHotSale: 'true', sortBy: 'best-selling' }}
                />

                {/* New Products */}
                <ProductSlider 
                    title="⭐ Sản phẩm mới nhất"
                    queryParams={{ isNew: 'true', sortBy: 'newest' }}
                />

                {/* All Products */}
                <ProductSlider 
                    title="📱 Tất cả sản phẩm"
                    queryParams={{ sortBy: 'rating' }}
                />
            </div>
        </div>
    );
};

export default HomePage;
