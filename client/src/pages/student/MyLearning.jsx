import React from "react";
import Course from "./Course";
// import { c } from 'vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P';

const MyLearning = () => {
  const isLoading = false;
  const myLearningCourses = [1, 2];
  return (
    <div className="max-w-4xl mx-auto my-24  md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>
      <div className="my-5">
        {
          isLoading ? (
            <MyLearningSkeleton />
          ) : myLearningCourses.length == 0 ? (
            <p>You are not enrolled in any course</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2].map((course, index) => (
                <Course key={index} />
              ))}
            </div>
          )
          // <Course />
        }
      </div>
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);

// export default MyLearningSkeleton;
