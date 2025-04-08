import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { userLoggedIn } from "../authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api/v1/auth",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "/login",
        method: "POST",
        body: inputData,
      }),
    }),
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "/signup",
        method: "POST",
        body: inputData,
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const result = await queryFulfilled;
      //     dispatch(userLoggedIn({ user: result.data.user }));
      //   } catch {
      //     console.log("Error");
      //   }
      // },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
    }),
    getUserDetails: builder.query({
      query: () => ({
        url: "getUserDetails",
        method: "GET",
      }),
    }),
    uploadDisplayImage: builder.mutation({
      query: () => ({
        url: "updateDisplayPicture",
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData(
              "getUserDetails",
              undefined,
              (draft) => {
                draft.user.displayPicture = result.data.displayPicture;
              }
            )
          );
        } catch {
          console.log("Upload failed");
        }
      },
    }),
  }),
});
// console.log(authApi);

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserDetailsQuery,
  useUploadDisplayImageMutation,
  useLogoutUserMutation,
} = authApi;
// console.log(useRegisterMutation);
