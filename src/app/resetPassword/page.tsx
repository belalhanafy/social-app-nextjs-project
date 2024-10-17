'use client'
import { resetPassData } from '@/interfaces/forgetPassInterface';
import { resetPass } from '@/redux/slices/forgetPasswordSlice';
import { AppDispatch, AppState } from '@/redux/store';
import { Alert, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

export default function ResetPassword() {
    let dispatch = useDispatch<AppDispatch>()
    let router = useRouter()
    let {isLoading, isSuccess, error} = useSelector((state:AppState)=>state.resetPassData)

    useEffect(() => {
      if (isSuccess) {
        router.push("/login")
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      } else if (error) {
        console.log(error);
        
      }
    }, [isSuccess, error, isLoading, router]);
  
    async function resetPassword(values:resetPassData) {
      await dispatch(resetPass(values))
    }
    let validationSchema = Yup.object().shape({
    
      password: Yup.string()
        .min(8, 'Password is too short - should be at least 8 characters.')
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{8,}$/, 
          'Password must start with a capital letter, contain at least one digit, and be 8-20 characters long.')
        .required('Password is required'),
        newPassword: Yup.string()
        .min(8, 'Password is too short - should be at least 8 characters.')
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{8,}$/, 
          'Password must start with a capital letter, contain at least one digit, and be 8-20 characters long.')
        .required('Password is required')
        .notOneOf([Yup.ref('password')], 'New password cannot be the same as old password'),
    });
    let formik = useFormik({
      initialValues: {
        password:'',
        newPassword:'',
      },validationSchema,
      onSubmit:resetPassword
    })
    return (
      <Container maxWidth={"sm"}>
          <Typography variant='h4' sx={{color:'#1976d2',textAlign:"center"}}>Change Password</Typography>
        <Paper elevation={10} sx={{p:2,my:3}}>
          <form onSubmit={formik.handleSubmit}>
              <TextField
                id="oldPassword"
                label="Old Password"
                placeholder="Enter Old Password"
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
              <TextField
                id="newPassword"
                label="New Password"
                placeholder="Enter New Password"
                variant="standard"
                type='password'
                fullWidth
                sx={{mb:2}}
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="newPassword"
              />
                {formik.touched.newPassword && formik.errors.newPassword?(
                  <Alert severity="error">{formik.errors.newPassword}</Alert>
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
