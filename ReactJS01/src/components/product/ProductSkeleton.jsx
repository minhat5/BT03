const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-300"></div>

            {/* Content Skeleton */}
            <div className="p-3 space-y-3">
                {/* Title */}
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>

                {/* Rating */}
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>

                {/* Price */}
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>

                {/* Stock */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
