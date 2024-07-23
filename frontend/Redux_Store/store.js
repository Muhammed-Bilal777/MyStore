import {configureStore} from "@reduxjs/toolkit"
import { productApi } from "./api/productApis"
import { authApis } from "./api/authApis"
import { userApi } from "./api/userApi"
 
export const store = configureStore({
    reducer: {
        [productApi.reducerPath] : productApi.reducer,
        [authApis.reducerPath] : authApis.reducer,
        [userApi.reducerPath] : userApi.reducer,
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productApi.middleware,authApis.middleware,userApi.middleware) 
})



