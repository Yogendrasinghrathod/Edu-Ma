import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-xl dark:bg-gray-900 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full min-h-[500px]">
        <div className="relative h-64">
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-md">
              {course.courseLevel}
            </Badge>
          </div>
          <img
            src={course.courseThumbnail}
            className="w-full h-full  object-cover rounded-t-xl"
            alt="course thumbnail"
          />
        </div>
        <CardContent className="px-6 py-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="font-bold text-2xl text-black hover:text-blue-600 transition-colors duration-200 line-clamp-2 dark:text-white leading-tight">
              {course.courseTitle}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-full border-2 border-blue-500 shadow-sm">
                  <AvatarImage
                    src={
                      course?.creator?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback font-bold>CN</AvatarFallback>
                </Avatar>
                <h1 className="font-semibold text-lg text-black dark:text-gray-300">
                  {course.creator?.name}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
            <div className="text-xl font-bold text-black dark:text-blue-400">
              Course Price : Rs{" "}
              <span className="text-2xl text-blue-600 dark:text-white ml-1">
                {course.coursePrice}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

Course.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseThumbnail: PropTypes.string,
    courseTitle: PropTypes.string.isRequired,
    courseLevel: PropTypes.string,
    coursePrice: PropTypes.number,
    creator: PropTypes.shape({
      profilePhoto: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default Course;
