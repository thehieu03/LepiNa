import React from "react";
import { fetchProducts } from "../../api/client";
import Img1 from "../../assets/productThuoc/botri.jpg";
import Img2 from "../../assets/productThuoc/sauducthan.png";
import Img3 from "../../assets/productThuoc/retsap.png";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "LEPINA - Xua Đuổi Bọ Trĩ",
    description:
      "Sản phẩm sinh học từ chanh và vỏ bưởi giúp xua đuổi bọ trĩ hiệu quả, không gây hại đến cây trồng và môi trường. An toàn cho cả rau ăn lá và hoa màu.",
  },
  {
    id: 2,
    img: Img2,
    title: "LEPINA - Trị Sâu Đục Thân",
    description:
      "Diệt sâu đục thân bằng công thức lên men tự nhiên, giúp bảo vệ thân cây mà không cần sử dụng thuốc hóa học. Phù hợp cho lúa, cà chua, ớt và cây ăn trái.",
  },
  {
    id: 3,
    img: Img3,
    title: "LEPINA - Diệt Rệp Sáp Sinh Học",
    description:
      "Chế phẩm sinh học an toàn từ vỏ chanh và tinh dầu thiên nhiên, đặc trị rệp sáp trên cây cảnh, dưa leo, ổi, mít và nhiều loại cây ăn trái khác.",
  },
];
const TopProducts = ({ handleOrderPopup }) => {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    fetchProducts().then(setItems).catch(() => setItems([]));
  }, []);
  return (
    <div>
      <div className="container">
        {/* Header section */}
        <div className="text-left mb-24">
          <p data-aos="fade-up" className="text-sm text-primary">
            Sản Phẩm Sinh Học Được Ưa Chuộng
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Top Sản Phẩm LEPINA Hiệu Quả Nhất
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Những dòng thuốc trừ sâu sinh học chiết xuất từ chanh và vỏ bưởi,
            được tin dùng bởi nông dân Việt nhờ hiệu quả cao và an toàn tuyệt
            đối cho môi trường.
          </p>
        </div>
        {/* Body section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center">
          {(items.length ? items.slice(0, 3) : ProductsData).map((data) => (
            <div
              data-aos="zoom-in"
              className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
            >
              {/* image section */}
              <div className="h-[100px]">
                <img
                  src={data.img || data.image_url || "https://via.placeholder.com/140?text=LEPINA"}
                  alt=""
                  className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                />
              </div>
              {/* details section */}
              <div className="p-4 text-center">
                {/* star rating */}
                <div className="w-full flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>
                <h1 className="text-xl font-bold">{data.title || data.name}</h1>
                <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                  {data.description || data.origin}
                </p>
                {items.length > 0 && (
                  <p className="text-primary font-semibold mt-2">
                    {new Intl.NumberFormat("vi-VN").format(data.price_vnd)} đ
                  </p>
                )}
                <button
                  className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                  onClick={handleOrderPopup}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
