import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CheckCircle, CheckCircle2, CirclePlay, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { convertToHlsUrl } from "@/utils/videoUtils";

const CourseProgress = () => {
  // const params=useParams()
  const { courseId } = useParams();

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData?.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData?.message);
    }
  }, [
    completedSuccess,
    inCompletedSuccess,
    refetch,
    markCompleteData?.message,
    markInCompleteData?.message,
  ]);

  const [currentLecture, setCurrentLecture] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  // Determine active lecture id using currentLecture or first lecture from data (safe access)
  const activeLectureId =
    currentLecture?._id || data?.data?.courseDetails?.lectures?.[0]?._id;

  // Auto-load note content for the current/initial lecture into the textarea
  useEffect(() => {
    if (!activeLectureId) return;

    let isCancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/progress/${courseId}/lecture/${activeLectureId}/note`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!isCancelled) {
          setNoteDraft(data.note || "");
        }
      } catch {
        if (!isCancelled) {
          setNoteDraft("");
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [courseId, activeLectureId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: Failed TO load course details</div>;
  }

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  //initialize the first lecture if not exist
  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  // activeLectureId handled above before early returns

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };
  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });

    refetch();
  };
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };
  const handleInComplete = async () => {
    await inCompleteCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20 dark:bg-gray-950 min-h-screen">
      {/* Display course name */}
      <div className="flex justify-between mb-4 border-b pb-4 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {courseTitle}
        </h1>
        <Button
          onClick={completed ? handleInComplete : handleCompleteCourse}
          variant={completed ? "default" : "default"}
          className={
            completed ? "bg-green-600 hover:bg-green-700 text-white" : ""
          }
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>
            </div>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {/* video Section */}
        <div className="flex-1 w-full h-fit rounded-lg shadow-lg p-4 dark:bg-gray-900 border dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            {/* Toggle Button for Lecture Sidebar */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="md:w-auto w-full bg-black text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Menu className="mr-2 h-4 w-4" />
                  Course Lectures
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[400px] sm:w-[540px] overflow-y-auto dark:bg-gray-900 dark:border-gray-800"
              >
                <SheetHeader>
                  <SheetTitle className="text-black dark:text-white">
                    Course Lectures
                  </SheetTitle>
                  <SheetDescription className="text-black dark:text-gray-400">
                    Select a lecture to play.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex-1 overflow-y-auto">
                  {courseDetails?.lectures.map((lecture) => (
                    <Card
                      key={lecture._id}
                      className={`mb-3 hover:cursor-pointer transition-transform ${
                        lecture._id === currentLecture?._id
                          ? "bg-gray-200"
                          : "dark:bg-gray-800"
                      }`}
                      onClick={() => handleSelectLecture(lecture)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          {isLectureCompleted(lecture._id) ? (
                            <CheckCircle2
                              size={24}
                              className="text-green-500 mr-2"
                            />
                          ) : (
                            <CirclePlay
                              size={24}
                              className="text-gray-500 mr-2"
                            />
                          )}
                          <div>
                            <CardTitle className="text-lg font-medium text-black dark:text-gray-100">
                              {lecture.lectureTitle}
                            </CardTitle>
                          </div>
                        </div>
                        {isLectureCompleted(lecture._id) && (
                          <Badge className="bg-green-600 text-white">
                            Completed
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="aspect-video w-full">
            {/* video aayega */}

            <ReactPlayer
              width="100%"
              height="100%"
              url={convertToHlsUrl(
                currentLecture?.videoUrl || initialLecture.videoUrl,
              )}
              controls={true}
              playing={false}
              className="w-full h-full md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload", // Prevent downloading
                  },
                },
              }}
              onError={(e) => console.error("Error playing video:", e)}
            />
            {/* <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            /> */}
          </div>
          {/* Display current watching lecture title  */}
          <div className="mt-2 text-black dark:text-white">
            <h3 className="text-medium text-lg">{`Lecture ${
              courseDetails.lectures.findIndex(
                (lec) =>
                  lec._id === (currentLecture?._id || initialLecture._id),
              ) + 1
            }:${
              currentLecture?.lectureTitle || initialLecture.lectureTitle
            }`}</h3>
          </div>
          {/* Notes Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
              Your Notes
            </h3>
            <textarea
              className="w-full min-h-[120px] rounded border p-3 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Write your notes for this lecture..."
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
            />
            <div className="mt-2 flex gap-2">
              <Button
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `${import.meta.env.VITE_API_BASE_URL}/progress/${courseId}/lecture/${currentLecture?._id || initialLecture._id}/note`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: noteDraft }),
                      },
                    );
                    const data = await res.json();
                    if (data.success) toast.success("Note saved");
                    else toast.error(data.message || "Failed to save note");
                  } catch {
                    toast.error("Failed to save note");
                  }
                }}
              >
                Save Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
