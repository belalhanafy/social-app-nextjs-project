import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "./slices/loginSlice";
import { registerReducer } from "./slices/registerSlice";
import {resetPassReducer } from "./slices/forgetPasswordSlice";
import { postReducer } from "./slices/postsSlice";
import { commentReducer } from "./slices/commentSlice";

export let store = configureStore({
    reducer: {
        loginData: loginReducer,
        registerData: registerReducer,
        resetPassData: resetPassReducer,
        post: postReducer,
        comment:commentReducer
    }
})
export type AppDispatch = typeof store.dispatch;
export type AppState =ReturnType<typeof store.getState>;