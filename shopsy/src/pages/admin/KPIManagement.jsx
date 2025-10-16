import { FiTarget, FiTrendingUp, FiBarChart } from "react-icons/fi";

const KPIManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý KPI & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Theo dõi và quản lý các chỉ số hiệu suất quan trọng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Định nghĩa KPI
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                15
              </p>
            </div>
            <FiTarget className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Đo lường
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                48
              </p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Mục tiêu
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                12
              </p>
            </div>
            <FiBarChart className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quản lý KPI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Định nghĩa KPI</h4>
            <p className="text-sm text-gray-500">
              Tạo và quản lý các định nghĩa KPI
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Đo lường KPI</h4>
            <p className="text-sm text-gray-500">
              Theo dõi và đo lường các KPI
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Mục tiêu tuần</h4>
            <p className="text-sm text-gray-500">
              Thiết lập và theo dõi mục tiêu hàng tuần
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Báo cáo Analytics</h4>
            <p className="text-sm text-gray-500">
              Xem báo cáo và phân tích dữ liệu
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPIManagement;
