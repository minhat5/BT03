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
        <div className="mb-12">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
                    {title}
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductSlider;
