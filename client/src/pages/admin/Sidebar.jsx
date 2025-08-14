import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex dark:bg-gray-700  ">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 md:space-y-2 border-r border-r-gray-300 dark:border-r-gray-700  bg-[#f0f0f0] p-5 sticky top-0 h-screen my-0 dark:bg-gray-700 dark:text-white md:">
        <div className="space-y-4 mt-20 ">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} />
            <h1>DashBoard</h1>
          </Link>
          <Link to="/admin/course" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
        </div>
      </div>
      <div className="flex-1 md:p-10 p-24 bg-white mt-10 ml-10 dark:bg-gray-600">
        <Outlet/>
      </div>
    </div>
  );
};

export default Sidebar;
