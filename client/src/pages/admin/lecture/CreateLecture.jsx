import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");

  const params = useParams();
  const courseId = params.courseId;

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();
  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId: courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      refetch();
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl dark:text-gray-300">
          Let's add lecture ,add some basic course details for your new lectures
        </h1>
        {/* <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi odit
          velit sequi, consequatur odio totam expedita. Itaque nisi et ipsa!
          Eveniet qui id incidunt suscipit, et nesciunt excepturi ad
          repellendus.
        </p> */}
      </div>
      <div className="grid gap-y-3">
        <div className="grid w-full max-w-sm items-center gap-1.5 ">
          <Label htmlFor="courseTitle" className="dark:text-white">Title</Label>
          <Input
            type="text"
            id="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="YOUR LECTURE NAME"
            className="dark:text-white dark:bg-gray-500 dark:placeholder-white "
          />
        </div>

        <div className="flex items-center gap-2 ">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="dark:text-white dark:bg-blue-600"
          >
            Back to Course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler} className="dark:text-white dark:bg-blue-600  dark:hover:bg-blue-950">
            
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading lecture</p>
          ) : lectureError ? (
            <p>Failed to Load Lecture</p>
          ) : lectureData.length == 0 ? (
            <p>No lecture Found</p>
          ) : (
            lectureData.lectures.map((lecture, index) => {
              return <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index}/>;
            })
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CreateLecture;
