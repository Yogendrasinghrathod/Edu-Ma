import React, { useState } from 'react';
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
import { Loader2,UserCircle,Mail,Users,Calendar,Info} from "lucide-react";
import Course from "./Course";
import { useGetUserDetailsQuery } from "@/features/api/authApi";

const Profile = () => {
  const { data: user, isLoading, error } = useGetUserDetailsQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    about: '',
    contactNumber: '',
    gender: 'male',
    profilePhoto: null
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading profile: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No user data available
      </div>
    );
  }

  const { firstName, lastName, email, courses, accountType, additionalDetails, image } = user?.data || user || {};
  const { gender, dateOfBirth, about } = additionalDetails || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-gray-800 rounded-full">
                <AvatarImage src={image || "https://github.com/shadcn.png"} className="rounded-full" />
                <AvatarFallback>
                  <UserCircle className="w-16 h-16 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {firstName + " " + lastName || 'N/A'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{accountType.toUpperCase()}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="shadow-sm hover:shadow-md transition-shadow dark:bg-white-400 rounded-full">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4 text-white">
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth" >Date of Birth</Label>
                      <Input id="dateOfBirth" name="dateOfBirth" type="date" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="about">About</Label>
                      <Input id="about" name="about" placeholder="Tell us about yourself" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input id="contactNumber" name="contactNumber" type="tel" placeholder="Your phone number" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        name="gender"
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="profilePhoto">Profile Photo</Label>
                      <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900 dark:text-white">{email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900 dark:text-white capitalize">{gender || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900 dark:text-white">{dateOfBirth || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Info className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">About</p>
                  <p className="text-gray-900 dark:text-white">{about || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Enrolled Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(!courses || courses?.length === 0) ? (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12">
                <Users className="h-12 w-12 mb-4" />
                <p>You haven't enrolled in any courses yet</p>
              </div>
            ) : (
              courses?.map((course, index) => (
                <Course key={index} course={course} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;