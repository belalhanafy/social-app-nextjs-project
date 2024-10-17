'use client'
import { loginData } from '@/interfaces/loginInterface';
import { userLogin } from '@/redux/slices/loginSlice';
import { AppDispatch, AppState } from '@/redux/store';
import { Alert, Box, Button, CircularProgress, Container, IconButton, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';

export default function Login() {
  const [apiError, setApiError] = useState('')
  let dispatch = useDispatch<AppDispatch>()
  let router = useRouter()
  // let {token,isLoading,isSuccess} = useSelector((state:LoginState)=>state.loginData)
  let { isLoading, isSuccess, error, token } = useSelector((state: AppState) => state.loginData)
  useEffect(() => {
    if (isSuccess) {
      if (token) {
        router.push('/');
      }
    } else if (error) {
      setApiError(error);
    }
  }, [isSuccess, error, token, isLoading,router]);

  async function login(values: loginData) {
    await dispatch(userLogin(values))
  }
  
  function showPassword(){
    const passwordInput = document.getElementById('password') as HTMLInputElement
    if(passwordInput.type === 'password'){
      passwordInput.type = 'text'
    }else{
      passwordInput.type = 'password'
    }
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
      email: '',
      password: '',
    }, validationSchema,
    onSubmit: login
  })
  return (
    <Container maxWidth={"sm"}>
      <Typography variant="h4" sx={{ color: "#1976d2", textAlign: "center" }}>
        Login Now
      </Typography>
      <Paper elevation={10} sx={{ p: 2, my: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          {apiError && (
            <Alert sx={{ my: 2 }} severity="error">
              {apiError}
            </Alert>
          )}
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            sx={{ mb: 2 }}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="email"
          />
          {formik.touched.email && formik.errors.email ? (
            <Alert severity="error">{formik.errors.email}</Alert>
          ) : (
            ""
          )}

          <Box sx={{ position: "relative" }}>
            <TextField
              id="password"
              label="password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="password"
            />
            {formik.values.password && <IconButton
              onClick={()=>showPassword()}
              sx={{
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-68%)",
              }}
              aria-label="settings"
            >
              <RemoveRedEyeRoundedIcon />
            </IconButton>}

          </Box>
          {formik.touched.password && formik.errors.password ? (
            <Alert severity="error">{formik.errors.password}</Alert>
          ) : (
            ""
          )}
          {isLoading ? (
            <Button type="button" fullWidth sx={{ my: 2 }} variant="contained">
              <CircularProgress
                size={20}
                sx={{ color: "white", fontSize: "15px" }}
              />
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              sx={{ letterSpacing: 2, my: 2 }}
              variant="contained"
            >
              login
            </Button>
          )}
          <Typography sx={{ textAlign: "center", mb: "5px" }}>
            <Link
              href="/forgetPassword"
              style={{
                color: "black",
                textDecoration: "none",
              }}
              onMouseOver={(e) => {
                (e.currentTarget.style.textDecoration = "underline"),
                  (e.currentTarget.style.color = "#1976d2");
              }}
              onMouseOut={(e) => {
                (e.currentTarget.style.textDecoration = "none"),
                  (e.currentTarget.style.color = "black");
              }}
            >
              Forgot Password?
            </Link>
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Dont have an account? {"  "}
            <Link
              href="/register"
              style={{
                color: "#1976d2",
                textDecoration: "none",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              sign up
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}
