import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { API_BASE_URL } from "../../config/api";


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "/auth/login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_,{queryFulfilled,dispatch}){
        try{
          const result=await queryFulfilled;
          dispatch(userLoggedIn({user:result.data.user, token:result.data.token}));
        }
        catch(error){
          console.log(error);
        }
      }
    }),
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "/auth/signup",
        method: "POST",
        body: inputData,
      }),
      
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_,{dispatch}){
        try{
          dispatch(userLoggedOut());
        }
        catch(error){
          console.log(error);
        }
      }
    }),

    loadUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      async onQueryStarted(_,{queryFulfilled,dispatch}){
        try{
          const result=await queryFulfilled;
          dispatch(userLoggedIn({user:result.data.user, token:result.data.token}));
        }
        catch(error){
          if (error?.error?.status === 401) {
            // unauthenticated; ignore
          } else {
            console.log("Auth error:", error);
          }
        }
      }
    }),

    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body: formData,
        headers:{},
        credentials:"include"
      }),
      
    }),
  }),
});
// console.log(authApi);

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation, 
  useLogoutUserMutation,
} = authApi;
// console.log(useRegisterMutation);
