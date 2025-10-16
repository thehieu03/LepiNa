import React from "react";
import { createOrder } from "../../api/client";
import { IoCloseOutline } from "react-icons/io5";

const Popup = ({ orderPopup, setOrderPopup }) => {
  return (
    <>
      {orderPopup && (
        <div className="popup">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[300px]">
              {/* header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1>Đặt hàng nhanh</h1>
                </div>
                <div>
                  <IoCloseOutline
                    className="text-2xl cursor-pointer "
                    onClick={() => setOrderPopup(false)}
                  />
                </div>
              </div>
              {/* form section */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className=" w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className=" w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ nhận hàng"
                  className=" w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                />
                <input
                  type="text"
                  placeholder="Sản phẩm cần mua (ví dụ: LEPINA Trị rệp sáp)"
                  className=" w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  className=" w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                />
                <div className="flex justify-center">
                  <button
                    className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full "
                    onClick={async () => {
                      const form = document.querySelector(".popup");
                      const inputs = form.querySelectorAll("input");
                      const [name, email, address, product, phone] = Array.from(inputs).map((i) => i.value.trim());
                      try {
                        const payload = {
                          name,
                          email,
                          phone,
                          address,
                          items: [{ product_id: 1, quantity: 1 }],
                        };
                        await createOrder(payload);
                        alert("Đã gửi đơn hàng! Chúng tôi sẽ liên hệ sớm.");
                        setOrderPopup(false);
                      } catch (e) {
                        alert("Gửi đơn thất bại: " + (e.response?.data || e.message));
                      }
                    }}
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
