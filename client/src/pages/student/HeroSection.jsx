import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 py-32 px-4 text-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-400 opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-300 opacity-10 rounded-full blur-lg"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-white text-5xl font-bold mb-6 leading-tight">
          Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">best courses</span> for You
        </h1>
        <p className="text-blue-100 dark:text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
          Your skills leveling up faster than your WiFi speed!
        </p>
      </div>
      
      <form
        action=""
        className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-xl max-w-2xl mx-auto mb-10 overflow-hidden transition-all hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 hover:shadow-2xl p-1"
      >
        <Input
          type="text"
          className="flex-grow border-none focus-visible:ring-0 px-6 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-lg"
          placeholder="Search courses here..."
        />
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white px-8 py-6 rounded-full hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 font-medium text-lg">
          Search
        </Button>
      </form>
      
      <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 px-8 py-6 font-medium text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105">
        Explore Courses
      </Button>
    </div>
  );
}

export default HeroSection;