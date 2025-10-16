import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  analyticsAPI,
  ordersAPI,
  productsAPI,
  customersAPI,
} from "../../api/client";
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiStar,
} from "react-icons/fi";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: analyticsAPI.getDashboard,
  });

  const { data: revenueData } = useQuery({
    queryKey: ["revenue-chart"],
    queryFn: () => analyticsAPI.getRevenueChart("30d"),
  });

  const { data: topProducts } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => analyticsAPI.getTopProducts(5),
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => ordersAPI.getAll(),
  });

  const stats = [
    {
      title: "Tổng sản phẩm",
      value: dashboardData?.totalProducts || 0,
      icon: FiPackage,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Đơn hàng hôm nay",
      value: dashboardData?.todayOrders || 0,
      icon: FiShoppingBag,
      color: "bg-green-500",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Khách hàng mới",
      value: dashboardData?.newCustomers || 0,
      icon: FiUsers,
      color: "bg-purple-500",
      change: "+15%",
      changeType: "increase",
    },
    {
      title: "Doanh thu tháng",
      value: dashboardData?.monthlyRevenue || 0,
      icon: FiDollarSign,
      color: "bg-yellow-500",
      change: "+23%",
      changeType: "increase",
    },
  ];

  const revenueChartData = {
    labels: revenueData?.labels || [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueData?.data || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const topProductsChartData = {
    labels: topProducts?.map((p) => p.name) || [],
    datasets: [
      {
        data: topProducts?.map((p) => p.salesCount) || [],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
      },
    ],
  };

  const orderStatusData = {
    labels: ["Đã giao", "Đang giao", "Chờ xác nhận", "Đã hủy"],
    datasets: [
      {
        data: [
          dashboardData?.deliveredOrders || 0,
          dashboardData?.shippedOrders || 0,
          dashboardData?.pendingOrders || 0,
          dashboardData?.cancelledOrders || 0,
        ],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (dashboardLoading) {
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
            Tổng quan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thống kê và phân tích hệ thống
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.title.includes("Doanh thu")
                      ? new Intl.NumberFormat("vi-VN").format(stat.value)
                      : stat.value}
                    {stat.title.includes("Doanh thu") && " đ"}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "increase" ? (
                      <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <FiTrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.changeType === "increase"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      so với tháng trước
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Doanh thu 30 ngày qua</h3>
          <Line data={revenueChartData} options={chartOptions} />
        </div>

        {/* Order Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h3>
          <Doughnut data={orderStatusData} options={chartOptions} />
        </div>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {topProducts?.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Đã bán: {product.salesCount} sản phẩm
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {new Intl.NumberFormat("vi-VN").format(product.revenue)} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.orderDate || order.order_date
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {new Intl.NumberFormat("vi-VN").format(
                      order.totalAmountVnd || order.total_amount_vnd || 0
                    )}{" "}
                    đ
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Chỉ số KPI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {dashboardData?.conversionRate || "0"}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">Tỷ lệ chuyển đổi</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {dashboardData?.averageOrderValue || "0"}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Giá trị đơn hàng trung bình
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {dashboardData?.customerSatisfaction || "0"}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Mức độ hài lòng khách hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
