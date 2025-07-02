import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = (handleFilterChange) => {
  const [selectedCategories, SetSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const handleCategoryChange = (categoryId) => {
    SetSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id != categoryId)
        : [...prevCategories, categoryId];

        handleFilterChange(newCategories,sortByPrice);
        return newCategories;
    });
  };

  const selectByPriceHandler=(selectedValue)=>{
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories,selectedValue);
  }
  return (
    <div className="w-full md:w-[20%] ">
      <div className="flex item-center  justify-between">
        <h1 className="font -semibold  text-lg md:text-xl">Filter options</h1>
        <Select  onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {" "}
              {/* <--- ADD THIS */}
              <SelectLabel>Sort by Price</SelectLabel>
              <SelectItem value="low"> low to high </SelectItem>
              <SelectItem value="high"> high to low </SelectItem>
            </SelectGroup>{" "}
            {/* <--- ADD THIS */}
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div className="">
        <h1 className="font-semibold mb-2 ">Category</h1>
        {categories.map((category) => {
          <div className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer:disabled:opacity-70">
              {category.label}
            </Label>
          </div>;
        })}
      </div>
    </div>
  );
};

export default Filter;
