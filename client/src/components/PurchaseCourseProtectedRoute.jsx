
import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate } from "react-router-dom";

const PurchaseCourseProtectedRoute=({children})=>{
    const{courseId} =useParams();

    const {data ,isLoading}= useGetCourseDetailsWithStatusQuery();

    if(isLoading) return <p>Loading ...</p>

    return data?.purchased?children : <Navigate  to={`/course-details/${courseId}`}/>

}
export default PurchaseCourseProtectedRoute;