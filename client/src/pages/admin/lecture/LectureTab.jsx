import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
// import { use } from "react";

const MEDIA_API = "https://edu-ma.onrender.com/api/v1/media";

const LectureTab = () => {
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const params = useParams();
  const { lectureId, courseId } = params;

  

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const { data:lectureData } = useGetLectureByIdQuery(lectureId);

  console.log(lectureData)

  const lecture = lectureData?.lecture;
  useEffect(() => {
    if (lecture) {
      // console.log(lecture);
      
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      setBtnDisable(true);
      setUploadProgress(0);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.data.success) {
          console.log("Video response->", res.data.data);
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("video upload failed");
        setBtnDisable(true);
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {
      await editLecture({
        courseId,
        lectureId,
        lectureTitle,
        videoInfo: uploadVideoInfo,
        isPreviewFree: isFree,
      });
    } catch (error) {
      toast.error("Failed to update lecture");
    }
  };

  const removeLectureHandler = async () => {
    await removeLecture({ lectureId, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
      navigate(`/admin/course/${courseId}/lecture`);
      // refetch()
    }
    // if (error) {
    //   toast.error(error.removeData.message);
    // }
  }, [removeSuccess]);

  return (
    <Card className="dark:bg-gray-700">
      <CardHeader className="flex justify-between ">
        <div>
          <CardTitle className="text-center">Edit Lecture</CardTitle>
          <CardDescription className="text-center my-2">
            Make changes and Then click Save
          </CardDescription>
          <div className="flex justify-end">
            <Button
              disabled={removeLoading}
              variant="destructive"
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
              onClick={removeLectureHandler}
            >
              {removeLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  "Please Wait"
                </>
              ) : (
                "Remove Lecture "
              )}
            </Button>
          </div>
        </div>

        <CardContent>
          <div>
            <Label className="font-bold">Title</Label>
            <Input
              value={lectureTitle}
              onChange={(e) => {
                setLectureTitle(e.target.value);
              }}
              type="text"
              placeholder="Ex. Introduction To JavaScript"
            />
          </div>
          <div className="my-5">
            <Label className="font-bold">
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              onChange={fileChangeHandler}
              accept="video/*"
              className="w-fit"
            />
          </div>
          <div className="flex items-center space-x-2 my-5">
            <Switch
              checked={isFree}
              onCheckedChange={setIsFree}
              id="airplane-mode"
            />
            <Label htmlFor="airplane-mode">Is This Video FREE?</Label>
          </div>
          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}
          <div className="mt-4">
            <Button
              className="rounded-full"
              disabled={isLoading || btnDisable || mediaProgress}
              onClick={editLectureHandler}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  "Please Wait"
                </>
              ) : mediaProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  "Uploading Video..."
                </>
              ) : (
                "Update lecture"
              )}
            </Button>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default LectureTab;
