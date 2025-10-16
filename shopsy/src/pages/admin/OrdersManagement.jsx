import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "../../api/client";
import { FiEye, FiX, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const OrdersManagement = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: ordersAPI.getAll,
  });

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);
  const { data: orderDetail } = useQuery({
    queryKey: ["admin-order", selectedOrderId],
    queryFn: () => ordersAPI.getDetail(selectedOrderId),
    enabled: !!selectedOrderId && isDetailOpen,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => ordersAPI.updateStatus(id, status),
    onSuccess: (_, { status }) => {
      const message = status === "Confirmed" ? "Duyệt đơn hàng thành công" : "Hủy đơn hàng thành công";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"], exact: true });
      if (selectedOrderId) {
        queryClient.invalidateQueries({
          queryKey: ["admin-order", selectedOrderId],
          exact: true,
        });
      }
    },
    onError: (error) => {
      toast.error(String(error?.response?.data?.detail || error?.message || "Thao tác thất bại"));
    },
  });

  const openDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-purple-100 text-purple-800";
      case "shipping":
        return "bg-indigo-100 text-indigo-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Theo dõi và quản lý tất cả đơn hàng
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.customerName || "Khách hàng"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(
                      order.orderDate || order.order_date
                    ).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Intl.NumberFormat("vi-VN").format(
                      order.totalAmountVnd || order.total_amount_vnd || 0
                    )}{" "}
                    đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => openDetail(order.id)}
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailOpen && orderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Chi tiết đơn hàng #{orderDetail.id}
              </h3>
              <button
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsDetailOpen(false)}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              {(() => {
                const phoneDisplay =
                  (orderDetail.customer && orderDetail.customer.phone) ||
                  orderDetail.phone ||
                  "-";
                const addressDisplay =
                  (orderDetail.customer && orderDetail.customer.address) ||
                  orderDetail.address ||
                  "-";
                return (
                  <>
                    <div>
                      <p>
                        <span className="text-gray-500">Khách hàng:</span>{" "}
                        {(orderDetail.customer && orderDetail.customer.name) ||
                          orderDetail.customerName ||
                          "Khách hàng"}
                      </p>
                      <p>
                        <span className="text-gray-500">Điện thoại:</span>{" "}
                        {phoneDisplay}
                      </p>
                      <p>
                        <span className="text-gray-500">Địa chỉ:</span>{" "}
                        {addressDisplay}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="text-gray-500">Ngày đặt:</span>{" "}
                        {new Date(
                          orderDetail.orderDate || orderDetail.order_date
                        ).toLocaleString("vi-VN")}
                      </p>
                      <p>
                        <span className="text-gray-500">Phương thức:</span>{" "}
                        {orderDetail.paymentMethod || "-"}
                      </p>
                      <p>
                        <span className="text-gray-500">Trạng thái:</span>{" "}
                        {orderDetail.status}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Sản phẩm</h4>
              <div className="border rounded">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium">
                        Sản phẩm
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium">
                        SL
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium">
                        Đơn giá
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(orderDetail.items || orderDetail.orderItems || []).map(
                      (it, idx) => {
                        const name = it.productName || `SP #${it.productId}`;
                        const qty = it.quantity || 0;
                        const price = it.unitPriceVnd || it.unitPrice || 0;
                        return (
                          <tr key={idx}>
                            <td className="px-3 py-2">{name}</td>
                            <td className="px-3 py-2 text-right">{qty}</td>
                            <td className="px-3 py-2 text-right">
                              {new Intl.NumberFormat("vi-VN").format(price)} đ
                            </td>
                            <td className="px-3 py-2 text-right">
                              {new Intl.NumberFormat("vi-VN").format(
                                it.lineTotalVnd || price * qty
                              )}{" "}
                              đ
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                Tổng:{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  orderDetail.totalAmountVnd ||
                    orderDetail.total_amount_vnd ||
                    0
                )}{" "}
                đ
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Đóng
                </button>
                {/* Only show action buttons for Pending orders */}
                {orderDetail.status?.toLowerCase() === "pending" && (
                  <>
                    <button
                      className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                      disabled={updateStatusMutation.isPending}
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: orderDetail.id,
                          status: "Canceled",
                        })
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiX /> Hủy đơn
                      </span>
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
                      disabled={updateStatusMutation.isPending}
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: orderDetail.id,
                          status: "Confirmed",
                        })
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiCheck /> Duyệt đơn
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
