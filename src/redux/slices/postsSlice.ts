import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Post } from '@/interfaces/postInterface';
import { Bounce, toast } from 'react-toastify';

const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return token ? { token } : {};
    }
  };
export let getPosts = createAsyncThunk('postsSlice/getPosts',async ({limit,page}:{limit?:number, page?:number}) => {
    try {
        let {data} = await axios.get(`https://linked-posts.routemisr.com/posts?limit=${limit}&page=${page}`,{ headers: getAuthHeaders() })
        return data.posts
    } catch (error) {
        console.log(error);
    }
})
export let getPaginationInfo = createAsyncThunk('postsSlice/getPaginationInfo',async ({limit,page}:{limit?:number, page?:number}) => {
    try {
        let {data} = await axios.get(`https://linked-posts.routemisr.com/posts?limit=${limit}&page=${page}`,{ headers: getAuthHeaders() })
        return data.paginationInfo
    } catch (error) {
        console.log(error);
    }
})
export let getUserPosts = createAsyncThunk('postsSlice/getUserPosts',async ({ limit ,user }: { limit?: number; user: string }) => {
    try {
        let {data} = await axios.get(`https://linked-posts.routemisr.com/users/${user}/posts?limit=${limit}`,{ headers: getAuthHeaders() })
        return data.posts
    } catch (error) {
        console.log(error);
    }
    
})

export let addPost = createAsyncThunk('postsSlice/addPost',async (formData : FormData) => {
    try {
        let {data} = await axios.post(`https://linked-posts.routemisr.com/posts`,formData,{ headers: getAuthHeaders() })
        toast.success("post added successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
    } catch (error) {
        console.log(error);
    }
    
})

export let updatePost = createAsyncThunk('postsSlice/updatePost',async ({postId,formData}:{postId:string, formData : FormData}) => {
    try {
        let {data} = await axios.put(`https://linked-posts.routemisr.com/posts/${postId}`,formData,{ headers: getAuthHeaders() })
        toast.success("post updated successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
            console.log(data);
    } catch (error) {
        console.log(error);
    }
    
})

export let getPostsDetails = createAsyncThunk('postsSlice/getPostsDetails',async (id:string) => {
    try {
        let {data} = await axios.get(`https://linked-posts.routemisr.com/posts/${id}`,{ headers: getAuthHeaders() })
        return data.post
    } catch (error) {
        console.log(error);
    }
})
export let deletePost = createAsyncThunk('postsSlice/deletePost',async (id:string) => {
    try {
        let {data} = await axios.delete(`https://linked-posts.routemisr.com/posts/${id}`,{ headers: getAuthHeaders() })
        toast.success("post deleted successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
            console.log(data);
    } catch (error) {
        console.log(error);
    }
})

let initialState : {isSuccess:boolean,paginationInfo:object|any,posts : Post[],isLoading:boolean,loading:boolean , postDetails : Post|null} = {isSuccess:true,paginationInfo:{},posts:[],isLoading:false,loading:false, postDetails : null}

let postsSlice = createSlice({
    name: "postsSlice",
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder.addCase(getPosts.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(getPaginationInfo.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(getUserPosts.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(getPostsDetails.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(addPost.pending,(state)=>{
            state.isLoading=true
            state.isSuccess=false
        })
        builder.addCase(deletePost.pending,(state)=>{
            state.isLoading=true
            state.isSuccess=false
        })
        builder.addCase(updatePost.pending,(state)=>{
            state.isLoading=true
            state.isSuccess=false
        })


        builder.addCase(getPosts.rejected,(state:any)=>{
            state.isLoading=false
        })
        builder.addCase(getPaginationInfo.rejected,(state:any)=>{
            state.isLoading=false
        })
        builder.addCase(getUserPosts.rejected,(state:any)=>{
            state.loading=false
        })
        builder.addCase(getPostsDetails.rejected,(state:any)=>{
            state.isLoading=false
        })
        builder.addCase(addPost.rejected,(state:any)=>{
            state.isLoading=false
            state.isSuccess=true
        })
        builder.addCase(deletePost.rejected,(state:any)=>{
            state.isLoading=false
            state.isSuccess=false
        })
        builder.addCase(updatePost.rejected,(state:any)=>{
            state.isLoading=false
            state.isSuccess=false
        })

        
        builder.addCase(getPosts.fulfilled,(state,action)=>{
            state.isLoading=false
            state.posts = action.payload
        })
        builder.addCase(getPaginationInfo.fulfilled,(state,action)=>{
            state.isLoading=false
            state.paginationInfo = action.payload
        })
        builder.addCase(getUserPosts.fulfilled,(state,action)=>{
            state.loading=false
            state.posts = action.payload
        })
        builder.addCase(getPostsDetails.fulfilled,(state,action)=>{
            state.isLoading=false
            state.postDetails = action.payload
        })
        builder.addCase(addPost.fulfilled,(state)=>{
            state.isLoading=false
            state.isSuccess=true
        })
        builder.addCase(deletePost.fulfilled,(state)=>{
            state.isLoading=false
            state.isSuccess=true
        })
        builder.addCase(updatePost.fulfilled,(state)=>{
            state.isLoading=false
            state.isSuccess=true
        })
    }
})

export let postReducer = postsSlice.reducer
