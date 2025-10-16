import React from "react";
import { FiTrendingUp, FiCalendar, FiEdit3, FiShare2 } from "react-icons/fi";

const MarketingManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý Marketing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý chiến dịch, sự kiện và nội dung marketing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Chiến dịch
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                12
              </p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sự kiện
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                8
              </p>
            </div>
            <FiCalendar className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Bài viết
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                24
              </p>
            </div>
            <FiEdit3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Kênh</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                6
              </p>
            </div>
            <FiShare2 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Chức năng Marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Quản lý Chiến dịch</h4>
            <p className="text-sm text-gray-500">
              Tạo và quản lý các chiến dịch marketing
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Quản lý Sự kiện</h4>
            <p className="text-sm text-gray-500">
              Tổ chức và theo dõi các sự kiện
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Quản lý Nội dung</h4>
            <p className="text-sm text-gray-500">
              Tạo và quản lý nội dung marketing
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Quản lý Kênh</h4>
            <p className="text-sm text-gray-500">Quản lý các kênh marketing</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingManagement;
