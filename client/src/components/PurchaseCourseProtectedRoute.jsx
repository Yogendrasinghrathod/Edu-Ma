import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();

  const { data, isLoading } = useGetCourseDetailsWithStatusQuery(courseId);

  if (isLoading) return <p>Loading ...</p>;

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};

PurchaseCourseProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PurchaseCourseProtectedRoute;
