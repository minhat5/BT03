import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../util/axios.customize';
import CategoryProducts from '../../components/product/CategoryProducts';
import { Spin } from 'antd';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`/v1/api/categories/${categoryId}`);
                if (res && res.success) {
                    setCategoryName(res.data.name);
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return <CategoryProducts categoryId={categoryId} categoryName={categoryName} />;
};

export default CategoryPage;
