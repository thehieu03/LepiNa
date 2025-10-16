import React from "react";
import Slider from "react-slick";

const TestimonialData = [
  {
    id: 1,
    name: "Anh Hùng - Nông dân lúa, Thái Bình",
    text:
      "Dùng LEPINA 3 ngày là thấy rầy nâu giảm hẳn. Lúa khỏe hơn, không mùi hóa chất khó chịu.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Chị Lan - Trồng rau sạch, Đà Lạt",
    text:
      "Sâu cuốn lá và rệp sáp được kiểm soát tốt. Rau thu hoạch an toàn, khách rất yên tâm.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Anh Tâm - Vườn cây ăn trái, Bến Tre",
    text:
      "Sản phẩm sinh học, dễ pha, mùi nhẹ. Dùng cho ổi và mít thấy hiệu quả rõ rệt.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 5,
    name: "Hợp tác xã An Phú",
    text:
      "Chuyển đổi sang thuốc sinh học LEPINA giúp giảm chi phí lâu dài, cây ít bị cháy lá.",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonials = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-10 mb-10">
      <div className="container">
        {/* header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Khách hàng nói gì về LEPINA
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Đánh giá thực tế
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Ý kiến từ nông dân và hợp tác xã trên khắp Việt Nam sau khi sử dụng
            thuốc trừ sâu sinh học.
          </p>
        </div>

        {/* Testimonial cards */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div className="my-6">
                <div
                  key={data.id}
                  className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-primary/10 relative"
                >
                  <div className="mb-4">
                    <img
                      src={data.img}
                      alt=""
                      className="rounded-full w-20 h-20"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500">{data.text}</p>
                      <h1 className="text-xl font-bold text-black/80 dark:text-light">
                        {data.name}
                      </h1>
                    </div>
                  </div>
                  <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
