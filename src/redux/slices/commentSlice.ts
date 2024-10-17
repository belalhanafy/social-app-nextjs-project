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
export let addComment = createAsyncThunk(
    'commentSlice/addComment',
    async ({ id, comment }: { id: string; comment: string }) => {
        try {
            let { data } = await axios.post(
                `https://linked-posts.routemisr.com/comments`,
                {
                    content: comment,
                    post: id,
                },
                { headers: getAuthHeaders() }
            );
            console.log(data);
            toast.success("Comment added successfully", {
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
            return(data.comments)
        } catch (error) {
            console.log(error);
        }
    }
);

export let deleteComment = createAsyncThunk('commentSlice/deleteComment',async (commentId:string) => {
    try {
        let {data} = await axios.delete(`https://linked-posts.routemisr.com/comments/${commentId}`,{headers:getAuthHeaders()})
        console.log(data);
        toast.success("comment deleted successfully", {
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

export let getPostComments = createAsyncThunk('commentSlice/getPostComments',async (postId:string) => {
    try {
        let {data} = await axios.get(`https://linked-posts.routemisr.com/posts/${postId}/comments`,{headers:getAuthHeaders()})
        return data.comments
    } catch (error) {
        console.log(error);
    }
})


export let updateComment = createAsyncThunk('commentSlice/updateComment',async ({commentId,content}:{commentId:string,content:string}) => {
    try {
        let {data} = await axios.put(`https://linked-posts.routemisr.com/comments/${commentId}`,{
            content
        },{headers:getAuthHeaders()})
        toast.success("comment updated successfully", {
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
        console.log(data.comment);
        return data.comment
    } catch (error) {
        console.log(error);
    }
})

let initialState: {comments:Comment[], commentLoading: boolean, commentSuccess:boolean } = {comments:[], commentLoading: false, commentSuccess:true }

let commentSlice = createSlice({
    name: "commentSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addComment.pending, (state) => {
            state.commentLoading = true
        })
        builder.addCase(deleteComment.pending, (state) => {
            state.commentLoading = true
            state.commentSuccess = false
        })
        builder.addCase(getPostComments.pending, (state) => {
            state.commentLoading = true
            state.commentSuccess = false
        })


        builder.addCase(addComment.rejected, (state: any) => {
            state.commentLoading = false
            state.commentSuccess = false
        })
        builder.addCase(deleteComment.rejected, (state: any) => {
            state.commentLoading = false
            state.commentSuccess = true
        })
        builder.addCase(getPostComments.rejected, (state: any) => {
            state.commentLoading = false
            state.commentSuccess = false
        })



        builder.addCase(addComment.fulfilled, (state,action) => {
            state.commentLoading = false
            state.comments = action.payload
        })
        builder.addCase(deleteComment.fulfilled, (state) => {
            state.commentLoading = false
            state.commentSuccess = true
        })
        builder.addCase(getPostComments.fulfilled, (state,action) => {
            state.commentLoading = false
            state.commentSuccess = true
            state.comments = action.payload
        })
    }
})

export let commentReducer = commentSlice.reducer
