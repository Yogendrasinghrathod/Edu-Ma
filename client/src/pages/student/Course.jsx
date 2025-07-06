import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({course}) => {
  // console.log(course);
  
  return (
    <Link to={`course-detail/${course._id}`}>
    <Card className="overflow-hidden rounded-xl dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-md">
            Advance
          </Badge>
        </div>
        <img
          src={course.courseThumbnail}
          className="w-full h-48 object-cover rounded-t-xl"
          alt="course thumbnail"
        />
        <CardContent className="px-6 py-5 space-y-4">
          <h1 className="font-bold text-xl hover:text-blue-600 transition-colors duration-200 truncate">
             {course.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-full border-2 border-blue-500 shadow-sm">
                <AvatarImage src={course?.creator?.profilePhoto || "https://github.com/shadcn.png" }/>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-gray-700 dark:text-gray-300">{course.creator?.name}</h1>
            </div>
          </div>
          <Badge className="bg-blue-600 text-white px-2 py-1 text-xs">
              {course.courseLevel}
            </Badge>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              <span>{course.coursePrice}</span>
            </div>
            
          </div>
        </CardContent>
      </div>
    </Card>
    </Link>
  );
};

export default Course;