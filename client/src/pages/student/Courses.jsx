import { Skeleton } from "@/components/ui/skeleton";
 
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";


const Courses = () => {
  const{ data,isLoading,isError}=useGetPublishedCourseQuery();
  if(isError){
    <h1>Failed to Load Course</h1>
  }
  // const isLoading = false;
  return (
    <div className="dark:bg-black 0 py-16 ">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-bold text-4xl text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-black dark:text-gray-600">
          Our Courses
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Expand your knowledge with our expertly crafted learning experiences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses.map((course, index) => <Course key={index}  course={course} />)}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px] border border-gray-100">
      <Skeleton className="w-full h-48" />
      <div className="px-6 py-5 space-y-4">
        <Skeleton className="h-7 w-4/5 rounded-md" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <div className="pt-2">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};