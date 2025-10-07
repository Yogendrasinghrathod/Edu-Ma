import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import { PlayCircle, Lock } from "lucide-react";
 
import { useNavigate, useParams } from "react-router-dom";
import { renderHTML } from "@/lib/htmlUtils";

import ReactPlayer from 'react-player'

function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId;
  const navigate=useNavigate();

  const { data, isLoading, error } =
    useGetCourseDetailsWithStatusQuery(courseId);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: Failed to fetch course details</h1>;
  }

  if (!data || !data.course) {
    return <h1>Course not found</h1>;
  }

  const { course, purchased } = data;

  const handleContinueCourse=()=>{
    if(purchased){
      navigate(`/course-progress/${courseId}`)
    }
  }

  return (
    <div>
      <div className="mt-20 space-y-5 ">
        <div className="bg-[#2D2F31] text-white ">
          <div className="max-w-7xl mx-auto  py-8 px-4 md:px-8 flex flex-col gap-2">
            <h1 className="font-bold text-2xl md:text-3xl   ">
              {course.courseTitle || "Course Title"}
            </h1>
            <p className="text-base md:text-lg">
              {course.subTitle || "Course Sub-Title"}
            </p>
            <p>
              Created By:{" "}
              <span className="text-[#C0C4FC] underline italic">
                {course?.creator?.name || "Unknown"}
              </span>
            </p>
            <div className="items-center gap-2 text-sm ">
              <p>
                Last updated{" "}
                {course.createdAt ? course.createdAt.split("T")[0] : "Unknown"}
              </p>
            </div>
            <p>Students enrolled: {course?.enrolledStudents?.length || 0}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10 ">
          <div className="w-full lg:w-1/2 space-y-5">
            <h1 className="font-bold  text-xl md:text-2xl">Description</h1>
            <div
              className="text-sm prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:dark:text-gray-100 prose-p:text-gray-700 prose-p:dark:text-gray-300 prose-strong:text-gray-900 prose-strong:dark:text-gray-100 prose-ul:text-gray-700 prose-ul:dark:text-gray-300 prose-ol:text-gray-700 prose-ol:dark:text-gray-300 prose-li:text-gray-700 prose-li:dark:text-gray-300 prose-blockquote:text-gray-600 prose-blockquote:dark:text-gray-400 prose-code:text-gray-900 prose-code:dark:text-gray-100 prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800"
              dangerouslySetInnerHTML={renderHTML(
                course.description ||
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quia nisi autem pariatur molestiae! A ad reprehenderit at esse, deserunt dolorum totam cumque beatae accusantium, perspiciatis accusamus ut voluptatem consequuntur."
              )}
            />
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course?.lectures?.length || 0} lectures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 ">
                {course?.lectures?.map((lecture, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span>
                      {purchased || lecture?.isPreviewFree ? (
                        <PlayCircle size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                    </span>
                    <p>{lecture.lectureTitle || `Lecture ${idx + 1}`}</p>
                  </div>
                )) ||
                  [1, 2, 3].map((lecture, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <span>
                        {purchased ? (
                          <PlayCircle size={14} />
                        ) : (
                          <Lock size={14} />
                        )}
                      </span>
                      <p>Lecture {idx + 1}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-1/3 ">
            <Card>
              <CardContent className="p-4 flex flex-col">
                <div className="w-full aspect-video mb-4 ">
                  {(() => {
                    const previewLecture = Array.isArray(course?.lectures)
                      ? course.lectures.find((lec) => lec?.isPreviewFree)
                      : null;
                    const canPreview = Boolean(purchased || previewLecture?.videoUrl);
                    const previewUrl = purchased
                      ? course.lectures[0]?.videoUrl
                      : previewLecture?.videoUrl;
                    return canPreview ? (
                      <ReactPlayer
                        width="100%"
                        height={"100%"}
                        url={previewUrl}
                        controls={true}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded">
                        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                          Preview not available. Purchase to watch.
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <h1>Lecture Title</h1>
                <Separator className="my-2" />
                <h1 className="text-lg md:text-xl font-semibold">
                  {purchased?(<span className="text-blue-800">enrolled</span>): `₹${course.coursePrice}`}
                  
                </h1>
              </CardContent>
              <CardFooter className="flex justify-center p-4">
                {purchased ? (
                  <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
                ) : (
                  <BuyCourseButton courseId={courseId} />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
