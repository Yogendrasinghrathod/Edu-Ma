import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate=useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if(searchQuery.trim()!==""){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("")
  };

  return (
    <div className="relative  bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] dark:from-gray-800 dark:to-gray-900 py-32 px-4 text-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-400 opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-300 opacity-10 rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-[#1E40AF]">
        <h1 className=" text-white font-extrabold text-4xl md:text-5xl text-center leading-tight  mb-6 ">
          Find the <span className="text-[#60A5FA]">best courses</span> for You
        </h1>
        <p className="text-[#CBD5E1] dark:text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
          Your skills leveling up faster than your WiFi speed!
        </p>
        <form
          onSubmit={searchHandler}
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Search
          </Button>
        </form>
      </div>

      <Button
        onClick={() => navigate(`/course/search?query`)}
        className=" backdrop-blur-sm border border-white/20 bg-[#1E40AF] text-white hover:bg-[#4338CA] rounded-full  px-8 py-6 font-medium text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
      >
        Explore Courses
      </Button>
    </div>
  );
}

export default HeroSection;
