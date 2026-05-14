import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spin, InputNumber, Select, Button, Pagination } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import axios from '../../util/axios.customize';
import ProductCard from '../../components/product/ProductCard';

const SearchFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // Filter states
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        categoryId: searchParams.get('categoryId') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: searchParams.get('sortBy') || 'newest',
        page: parseInt(searchParams.get('page')) || 1,
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/v1/api/categories');
                if (res && res.success) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();

                if (filters.search) params.append('search', filters.search);
                if (filters.categoryId) params.append('categoryId', filters.categoryId);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                if (filters.sortBy) params.append('sortBy', filters.sortBy);
                params.append('page', filters.page);
                params.append('limit', 12);

                const res = await axios.get(`/v1/api/products?${params}`);
                if (res && res.success) {
                    setProducts(res.data);
                    setTotal(res.total);
                }

                // Update URL
                setSearchParams(params);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters, setSearchParams]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to page 1 when filter changes
        }));
    };

    const handleReset = () => {
        setFilters({
            search: '',
            categoryId: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest',
            page: 1,
        });
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Tìm kiếm sản phẩm</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Bộ lọc</h2>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập từ khóa..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Danh mục
                            </label>
                            <Select
                                value={filters.categoryId || 'all'}
                                onChange={(value) => handleFilterChange('categoryId', value === 'all' ? '' : value)}
                                className="w-full"
                                options={[
                                    { label: 'Tất cả danh mục', value: 'all' },
                                    ...categories.map((cat) => ({
                                        label: cat.name,
                                        value: String(cat.id)
                                    }))
                                ]}
                            />
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Khoảng giá
                            </label>
                            <div className="space-y-2">
                                <InputNumber
                                    placeholder="Giá tối thiểu"
                                    min={0}
                                    value={filters.minPrice ? parseInt(filters.minPrice) : ''}
                                    onChange={(value) => handleFilterChange('minPrice', value || '')}
                                    className="w-full"
                                />
                                <InputNumber
                                    placeholder="Giá tối đa"
                                    min={0}
                                    value={filters.maxPrice ? parseInt(filters.maxPrice) : ''}
                                    onChange={(value) => handleFilterChange('maxPrice', value || '')}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Sắp xếp theo
                            </label>
                            <Select
                                value={filters.sortBy}
                                onChange={(value) => handleFilterChange('sortBy', value)}
                                className="w-full"
                                options={[
                                    { label: 'Mới nhất', value: 'newest' },
                                    { label: 'Bán chạy nhất', value: 'best-selling' },
                                    { label: 'Giá thấp đến cao', value: 'price-asc' },
                                    { label: 'Giá cao đến thấp', value: 'price-desc' },
                                    { label: 'Đánh giá cao nhất', value: 'rating' },
                                ]}
                            />
                        </div>

                        {/* Reset Button */}
                        <Button
                            block
                            type="primary"
                            danger
                            icon={<ClearOutlined />}
                            onClick={handleReset}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>

                    {/* Products Grid */}
                    <div className="md:col-span-3">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Spin size="large" />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                {/* Product Count */}
                                <div className="mb-4 text-gray-600">
                                    Tìm thấy <span className="font-bold text-blue-600">{total}</span> sản phẩm
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center mb-8">
                                    <Pagination
                                        current={filters.page}
                                        total={total}
                                        pageSize={12}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-center items-center py-12">
                                <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
