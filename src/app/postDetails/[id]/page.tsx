'use client'
import Loading from '@/app/loading'
import { getPostsDetails } from '@/redux/slices/postsSlice'
import { AppDispatch, AppState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Post from "@/app/_Components/Post"
export default function PostDetails({params:{id}} : {params:{id: string}}) {
  let dispatch = useDispatch<AppDispatch>()
  let {postDetails, isLoading} = useSelector((state:AppState)=>state.post)
    let { comments } = useSelector((state: AppState) => state.comment)
  
  useEffect(() => {
    dispatch(getPostsDetails(id))
  }, [dispatch]);

  return (<>
    {isLoading ? <Loading/>: postDetails && <Post postDetailsComments={true} recentpost={postDetails} />}
  </>
  )
}
