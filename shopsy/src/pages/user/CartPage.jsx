import { Link } from "react-router-dom";
import PlaceholderImg from "../../assets/image.png";
import { useCart } from "../../hooks/useCart.jsx";
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")
    ) {
      clearCart();
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <FiShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-8">
            Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm.
          </p>
          <Link
            to="/products"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || PlaceholderImg}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-primary font-bold text-xl">
                      {new Intl.NumberFormat("vi-VN").format(item.price)} đ
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
                      }}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("vi-VN").format(
                      item.price * item.quantity
                    )}{" "}
                    đ
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-primary">
                  {new Intl.NumberFormat("vi-VN").format(getTotalPrice())} đ
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors text-center block mt-6"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
