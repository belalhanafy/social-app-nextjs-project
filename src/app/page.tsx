
'use client'

import { getPaginationInfo, getPosts } from "@/redux/slices/postsSlice";
import { AppDispatch, AppState } from "@/redux/store";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import Loading from "./loading";
import Post from "./_Components/Post";
import { Box, Pagination, Stack } from "@mui/material";

export default function Home() {
  let router = useRouter();
  let dispatch = useDispatch<AppDispatch>()
  let {posts,isLoading,paginationInfo,isSuccess} = useSelector((state:AppState)=>state.post)
  let {token} = useSelector((state:AppState)=>state.loginData)
  // useEffect to check authentication and fetch pagination info
useEffect(() => {
  if (!token) {
    router.push('/login');
  }else{
    if (token) {
      dispatch(getPaginationInfo({limit:50}));
    }
  }
}, [router,dispatch,token]);

  const [currpage, setCurrPage] = useState(19);
  const handleChange = (event: Event | any, value: number) => {
    const reversePage = paginationInfo.numberOfPages - (value - 1);
    setCurrPage(reversePage);
  };
  useEffect(() => {
    if (paginationInfo && Object.keys(paginationInfo).length !== 0 && posts && token) {
      dispatch(getPosts({ limit: paginationInfo.limit, page: currpage}));
    }
  }, [paginationInfo,currpage,dispatch,isSuccess]);
  
  return <>
  {/* .slice() is called first to create a shallow copy of the posts array. This prevents the original posts array from being mutated by .reverse(). */}
  {isLoading && paginationInfo &&Object.keys(paginationInfo).length !== 0 ?<Loading/> : posts?.slice().reverse().map((post)=> <Post recentpost={post} key={post._id} />)}
  {paginationInfo && Object.keys(paginationInfo).length !== 0 &&
      <Box sx={{display:"flex",justifyContent:"center", my:"15px"}}>
        <Stack spacing={2}>
          <Pagination count={paginationInfo?.numberOfPages} page={paginationInfo?.numberOfPages - (currpage - 1)} onChange={handleChange} color="primary" />
        </Stack>
      </Box>
  }

  </> 
}
