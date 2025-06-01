import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function HeroSection() {
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
          Find the{" "}
          <span className="text-[#60A5FA]">
            best courses
          </span>{" "}
          for You
        </h1>
        <p className="text-[#CBD5E1] dark:text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
          Your skills leveling up faster than your WiFi speed!
        </p>
      </div>

      <div  >
        <form
        
        action=""
        className="flex items-center bg-white dark:bg-black rounded-full shadow-xl max-w-2xl mx-auto mb-10 overflow-hidden transition-all hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 hover:shadow-2xl p-1"
      >
        <Input
          type="text"
          
          className="flex-grow border-none focus-visible:ring-0 px-6 py-4 text-gray-800  placeholder-gray-400 dark:text-gray-100 dark:bg-black  dark:placeholder-gray-500 text-lg"
          placeholder="Search courses here..."
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] dark:from-blue-700 dark:to-indigo-700 text-white px-8 py-6 rounded-full hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 font-medium text-lg"
        >
          Search
        </Button>
      </form>
      </div>

      <Button className=" backdrop-blur-sm border border-white/20 bg-[#1E40AF] text-white hover:bg-[#4338CA] rounded-full  px-8 py-6 font-medium text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105">
        Explore Courses
      </Button>
    </div>
  );
}

export default HeroSection;
