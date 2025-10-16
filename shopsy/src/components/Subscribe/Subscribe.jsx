import React from "react";
import Banner from "../../assets/website/orange-pattern.jpg";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const Subscribe = () => {
  return (
    <div
      data-aos="zoom-in"
      className="mb-20 bg-gray-100 dark:bg-gray-800 text-white "
      style={BannerImg}
    >
      <div className="container backdrop-blur-sm py-10">
        <div className="space-y-6 max-w-xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            Đăng ký nhận ưu đãi & kiến thức canh tác an toàn
          </h1>
          <p className="text-sm opacity-90">
            Cập nhật sản phẩm mới, hướng dẫn sử dụng thuốc sinh học đúng cách.
          </p>
          <div className="flex gap-2 items-center justify-center">
            <input
              data-aos="fade-up"
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full p-3 rounded-md text-gray-900"
            />
            <button className="bg-primary hover:brightness-110 duration-200 text-white py-3 px-5 rounded-md whitespace-nowrap">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
