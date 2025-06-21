import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api/v1",
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
          dispatch(userLoggedIn({user:result.data.user}));
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
      async onQueryStarted(_,{queryFulfilled,dispatch}){
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
          dispatch(userLoggedIn({user:result.data.user}));
        }
        catch(error){
          console.log(error);
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
