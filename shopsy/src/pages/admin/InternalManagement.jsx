import { FiUsers, FiClipboard, FiGift } from "react-icons/fi";

const InternalManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý Nội bộ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý tác vụ, thành viên nhóm và chính sách giảm giá
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nhiệm vụ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                24
              </p>
            </div>
            <FiClipboard className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Thành viên
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                8
              </p>
            </div>
            <FiUsers className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Chính sách
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                6
              </p>
            </div>
            <FiGift className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quản lý Nội bộ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Quản lý Tác vụ</h4>
            <p className="text-sm text-gray-500">
              Tạo và theo dõi các tác vụ nội bộ
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Quản lý Thành viên</h4>
            <p className="text-sm text-gray-500">
              Quản lý thông tin thành viên nhóm
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Chính sách Giảm giá</h4>
            <p className="text-sm text-gray-500">
              Thiết lập và quản lý chính sách giảm giá
            </p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium">Cài đặt Hệ thống</h4>
            <p className="text-sm text-gray-500">
              Cấu hình các thông số hệ thống
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternalManagement;
