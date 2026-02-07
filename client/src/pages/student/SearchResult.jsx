import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SearchResult = ({ course }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 dark:border-gray-800 py-4 gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnail"
          className="h-32 w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl text-black dark:text-white">
            {course.courseTitle}
          </h1>
          Broadway
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {course.subTitle}
          </p>
          <p className="text-sm text-black dark:text-gray-300">
            Instructor:{" "}
            <span className="font-bold text-black dark:text-gray-100">
              {course.creator?.name}
            </span>{" "}
          </p>
          <Badge className="w-fit mt-2 md:mt-0 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-400/30">
            {course.courseLevel}
          </Badge>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <h1 className="font-bold text-lg md:text-xl text-black dark:text-white">
          ₹{course.coursePrice}
        </h1>
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseThumbnail: PropTypes.string,
    courseTitle: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    creator: PropTypes.shape({
      name: PropTypes.string,
    }),
    courseLevel: PropTypes.string,
    coursePrice: PropTypes.number,
  }).isRequired,
};

export default SearchResult;
