import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle } from "lucide-react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();
  // const navigate=useNavigate()

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);

    await updateUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "profile updated");
      setOpen(false);
      // navigate("/profile")
    }
    if (isError) {
      toast.error(error?.message || "Update failed");
    }
  }, [error, updateUserData, isSuccess, isError, refetch, data]);

  if (isLoading) {
    return <h1>Profile Loading</h1>;
  }

  // Add additional check for user data
  if (!data || !data.user) {
    return <h1>User data not available</h1>;
  }

  const user = data.user;

  return (
    <div className="min-h-screen dark:bg-gray-950 ">
      <div className="max-w-4xl mx-auto px-4 my-20 ">
        <h1 className="font-bold text-2xl text-center md:text-left dark:text-white">
          PROFILE
        </h1>
        <div className="flex flex-col md:flex-row items-center  md:items-start gap-8 my-5">
          <div className="flex flex-col items-center">
            <Avatar className="h-48 w-48 ring-4 ring-white dark:ring-gray-900 rounded-full">
              <AvatarImage
                src={user?.profilePhoto || "https://github.com/shadcn.png"}
                className="rounded-full"
              />
              <AvatarFallback>
                <UserCircle className="w-24 h-24 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="my-5">
            <div>
              <h1 className="font-semibold text-black dark:text-gray-400">
                Name :{" "}
                <span className="font-normal text-black dark:text-gray-500">
                  {user?.name || "N/A"}{" "}
                </span>{" "}
              </h1>
            </div>

            <div>
              <h1 className="font-semibold text-black dark:text-gray-400">
                Email :{" "}
                <span className="font-normal text-black dark:text-gray-500">
                  {user?.email || "N/A"}
                </span>{" "}
              </h1>
            </div>

            <div>
              <h1 className="font-semibold text-black dark:text-gray-400">
                Role :{" "}
                <span className="font-normal text-black dark:text-gray-500">
                  {user?.accountType?.toUpperCase() || "N/A"}{" "}
                </span>{" "}
              </h1>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => setOpen(true)}
                  className="mt-2 dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-600  dark:hover:bg-blue-700 rounded-xl"
                >
                  Edit Profile
                </Button>
              </DialogTrigger>

              <DialogContent aria-describedby="profile-description">
                <DialogHeader>
                  <DialogTitle className="dark:text-gray-200">
                    Edit Profile
                  </DialogTitle>
                  <DialogDescription id="profile-description">
                    {" "}
                    Make Changes to Your Profile . Click <b>Save</b> when you
                    are done
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Profile Photo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onChangeHandler}
                      className="col-span-3"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    disabled={updateUserIsLoading}
                    onClick={updateUserHandler}
                  >
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4  animate-spin" />{" "}
                        Please Wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-lg text-center text-black dark:text-gray-100">
          Enrolled Courses
        </h1>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5"> */}
        {!user?.enrolledCourses || user.enrolledCourses.length === 0 ? (
          <h1 className="text-center"> No course enrolled by you yet </h1>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
            {user.enrolledCourses.map((course, index) => (
              <Course key={course._id || index} course={course} />
            ))}
          </div>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default Profile;
