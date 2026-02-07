import { School, CreditCard, LogOut, BookOpen, UserCircle } from "lucide-react";

import { useEffect } from "react";
import { Button } from "./ui/button";
import DarkMode from "../DarkMode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Link, useNavigate } from "react-router-dom";

import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.authSlice);

  const navigate = useNavigate();

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message || "User Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);
  const location = useLocation();

  return (
    <div
      className={
        location.pathname === "/login"
          ? `h-16 fixed top-0 left-0 right-0 duration-300 z-10 dark:bg-gray-900/80 bg-transparent hover:bg-[#1E40AF] text-white backdrop-blur-md shadow-md`
          : `h-16 fixed top-0 left-0 right-0 duration-300 z-10 dark:bg-gray-900/80 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white backdrop-blur-md shadow-md`
      }
    >
      {/* desktop */}
      <div className="max-w-7xl mx-auto h-full hidden md:flex items-center justify-between px-6">
        <div className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Link to="/" className="group">
            <h1
              className={
                location.pathname === "/login"
                  ? "hidden md:block font-extrabold text-2xl dark:text-blue-400 group-hover:text-blue-600 text-blue-600 dark:group-hover:text-blue-300 transition-colors"
                  : "hidden md:block font-extrabold text-2xl dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors"
              }
            >
              Edu-<span className="text-blue-600 dark:text-blue-500">Ma</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Links - Added for better UX */}

        {/* userIcon and dark mode */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-blue-500 hover:border-blue-400 hover:shadow-md hover:shadow-blue-300/20 transition-all">
                  <AvatarImage
                    src={user.profilePhoto || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    ED
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-900 text-black dark:text-gray-100">
                <DropdownMenuLabel className="font-bold text-blue-600 dark:text-blue-400">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-black dark:text-gray-100 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer p-2 my-1">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <Link to="profile" className="flex-1">
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="text-black dark:text-gray-100 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer p-2 my-1">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <Link to="myLearning" className="flex-1">
                      My Learning
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="text-black dark:text-gray-100 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.accountType === "Instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-black dark:text-gray-100 cursor-pointer">
                      <Link to="/admin/dashboard" className="w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-6"
              >
                <Link to="/login">Login/SignUp</Link>
              </Button>
            </div>
          )}
          <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-900">
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Mobile device */}
      <div className="md:hidden flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-2">
          <Link to="/">
            <h1 className="font-extrabold text-xl dark:text-white">
              Edu-<span className="text-blue-600 dark:text-blue-400">Ma</span>
            </h1>
          </Link>
        </div>
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message || "User Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {user ? (
          <Avatar className="cursor-pointer h-10 w-10 rounded-full border-2 border-blue-500 hover:border-blue-400 transition-all">
            <AvatarImage
              src={user.profilePhoto || "https://github.com/shadcn.png"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white ">
              {user.name ? user.name.substring(0, 2).toUpperCase() : "ED"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant="outline"
            className="rounded-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-4"
          >
            <Link to="/login">Login</Link>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 border-l border-gray-200 dark:border-gray-800">
        <SheetHeader className="flex flex-col items-center justify-between mt-4 mb-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <School size={"24"} />
            </div>
            <SheetTitle className="text-2xl font-bold dark:text-white">
              Edu-<span className="text-blue-600 dark:text-blue-400">Ma</span>
            </SheetTitle>
          </div>
          <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-900">
            <DarkMode />
          </div>
        </SheetHeader>

        <div className="h-px w-full bg-red-800 dark:bg-gray-800 my-2"></div>

        {user ? (
          <>
            <nav className="flex flex-col space-y-1 w-full text-black dark:text-white dark:hover:to-blue-600">
              <Link
                to="/myLearning"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
              >
                <BookOpen
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
                <span className="font-medium">My Learning</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
              >
                <UserCircle
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
                <span className="font-medium">Profile</span>
              </Link>
              <button
                onClick={logoutHandler}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors w-full text-left"
              >
                <LogOut
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
                <span className="font-medium">Logout</span>
              </button>
            </nav>

            {user?.accountType === "Instructor" && (
              <SheetFooter className="mt-auto mb-6">
                <SheetClose asChild>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <Link to="/admin/dashboard">Instructor Dashboard</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            )}
          </>
        ) : (
          <div className="flex flex-col space-y-4">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Please log in to access your account
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/login">Login/SignUp</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
