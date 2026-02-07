import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <h1>Loading .... </h1>;
  }

  return (
    <div className="grid gap-y-3">
      <Button
        onClick={() => {
          navigate(`create`);
        }}
        className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-900"
      >
        Create a New Course
      </Button>
      <Table className="dark:bg-gray-900 dark:border-gray-800 border">
        <TableCaption className="text-gray-500 dark:text-gray-400">
          A list of your recent courses.
        </TableCaption>
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow className="dark:border-gray-800">
            <TableHead className="w-[100px] text-gray-800 dark:text-gray-100 font-bold">
              Price
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100 font-bold">
              Status
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100 font-bold">
              Title
            </TableHead>
            <TableHead className="text-right text-gray-800 dark:text-gray-100 font-bold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses?.length === 0 ? (
            <h1>No course created</h1>
          ) : (
            data.courses.map((course) => (
              <TableRow
                key={course._id}
                className="dark:text-gray-300 dark:border-gray-800"
              >
                <TableCell className="text-black dark:text-gray-300">
                  {course?.coursePrice || "NA"}
                </TableCell>
                <TableCell>
                  <Badge className="dark:bg-blue-600 dark:text-white">
                    {course?.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-black dark:text-gray-300">
                  {course.courseTitle}
                </TableCell>

                <TableCell className="text-right">
                  {
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`${course._id}`)}
                    >
                      <Edit className="dark:bg-blue-800 dark:hover:to-blue-950" />
                    </Button>
                  }
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
};

export default CourseTable;
