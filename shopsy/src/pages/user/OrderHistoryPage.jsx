import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersAPI } from "../../api/client";
import { useAuth } from "../../contexts/AuthContext";
import { FiPackage, FiCalendar, FiDollarSign, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

const OrderHistoryPage = () => {
  const { user } = useAuth();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => ordersAPI.getByCustomerId(user?.id),
    enabled: !!user?.id,
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status || "Không xác định";
    }
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

  if (error) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Không thể tải đơn hàng
          </h2>
          <p className="text-gray-500">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Chưa có đơn hàng nào</h2>
          <p className="text-gray-500 mb-8">
            Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
          </p>
          <Link
            to="/products"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FiPackage className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold">#{order.id}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-primary text-lg">
                    {new Intl.NumberFormat("vi-VN").format(
                      order.totalAmountVnd || order.total_amount_vnd || 0
                    )}{" "}
                    đ
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(
                      order.orderDate || order.order_date
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    Kênh: {order.channel || "Website"}
                  </span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Sản phẩm:</h3>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.productName || item.name} x {item.quantity}
                        </span>
                        <span>
                          {new Intl.NumberFormat("vi-VN").format(
                            item.unitPrice * item.quantity
                          )}{" "}
                          đ
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-500">
                        ... và {order.items.length - 3} sản phẩm khác
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>Địa chỉ: {order.address}</p>
                  {order.notes && <p>Ghi chú: {order.notes}</p>}
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <FiEye className="h-4 w-4" />
                  <span>Xem chi tiết</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
