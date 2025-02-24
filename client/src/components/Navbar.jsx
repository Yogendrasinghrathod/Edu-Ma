import { School } from "lucide-react";
import React from "react";
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

import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

function Navbar() {
  const user = true;
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between gap-10">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/">
            <h1 className="hidden md:block front-extrabold text-2xl ">
              Edu-Ma
            </h1>
          </Link>
        </div>
        {/* userIcon and darkmode */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-12 rounded-full border-2 border-transparent hover:border-gray-300">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuGroup> */}
                <DropdownMenuItem>
                  <Link to="myLearning">My learning</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {/* <CreditCard /> */}
                  <Link to="profile">Edit Profile</Link>
                </DropdownMenuItem>

                {/* </DropdownMenuGroup> */}

                <DropdownMenuItem>
                  {/* <LogOut /> */}

                  <Link to="logout">Logout</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  {/* <LogOut /> */}
                  DashBoard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* mobiledevice */}
      <div className="md:hidden flex items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">Edu Ma</h1>
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
        <Avatar className="cursor-pointer size-12 rounded-full border-2 hover:border-gray-300">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 ">
        <SheetHeader className="flex flex-col items-center justify-between mt-2">
          <SheetTitle>SkillBolt</SheetTitle>
          <DarkMode />
        </SheetHeader>

        <Separator className="mr-2"></Separator>
        <nav className="flex flex-col space-y-4">
          <span>My Learning</span>
          <span>Edit Profile</span>
          <span>Logout</span>
        </nav>
        {accountType == "Instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
