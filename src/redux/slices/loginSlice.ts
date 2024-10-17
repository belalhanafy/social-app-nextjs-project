import { UserData } from './../../interfaces/loginInterface';
import { User } from './../../interfaces/postInterface';
import { loginData } from "@/interfaces/loginInterface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Bounce, toast } from 'react-toastify';

const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return token ? { token } : {};
    }
};
export let userLogin = createAsyncThunk('userSlice/userLogin', async (values: loginData) => {
    try {
        let { data } = await axios.post(`https://linked-posts.routemisr.com/users/signin`, values);
        console.log(data);
        return data.token
    } catch (error: any) {
        throw error.response.data.error;
    }
})
export let getUserData = createAsyncThunk('userSlice/getUserData', async () => {
    try {
        let { data } = await axios.get(`https://linked-posts.routemisr.com/users/profile-data`, { headers: getAuthHeaders() });
        return data.user
    } catch (error: any) {
        throw error.response.data.error;
    }
})
export let uploadphoto = createAsyncThunk('userSlice/uploadphoto', async (formData: FormData) => {
    try {
        let { data } = await axios.put(`https://linked-posts.routemisr.com/users/upload-photo`, formData, { headers: getAuthHeaders() });
        console.log(data);
        toast.success("photo updated successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    } catch (error: any) {
        console.log(error);

    }
})

let initialState: { userData: null | UserData, token: string | null, isLoading: boolean, error: string, isSuccess: boolean } =
{
    userData: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isLoading: false,
    error: '',
    isSuccess: false
}
let userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.userData = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(userLogin.rejected, (state: any, action) => {
            console.log(state);
            state.error = action.error.message,
                state.isLoading = false,
                state.isSuccess = false
        })
        builder.addCase(userLogin.fulfilled, (state, action) => {
            console.log(action);
            console.log(action.payload);
            state.isLoading = false,
                state.isSuccess = true,
                state.token = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem("token", action.payload)
            }
        })
        builder.addCase(getUserData.fulfilled, (state, action) => {
            state.userData = action.payload
        })
    }
})

export let loginReducer = userSlice.reducer;
export let { logout } = userSlice.actions;
