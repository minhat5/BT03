import { useEffect, useState, useRef, useCallback } from 'react';
import { Spin, Pagination, Button } from 'antd';
import axios from '../../util/axios.customize';
import ProductCard from './ProductCard';

const CategoryProducts = ({ categoryId, categoryName }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [useInfiniteScroll, setUseInfiniteScroll] = useState(window.innerWidth < 768);
    const observerTarget = useRef(null);
    const observerRef = useRef(null);
    const [allProducts, setAllProducts] = useState([]);
    const prevCategoryRef = useRef(null);
    const prevModeRef = useRef(null);
    const limit = 12;

    // Fetch products for pagination mode
    const fetchProducts = useCallback(async (pageNum) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/v1/api/products/category/${categoryId}?page=${pageNum}&limit=${limit}`
            );
            if (res && res.success) {
                setProducts(res.data);
                setTotal(res.total);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [categoryId, limit]);

    // Fetch products for infinite scroll mode
    const fetchMoreProducts = useCallback(async (pageNum) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/v1/api/products/category/${categoryId}?page=${pageNum}&limit=${limit}`
            );
            if (res && res.success) {
                setAllProducts(prev => pageNum === 1 ? res.data : [...prev, ...res.data]);
                setTotal(res.total);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [categoryId, limit]);

    // Initial fetch when category or mode changes
    useEffect(() => {
        const categoryChanged = prevCategoryRef.current !== categoryId;
        const modeChanged = prevModeRef.current !== useInfiniteScroll;

        if (!categoryChanged && !modeChanged) return;

        prevCategoryRef.current = categoryId;
        prevModeRef.current = useInfiniteScroll;

        // Use a microtask to defer state updates
        Promise.resolve().then(() => {
            if (useInfiniteScroll) {
                fetchMoreProducts(1);
            } else {
                setPage(1);
                fetchProducts(1);
            }
        });
    }, [categoryId, useInfiniteScroll, fetchProducts, fetchMoreProducts]);

    // Infinite scroll observer
    useEffect(() => {
        if (!useInfiniteScroll || loading) return;

        const currentTarget = observerTarget.current;
        
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && allProducts.length < total) {
                    const nextPage = Math.ceil(allProducts.length / limit) + 1;
                    fetchMoreProducts(nextPage, false);
                }
            },
            { threshold: 0.1 }
        );

        if (currentTarget) {
            observerRef.current.observe(currentTarget);
        }

        return () => {
            if (currentTarget && observerRef.current) {
                observerRef.current.unobserve(currentTarget);
            }
        };
    }, [useInfiniteScroll, allProducts.length, total, limit, fetchMoreProducts, loading]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleLoadMode = () => {
        setUseInfiniteScroll(!useInfiniteScroll);
    };

    const displayedProducts = useInfiniteScroll ? allProducts : products;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-8 px-4">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                        {categoryName}
                    </h1>
                    <p className="text-blue-100 text-lg flex items-center gap-2">
                        <span className="inline-block">📦</span>
                        Tổng cộng <span className="font-bold text-white ml-2 text-xl">{total}</span> sản phẩm
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">Sắp xếp:</span>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 focus:outline-none focus:border-blue-500">
                            <option>Mới nhất</option>
                            <option>Bán chạy nhất</option>
                            <option>Giá thấp đến cao</option>
                            <option>Giá cao đến thấp</option>
                        </select>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleToggleLoadMode}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 border-0 font-semibold"
                    >
                        {useInfiniteScroll ? '📄 Phân trang' : '∞ Lazy Load'}
                    </Button>
                </div>

                {/* Products Grid */}
                {loading && displayedProducts.length === 0 ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="text-center">
                            <Spin size="large" className="mb-4" />
                            <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
                        </div>
                    </div>
                ) : displayedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mb-12">
                            {displayedProducts.map((product) => (
                                <div key={product.id} className="animate-fadeIn">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Load More Indicator */}
                        {useInfiniteScroll && loading && (
                            <div className="flex justify-center py-12">
                                <div className="text-center">
                                    <Spin />
                                    <p className="text-gray-600 mt-4">Đang tải thêm...</p>
                                </div>
                            </div>
                        )}

                        {/* Infinite Scroll Target */}
                        {useInfiniteScroll && allProducts.length < total && (
                            <div ref={observerTarget} className="h-12 flex justify-center items-center" />
                        )}

                        {/* Pagination */}
                        {!useInfiniteScroll && (
                            <div className="flex justify-center py-12">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <Pagination
                                        current={page}
                                        total={total}
                                        pageSize={limit}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                        showTotal={(total) => `Tổng cộng ${total} sản phẩm`}
                                        style={{ fontSize: '14px' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* End of list message */}
                        {useInfiniteScroll && allProducts.length >= total && (
                            <div className="text-center py-12">
                                <div className="inline-block bg-white rounded-lg shadow p-8">
                                    <p className="text-2xl mb-2">🎉</p>
                                    <p className="text-gray-700 font-medium text-lg">
                                        Bạn đã xem hết tất cả sản phẩm
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Có {total.toLocaleString('vi-VN')} sản phẩm trong danh mục này
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex justify-center items-center py-32">
                        <div className="text-center">
                            <p className="text-6xl mb-4">📭</p>
                            <p className="text-lg text-gray-600 font-medium">
                                Không tìm thấy sản phẩm nào
                            </p>
                            <p className="text-gray-500 mt-2">
                                Hãy thử tìm kiếm với từ khóa khác
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;
