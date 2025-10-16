import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiTarget,
  FiSettings,
  FiBarChart,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: FiHome,
      path: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: FiPackage,
      path: "/admin/products",
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: FiShoppingBag,
      path: "/admin/orders",
    },
    {
      id: "customers",
      label: "Khách hàng",
      icon: FiUsers,
      path: "/admin/customers",
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: FiTrendingUp,
      path: "/admin/marketing",
    },
    { id: "kpi", label: "KPI & Analytics", icon: FiTarget, path: "/admin/kpi" },
    {
      id: "internal",
      label: "Nội bộ",
      icon: FiSettings,
      path: "/admin/internal",
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: FiBarChart,
      path: "/admin/reports",
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full"
          >
            <FiLogOut className="h-5 w-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
