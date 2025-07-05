import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { COURSE_API } from "../../config/api";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Course", "Refetch_Creator_Course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "create",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getSearchCourses:builder.query({
      query:({searchQuery,categories,sortByPrice})=>{
        //build query string 
        let queryString=`/search?query=${encodeURIComponent(searchQuery)}`
        //append category 
        if(categories && categories.length>0){
          const categoriesString=categories.map(encodeURIComponent).join(",")
          queryString += `&categories=${categoriesString}`
        }
        //Append sortByPrice
        if(sortByPrice){
          queryString+=`&sortByPrice=${encodeURIComponent(sortByPrice)}`
        }
        return {
          url:queryString,
          method:"GET",
          
        }

      }
    }),
    getPublishedCourse: builder.query({
      query: () => ({
        url: "/publishedCourses",
        method: "GET",
      }),
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [{ type: 'Course', id: courseId }],
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }],
    }),
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),
    editLecture: builder.mutation({
      query: ({ courseId, lectureId, ...body }) => ({
        url: `${courseId}/lecture/${lectureId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    removeLecture: builder.mutation({
      query: ({ lectureId }) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }, "Refetch_Lecture"],
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
    }),
    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}?publish=${query}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetPublishedCourseQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useGetSearchCoursesQuery
} = courseApi;
