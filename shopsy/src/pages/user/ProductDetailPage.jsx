import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsAPI, feedbackAPI } from "../../api/client";
import { useCart } from "../../hooks/useCart.jsx";
import toast from "react-hot-toast";
import { FiShoppingCart, FiStar, FiUser, FiArrowLeft } from "react-icons/fi";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
  });

  const { data: feedback = [] } = useQuery({
    queryKey: ["product-feedback", id],
    queryFn: () => feedbackAPI.getByProductId(id),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return 0;
    const totalRating = feedback.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return (totalRating / feedback.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-500 mb-8">
            Sản phẩm này có thể đã bị xóa hoặc không tồn tại.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8"
      >
        <FiArrowLeft className="h-5 w-5" />
        <span>Quay lại</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={
                product.image_url ||
                product.imageUrl ||
                "https://via.placeholder.com/600x600?text=No+Image"
              }
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {feedback.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`h-5 w-5 ${
                        star <= getAverageRating()
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {getAverageRating()} ({feedback.length} đánh giá)
                </span>
              </div>
            )}

            <p className="text-primary font-bold text-3xl mb-6">
              {new Intl.NumberFormat("vi-VN").format(product.price_vnd || 0)} đ
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description ||
                product.Description ||
                "Chưa có mô tả chi tiết."}
            </p>
          </div>

          {product.origin && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Nguồn gốc</h3>
              <p className="text-gray-600">{product.origin}</p>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Số lượng</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiShoppingCart className="h-5 w-5" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      {feedback.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Đánh giá khách hàng</h2>
          <div className="space-y-6">
            {feedback.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {review.customerName || "Khách hàng"}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (review.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-600">{review.comment}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(
                    review.createdAt || review.created_at
                  ).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
