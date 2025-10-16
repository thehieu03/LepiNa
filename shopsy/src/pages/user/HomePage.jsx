import React from "react";
import Hero from "../../components/Hero/Hero";
import Products from "../../components/Products/Products";
import TopProducts from "../../components/TopProducts/TopProducts";
import Banner from "../../components/Banner/Banner";
import Subscribe from "../../components/Subscribe/Subscribe";
import Testimonials from "../../components/Testimonials/Testimonials";
import Popup from "../../components/Popup/Popup";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <div id="home">
        <Hero handleOrderPopup={handleOrderPopup} />
      </div>
      <div id="products">
        <Products />
      </div>
      <div id="top-products">
        <TopProducts handleOrderPopup={handleOrderPopup} />
      </div>
      <div id="banner">
        <Banner />
      </div>
      <div id="subscribe">
        <Subscribe />
      </div>
      <div id="products-2">
        <Products />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="tools" className="container py-16">
        <h2 className="text-2xl font-semibold mb-2">Dụng cụ làm vườn</h2>
        <p className="text-gray-500 text-sm">Mục này sẽ cập nhật sớm.</p>
      </div>
      <div id="blog" className="container py-16">
        <h2 className="text-2xl font-semibold mb-2">Kiến thức nông nghiệp</h2>
        <p className="text-gray-500 text-sm">
          Bài viết hướng dẫn sử dụng thuốc sinh học đúng cách sẽ hiển thị tại
          đây.
        </p>
      </div>
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </>
  );
};

export default HomePage;
