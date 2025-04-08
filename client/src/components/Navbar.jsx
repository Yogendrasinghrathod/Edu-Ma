import {
  School,
  CreditCard,
  LogOut,
  Compass,
  BookOpen,
  UserCircle,
} from "lucide-react";
import React, { useState } from "react";
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "@/features/api/authApi";
// import { Toaster } from "./ui/sonner";

function Navbar() {
  // const { user,isAuthenticated } = useSelector((store) => store.auth);
  const user = true;
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    // Check localStorage for user if Redux state is empty
    if (!user) {
      const storedUser = localStorage.getItem("user");
      // console.log("User is:",storedUser);
      if (storedUser) {
        setLocalUser(JSON.parse(storedUser));
      }
    }
  }, [user]);

  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener for glass effect
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`h-16 fixed top-0 left-0 right-0 duration-300 z-10 ${
        isScrolled
          ? "dark:bg-black/80 bg-white/80 backdrop-blur-md shadow-md"
          : "dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200"
      }`}
    >
      {/* desktop */}
      <div className="max-w-7xl mx-auto h-full hidden md:flex items-center justify-between px-6">
        <div className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Link to="/" className="group">
            <h1 className="hidden md:block font-extrabold text-2xl dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Edu-<span className="text-blue-600 dark:text-blue-400">Ma</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Links - Added for better UX */}
        <div className="flex items-center space-x-6">
          <Link
            to="/courses"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            <Compass size={18} />
            <span>Explore</span>
          </Link>
          <Link
            to="/myLearning"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            <BookOpen size={18} />
            <span>My Learning</span>
          </Link>
        </div>

        {/* userIcon and dark mode */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-blue-500 hover:border-blue-400 hover:shadow-md hover:shadow-blue-300/20 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    ED
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 rounded-lg border border-gray-200 dark:border-gray-800">
                <DropdownMenuLabel className="font-bold text-blue-600 dark:text-blue-400">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer p-2 my-1">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <Link to="profile" className="flex-1">
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer p-2 my-1">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <Link to="myLearning" className="flex-1">
                      My Learning
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer p-2 my-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    <Link to="logout" className="flex-1">
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
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
                <Link to="/login">Login</Link>
              </Button>
              <Button className="rounded-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-300 px-6">
                <Link to="/login">Sign Up</Link>
              </Button>
            </div>
          )}
          <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Mobile device */}
      <div className="md:hidden flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-2">
          <h1 className="font-extrabold text-xl">
            Edu-<span className="text-blue-600 dark:text-blue-400">Ma</span>
          </h1>
        </div>
        <MobileNavbar />
      </div>
    </div>
  );
}

export default Navbar;

const MobileNavbar = () => {
  const accountType = "Instructor";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="cursor-pointer h-10 w-10 rounded-full border-2 border-blue-500 hover:border-blue-400 transition-all">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            ED
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 border-l border-gray-200 dark:border-gray-800">
        <SheetHeader className="flex flex-col items-center justify-between mt-4 mb-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <School size={"24"} />
            </div>
            <SheetTitle className="text-2xl font-bold">
              Edu-<span className="text-blue-600 dark:text-blue-400">Ma</span>
            </SheetTitle>
          </div>
          <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
            <DarkMode />
          </div>
        </SheetHeader>

        <div className="h-px w-full bg-gray-200 dark:bg-gray-800 my-2"></div>

        <nav className="flex flex-col space-y-1 w-full">
          <Link
            to="/courses"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
          >
            <Compass size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Explore Courses</span>
          </Link>
          <Link
            to="/myLearning"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
          >
            <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
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
            <span className="font-medium">Edit Profile</span>
          </Link>
          <Link
            to="/logout"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
          >
            <LogOut size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Logout</span>
          </Link>
        </nav>

        {accountType == "Instructor" && (
          <SheetFooter className="mt-auto mb-6">
            <SheetClose asChild>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Instructor Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
