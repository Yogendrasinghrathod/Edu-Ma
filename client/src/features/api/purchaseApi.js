import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PURCHASE_API } from "../../config/api";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  tagTypes: ["PurchasedCourses"],
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: "/verify-payment",
        method: "POST",
        body,
      }),
    }),
    checkEnrollmentStatus: builder.query({
      query: (courseId) => ({
        url: `/enrollment-status/${courseId}`,
        method: "GET",
      }),
    }),
    getCourseDetailsWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getAllPurchasedCourses: builder.query({
      query: () => ({
        url: "/purchased-courses",
        method: "GET",
      }),
      providesTags: ["PurchasedCourses"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
  useCheckEnrollmentStatusQuery,
  useGetCourseDetailsWithStatusQuery,
  useGetAllPurchasedCoursesQuery,
} = purchaseApi;