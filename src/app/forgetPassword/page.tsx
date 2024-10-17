'use client'
import { loginData } from '@/interfaces/loginInterface';
import { userLogin } from '@/redux/slices/loginSlice';
import { AppDispatch, AppState } from '@/redux/store';
import { Alert, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';


export default function ForgetPassword() {
  let dispatch = useDispatch<AppDispatch>()
  let router = useRouter()
  let {isLoading, isSuccess, error, token} = useSelector((state:AppState)=>state.loginData)
 useEffect(() => {
    if (isSuccess) {
      if (token) {
        router.push('/resetPassword');
      }
    } else if (error) {
      console.log(error);
    }
  }, [isSuccess, error, token, isLoading, router]);

  async function login(values:loginData) {
    await dispatch(userLogin(values))
  }
  let validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address format')
      .required('Email is required'),
  
    password: Yup.string()
      .min(8, 'Password is too short - should be at least 8 characters.')
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{8,}$/, 
        'Password must start with a capital letter, contain at least one digit, and be 8-20 characters long.')
      .required('Password is required'),
  });
  let formik = useFormik({
    initialValues: {
      email:'',
      password:'',
    },validationSchema,
    onSubmit:login
  })
  return (
    <Container maxWidth={"sm"}>
        <Typography variant='h4' sx={{color:'#1976d2',textAlign:"center"}}>Forget Password</Typography>
      <Paper elevation={10} sx={{p:2,my:3}}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
              id="email"
              label="Email"
              placeholder="Enter Your Email"
              variant="standard"
              type='email'
              fullWidth
              sx={{mb:2}}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="email"

              />
              {formik.touched.email && formik.errors.email?(
                <Alert severity="error">{formik.errors.email}</Alert>
              ):''}
          <TextField
              id="password"
              label="password"
              placeholder="Enter Your Password"
              variant="standard"
              type='password'
              fullWidth
              sx={{mb:2}}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="password"
            />
              {formik.touched.password && formik.errors.password?(
                <Alert severity="error">{formik.errors.password}</Alert>
              ):''}
            {isLoading?<Button type='button' fullWidth sx={{ my:2 }} variant="contained">
                <CircularProgress size={20} sx={{color:"white", fontSize:"15px"}} />
            </Button>:
            <Button type='submit' fullWidth sx={{ letterSpacing: 2,my:2 }} variant="contained">
              Reset Password
            </Button>}
            <Typography sx={{ textAlign: "center", mb:"5px" }}>
                <Link
                  href="/login"
                  style={{
                    color: "black",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) =>{
                    (e.currentTarget.style.textDecoration = "underline"),
                    (e.currentTarget.style.color = "#1976d2")
                  }
                }
                onMouseOut={(e) =>{
                    (e.currentTarget.style.textDecoration = "none"),
                    (e.currentTarget.style.color = "black")
                  }
                  }
                >
                  Back to sign in
                </Link>
              </Typography>
        </form>
      </Paper>
    </Container>
  )
}
