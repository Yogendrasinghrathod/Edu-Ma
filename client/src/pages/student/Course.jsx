import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const Course = () => {
  return (
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src="data:image/jpeg;base64,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"
          className="w-full h-36 object-cover rounded-t-lg"
          alt="course"
        />
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            Next js complete course in hindi 2025{" "}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className=" h-8 w-8 size-11 rounded-full ">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 >Lakshay </h1>
            </div>
            <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full"> 
                Advance
            </Badge>
          </div>
          <div className="text-lg font-bold">
            <span>₹499</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default Course;
