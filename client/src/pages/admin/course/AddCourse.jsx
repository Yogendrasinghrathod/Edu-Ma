import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse,{data,isError,isSuccess,isLoading}]=useCreateCourseMutation();
  const navigate = useNavigate();
  // const isLoading = false;
  const getSelectedCategory = (value) => {
    setCategory(value);
  };


  const createCourseHandler = async () => {
    await createCourse({courseTitle,category});
  };
  useEffect(()=>{
    if(isSuccess){
      toast.success(data?.message || "course created successfully")
      navigate("/admin/course")
    }

  },[isSuccess,isError,data?.message,navigate])

  
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Let&apos;s add course ,add some basic course details for your new course</h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi odit
          velit sequi, consequatur odio totam expedita. Itaque nisi et ipsa!
          Eveniet qui id incidunt suscipit, et nesciunt excepturi ad
          repellendus.
        </p>
      </div>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="courseTitle">Title</Label>
          <Input
            type="text"
            id="courseTitle"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="YOUR COURSE NAME"
            className=""
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Category" />
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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
