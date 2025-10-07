import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { COURSE_PROGRESS_API } from "../../config/api";

export const courseProgressApi = createApi({
    reducerPath: "courseProgressApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_PROGRESS_API,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `${courseId}`,
                method: "GET",
            })
        }),
        updateLectureProgress: builder.mutation({
            query: ({ courseId, lectureId }) => ({
                url: `${courseId}/lecture/${lectureId}/view`,
                method: "POST",
            })
        }),
        CompleteCourse: builder.mutation({
            query: (courseId) => ({ 
                url: `${courseId}/complete`,
                method: "POST",
            })
        }),
        InCompleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `${courseId}/incomplete`, 
                method: "POST",
            })
        }),
        getLectureNote: builder.query({
            query: ({ courseId, lectureId }) => ({
                url: `${courseId}/lecture/${lectureId}/note`,
                method: "GET",
            })
        }),
        upsertLectureNote: builder.mutation({
            query: ({ courseId, lectureId, content }) => ({
                url: `${courseId}/lecture/${lectureId}/note`,
                method: "POST",
                body: { content },
            })
        })
    })
})

export const {
    useGetCourseProgressQuery,
    useUpdateLectureProgressMutation,
    useCompleteCourseMutation,
    useInCompleteCourseMutation,
    useGetLectureNoteQuery,
    useUpsertLectureNoteMutation,
} = courseProgressApi;
