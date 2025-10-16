import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/user/UserNavbar";
import Footer from "../components/Footer/Footer";

const UserLayout = () => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 min-h-screen flex flex-col">
      <UserNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
