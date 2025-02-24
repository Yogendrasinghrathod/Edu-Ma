import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600  dark:from gray-800 dark:to-gray-900 py-24 px-4 text-center ">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl front-bold mb-4">
          Find the best courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Your skills leveling up faster than your WiFi speed!
        </p>
      </div>
      <form
        action=""
        className="flex items-center bg-white  dark:bg-gray-800 rounded-full shadow-lg max-w-xl mx-auto mb-6 overflow-hidden"
      >
        <Input
          type="text"
          className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Search course here "
        />
        <Button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-800 dark:hover:bg-blue-800">
          Search
        </Button>
      </form>
      <Button className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200">Explore Courses</Button>
    </div>
  );
}

export default HeroSection;
