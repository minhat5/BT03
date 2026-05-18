import { useEffect, useState } from 'react';
import { Spin, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from '../../util/axios.customize';
import ProductCard from './ProductCard';

const HorizontalProductSlider = ({ title, apiEndpoint }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get(apiEndpoint);
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
    }, [apiEndpoint]);

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedProducts = products.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spin />
            </div>
        );
    }

    return (
        <div className="mb-16 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mt-2" />
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            type="text"
                            size="large"
                            icon={<LeftOutlined />}
                            onClick={handlePrevious}
                            className="hover:bg-blue-100 hover:text-blue-600 rounded-full"
                        />
                        <Button
                            type="text"
                            size="large"
                            icon={<RightOutlined />}
                            onClick={handleNext}
                            className="hover:bg-blue-100 hover:text-blue-600 rounded-full"
                        />
                    </div>
                )}
            </div>

            {/* Products Slider */}
            {products.length > 0 ? (
                <>
                    <div className="relative overflow-hidden">
                        {/* Carousel with smooth animation */}
                        <div className="flex gap-5 transition-transform duration-500">
                            {displayedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex-shrink-0 w-1/5 animate-slideIn"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3 mt-8">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        index === currentPage
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 w-8 h-2'
                                            : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
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

export default HorizontalProductSlider;
