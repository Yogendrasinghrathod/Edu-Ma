import RichTextEditor from "@/components/RichTextEditor";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  

  const navigate = useNavigate();
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const params = useParams();
  const courseId = params.courseId;
  const { data: courseByIdData, isLoading: courseByIdLoading,refetch } =
    useGetCourseByIdQuery(courseId);

  const [editCourse, { data, isLoading, isSuccess, error: editError }] = useEditCourseMutation();

    const[publishCourse]=usePublishCourseMutation();

  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData?.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    await editCourse({ formData, courseId });
  };

  const publishStatusHandler=async(action)=>{
    try {
      const response=await publishCourse({courseId,query:action});
      if(response.data){
        toast.success(response.data.message);
        refetch();
      }
      
    } catch {
      toast.error("Failed to Publish Course")
      
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Updated data Successfully");
    }
    if (editError) {
      toast.error(editError.data?.message || "An error occurred");
    }
  }, [isSuccess, data?.message, editError]);

  if (courseByIdLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <div>
      <Card className="dark:bg-gray-600">
        <CardHeader className="flex flex-row justify-between dark:bg-gray-600">
          <div className="space-x-2">
            <CardTitle>Basic Course Information</CardTitle>
          
            <CardDescription>
              Make Changes to Your Courses Here and click Save when Done!
            </CardDescription>
          </div>
          <div className="space-x-2 ">
            <Button disabled={courseByIdData?.course.lectures.length===0} variant="outline" onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ? "false":"true")}>
              {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button>Remove Course</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>CourseTitle</Label>
              <Input
                type="text"
                name="courseTitle"
                value={input.courseTitle}
                onChange={changeEventHandler}
                placeholder="Ex . Full Stack Developer"
              />
            </div>
            <div>
              <Label>SubTitle</Label>
              <Input
                type="text"
                name="subTitle"
                value={input.subTitle}
                onChange={changeEventHandler}
                placeholder="Ex . Become a Full Stack Developer from zero to hero "
              />
            </div>
            <div>
              <Label>Description</Label>
              <RichTextEditor  input={input} setInput={setInput} />
            </div>
            <div className="flex items-center gap-5">
              <div>
                <Label>Category</Label>
                <Select onValueChange={selectCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Category"  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Next JS">Next JS</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                      <SelectItem value="Full Stack Development">
                        Full Stack Development
                      </SelectItem>
                      <SelectItem value="JavaScript">JavaScript</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Course Level</Label>
                <Select onValueChange={selectCourseLevel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price (INR)</Label>
                <Input
                  type="Number"
                  name="coursePrice"
                  value={input.coursePrice}
                  onChange={changeEventHandler}
                  placeholder="5xx"
                  className="w-fit"
                  
                />
              </div>
            </div>
            <div>
              <Label>Course Thumbnail</Label>
              <Input
                type="file"
                onChange={selectThumbnail}
                accept="image/*"
                className="w-fit "
              />
              {previewThumbnail && (
                <img
                  src={previewThumbnail}
                  className="h-64 my-2 object-contain"
                  alt="Course Thumbnail"
                />
              )}
            </div>
            <div className="flex gap-x-2  ">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/course")}
                className="rounded-full"
               
              >
                Cancel
              </Button>
              <Button disabled={isLoading} onClick={updateCourseHandler} className="dark:bg-black dark:text-white rounded-full px-6">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;
