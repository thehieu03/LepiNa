import React from "react";
import PlaceholderImg from "../../assets/image.png";
import { fetchProducts } from "../../api/client";
// Unused demo images removed to satisfy linter
import Product1 from "../../assets/productThuoc/botri.jpg";
import Product2 from "../../assets/productThuoc/saucuonla.jpg";
import Product3 from "../../assets/productThuoc/retsap.png";
import Product4 from "../../assets/productThuoc/sauducthan.png";
import { FaStar } from "react-icons/fa6";

const ProductsData = [
  {
    id: 1,
    img: Product1,
    title: "LEPINA - Diệt Rầy Nâu",
    rating: 5.0,
    color: "Xanh lá",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Product2,
    title: "LEPINA - Trừ Sâu Cuốn Lá",
    rating: 4.8,
    color: "Vàng nhạt",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Product3,
    title: "LEPINA - Diệt Rệp Sáp",
    rating: 4.7,
    color: "Trắng ngà",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Product1,
    title: "LEPINA - Xua Đuổi Bọ Trĩ",
    rating: 4.6,
    color: "Xanh bạc hà",
    aosDelay: "600",
  },
  {
    id: 5,
    img: Product4,
    title: "LEPINA - Trị Sâu Đục Thân",
    rating: 4.9,
    color: "Cam tự nhiên",
    aosDelay: "800",
  },
];

const Products = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message || "Lỗi tải sản phẩm"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Sản phẩm trị sâu yêu thích
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Thuốc trừ sâu
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Khám phá bộ sưu tập thuốc trừ sâu sinh học LEPINA, an toàn cho cây
            trồng và môi trường. Hiệu quả cao, dễ sử dụng.
          </p>
        </div>
        {/* Body section */}
        <div>
          {loading && <p className="text-center">Đang tải dữ liệu...</p>}
          {error && <p className="text-center text-red-500">Lỗi: {error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {(items.length ? items : ProductsData).map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay || 0}
                key={data.id || data.title}
                className="space-y-3"
              >
                <img
                  src={data.img || data.image_url || PlaceholderImg}
                  alt=""
                  className="h-[220px] w-[150px] object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{data.title || data.name}</h3>
                  <p className="text-sm text-gray-600">
                    {data.color || data.origin}
                  </p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{data.rating || "5.0"}</span>
                  </div>
                  {items.length > 0 && (
                    <p className="text-primary font-semibold mt-1">
                      {new Intl.NumberFormat("vi-VN").format(data.price_vnd)} đ
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center">
            <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
              Mua hàng ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
