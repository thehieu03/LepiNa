import {
  FiBarChart,
  FiPieChart,
  FiTrendingUp,
  FiDownload,
} from "react-icons/fi";

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Báo cáo & Thống kê
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Xem và xuất các báo cáo chi tiết về hoạt động kinh doanh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Báo cáo Doanh thu
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                12
              </p>
            </div>
            <FiBarChart className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Thống kê Khảo sát
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                8
              </p>
            </div>
            <FiPieChart className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Phân tích Xu hướng
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                6
              </p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Báo cáo Xuất
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                24
              </p>
            </div>
            <FiDownload className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Loại Báo cáo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Báo cáo Doanh thu</h4>
            <p className="text-sm text-gray-500">
              Phân tích doanh thu theo thời gian
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Báo cáo Sản phẩm</h4>
            <p className="text-sm text-gray-500">Thống kê sản phẩm bán chạy</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Báo cáo Khách hàng</h4>
            <p className="text-sm text-gray-500">
              Phân tích hành vi khách hàng
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Báo cáo Đơn hàng</h4>
            <p className="text-sm text-gray-500">
              Thống kê đơn hàng và trạng thái
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Thống kê Khảo sát</h4>
            <p className="text-sm text-gray-500">Kết quả các cuộc khảo sát</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Báo cáo Marketing</h4>
            <p className="text-sm text-gray-500">
              Hiệu quả các chiến dịch marketing
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
