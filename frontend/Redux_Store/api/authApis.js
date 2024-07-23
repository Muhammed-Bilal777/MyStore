
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApis = createApi({
    reducerPath: "authApis",
    baseQuery: fetchBaseQuery({ baseUrl:"http://localhost:3000/api/v1"}),
    endpoints: (builder) => ({
         register: builder.mutation({
            query(body) {
                return {
                  url: "/register",
                  method: "POST",
                  body,
                }
            }
         }),
         login: builder.mutation({
          query(body) {
              return {
                url: "/login",
                method: "POST",
                body,
              }
          }
       })
    })
});


export const {  useLoginMutation ,useRegisterMutation  }= authApis;