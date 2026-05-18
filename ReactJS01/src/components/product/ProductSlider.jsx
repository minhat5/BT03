import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import ProductCard from './ProductCard';
import axios from '../../util/axios.customize';

const ProductSlider = ({ title, queryParams = {} }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    limit: 8,
                    ...queryParams
                });
                const res = await axios.get(`/v1/api/products/featured?${params}`);
                if (res && res.success) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [queryParams]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spin />
            </div>
        );
    }

    return (
        <div className="mb-16 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
                    {title}
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
            </div>

            {/* Products Grid - 4 columns on desktop, responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((product, index) => (
                    <div key={product.id} className={`animate-slideIn`} style={{ animationDelay: `${index * 50}ms` }}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* No products message */}
            {products.length === 0 && (
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSlider;
