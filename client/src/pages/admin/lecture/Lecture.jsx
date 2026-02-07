import { Edit } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
  };

  return (
    <div className="flex items-center justify-between bg-[#F7F9Fa] dark:bg-gray-800 px-4 py-2 rounded-md my-2 border dark:border-gray-700">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
        Lecture - {index + 1} {lecture.lectureTitle}
      </h1>
      <Edit
        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={goToUpdateLecture}
        size={25}
      />
    </div>
  );
};

export default Lecture;

Lecture.propTypes = {
  lecture: PropTypes.shape({
    _id: PropTypes.string,
    lectureTitle: PropTypes.string,
  }).isRequired,
  courseId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
