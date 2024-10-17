import { registerData } from "@/interfaces/registerInterface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export let userRegister = createAsyncThunk('registerSlice/userRegister',async (values:registerData)=>{
    try {
            let {data} = await axios.post(`https://linked-posts.routemisr.com/users/signup`,values);
        } catch (error:any) {
            throw error.response.data.error;
        }
    })
let initialState : {Loading:boolean,anyError:string,Success:boolean} = {Loading:false,anyError:'',Success:false}

let registerSlice = createSlice({
    name: "registerSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(userRegister.pending,(state)=>{
            state.Loading=true
        })
        builder.addCase(userRegister.rejected,(state:any,action)=>{
            state.anyError=action.error.message,
            state.Loading=false,
            state.Success=false
        })
        builder.addCase(userRegister.fulfilled,(state,)=>{
            state.Loading=false,
            state.Success=true
        })
    }
})
export let registerReducer = registerSlice.reducer;