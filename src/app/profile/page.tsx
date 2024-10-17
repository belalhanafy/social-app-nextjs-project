'use client'
import React, { useEffect, useState } from 'react'

import {Box, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '@/redux/store';
import { addPost, getUserPosts } from '@/redux/slices/postsSlice';
import { Bounce, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Loading from '../loading';
import Post from "../_Components/Post";


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
type DecodedToken = {
  user: string;
  iat: number;
};
export default function Profile() {
  let {token} = useSelector((state:AppState)=>state.loginData)
  let {posts,isLoading,loading,isSuccess} = useSelector((state:AppState)=>state.post)

  const decoded = token ? jwtDecode<DecodedToken>(token) : null;
  const user = decoded?.user;
  const [fileName, setfileName] = useState(null)

  let dispatch = useDispatch<AppDispatch>()


  useEffect(() => {
    if (user && isSuccess) {
      dispatch(getUserPosts({ user, limit : 50 }));
    }
  }, [isSuccess,dispatch]);
  function handleFormSubmit(e:Event|any) {
    e.preventDefault();
    
    let body = e.target.body.value;
    let image = e.target.image.files[0];
    setfileName(image.name)
    let formData = new FormData()
    formData.append('body', body);
    {image && formData.append('image', image);}
    
    dispatch(addPost(formData))
    e.target.body.value = ''
    setfileName(null)

  }
  // to change name 
  function handleFile(e:Event|any) {
    try {
      let file = e.target.files[0].name;
      setfileName(file)
      toast.success("file uploaded successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
      
    } catch (error) {
      toast.error("failed to upload file", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    }
  }
  return (<>
    <Container maxWidth={"md"}>
      <Paper elevation={10} sx={{ p: 2, my: 3 }}>
        <form onSubmit={handleFormSubmit}>
        <Typography variant='h5' sx={{ my: 1,color: '#1976d2', textAlign: "left" }}>Add New Post</Typography>
          <Box style={{display:"flex", flexDirection:"column", gap:"30px"}}>
          <TextField
            id="body"
            label="What's on your mind?"
            multiline
            rows={4}
            name='body'
          />
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={ !fileName && <CloudUploadIcon />}
          >
            {fileName?fileName:
            "Upload files"
            }
            <VisuallyHiddenInput
              type="file"
              onChange={(e)=>handleFile(e)}
              id='image'
              name='image'
            />
          </Button>
          
          </Box>
          {isLoading?<Button type='button' fullWidth sx={{ mt:3 }} variant="contained">
                <CircularProgress size={20} sx={{color:"white", fontSize:"15px"}} />
            </Button>:
            <Button type='submit' fullWidth sx={{ letterSpacing: 2,mt:3 }} variant="contained">
              Add Post
            </Button>}
        </form>
      </Paper>
    </Container>
    {loading?<Loading/> : posts?.slice().reverse().map((post)=> <Post recentpost={post} key={post._id} />)}

  </>
  )
}
