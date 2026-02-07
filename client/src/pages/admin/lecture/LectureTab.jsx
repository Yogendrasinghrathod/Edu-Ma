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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

const MEDIA_API = `${API_BASE_URL}/media`;

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

  const [editLecture, { data, isLoading, isSuccess, error: editError }] =
    useEditLectureMutation();
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);

  const lecture = lectureData?.lecture;
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
      setBtnDisable(false);
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
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch {
        toast.error("video upload failed");
        setBtnDisable(true);
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    try {
      const payload = { courseId, lectureId, isPreviewFree: isFree };
      if (lectureTitle && lectureTitle.trim()) {
        payload.lectureTitle = lectureTitle.trim();
      }
      if (
        uploadVideoInfo &&
        uploadVideoInfo.videoUrl &&
        uploadVideoInfo.publicId
      ) {
        payload.videoInfo = uploadVideoInfo;
      }

      await editLecture(payload);
    } catch {
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
    if (editError) {
      toast.error(editError.data?.message || "Update failed");
    }
  }, [isSuccess, data?.message, editError]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
      navigate(`/admin/course/${courseId}/lecture`);
      // refetch()
    }
    // if (error) {
    //   toast.error(error.removeData.message);
    // }
  }, [removeSuccess, navigate, removeData?.message, courseId]);

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="flex justify-between ">
        <div>
          <CardTitle className="text-center text-black dark:text-gray-100">
            Edit Lecture
          </CardTitle>
          <CardDescription className="text-center my-2 text-black dark:text-gray-400">
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
                  Please Wait
                </>
              ) : (
                "Remove Lecture "
              )}
            </Button>
          </div>
        </div>

        <CardContent>
          <div>
            <Label className="font-bold text-black dark:text-gray-200">
              Title
            </Label>
            <Input
              value={lectureTitle}
              onChange={(e) => {
                setLectureTitle(e.target.value);
              }}
              type="text"
              placeholder="Ex. Introduction To JavaScript"
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="my-5">
            <Label className="font-bold text-black dark:text-gray-200">
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              onChange={fileChangeHandler}
              accept="video/*"
              className="w-fit dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center space-x-2 my-5">
            <Switch
              checked={isFree}
              onCheckedChange={setIsFree}
              id="airplane-mode"
            />
            <Label
              htmlFor="airplane-mode"
              className="text-black dark:text-gray-300"
            >
              Is This Video FREE?
            </Label>
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
                  Please Wait
                </>
              ) : mediaProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Video...
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
