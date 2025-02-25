import React from "react";
import Course from "./Course";
import { BookOpen, Search, GraduationCap, FolderHeart } from "lucide-react";
import { useGetUserDetailsQuery } from "../../features/api/authApi";


const MyLearning = () => {
  const {data, isLoading} = useGetUserDetailsQuery();
  console.log(data);
  const myLearningCourses = [1,2];

  return (
    <div className="max-w-6xl mx-auto mt-24 mb-32 px-4 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b dark:border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-800" />
          </div>
          <h1 className="font-bold text-2xl md:text-3xl">My Learning</h1>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-blue-200 dark:bg-gray-800 w-full md:w-64"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select className="px-3 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-300">
            <option> All Courses</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Course Content */}
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearningCourses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-150 to-indigo-150 dark:from-blue-200 dark:to-indigo-500 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-900" />
                  </div>
                  <h3 className="font-semibold text-gray-700 dark:text-indigo-500">Active Courses</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-indigo-400">{myLearningCourses.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800/30 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                    <FolderHeart className="h-5 w-5 text-green-600 dark:text-green-900" />
                  </div>
                  <h3 className="font-semibold text-gray-700 dark:text-green-500">Saved For Later</h3>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">4</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800/30 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-900" />
                  </div>
                  <h3 className="font-semibold text-gray-700 dark:text-purple-500">Average Progress</h3>
                </div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">68%</p>
              </div>
            </div>

            {/* Courses Grid */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Enrolled Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((course, index) => (
                <Course key={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => (
  <div>
    {/* Skeleton for progress stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-100 dark:bg-gray-800 rounded-xl h-28 animate-pulse shadow-sm"
        ></div>
      ))}
    </div>
    
    {/* Skeleton for courses */}
    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse"
        >
          <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
      <BookOpen className="h-12 w-12 text-blue-500 dark:text-blue-400" />
    </div>
    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No Courses Yet</h2>
    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
      You're not enrolled in any courses yet. Explore our catalog and start your learning journey today!
    </p>
    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-sm">
      Browse Courses
    </button>
  </div>
);