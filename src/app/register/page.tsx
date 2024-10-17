"use client";
import { registerData } from "@/interfaces/registerInterface";
import { userRegister } from "@/redux/slices/registerSlice";
import { AppDispatch, AppState } from "@/redux/store";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  IconButton
} from "@mui/material";
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

export default function Register() {
  const [apiError, setApiError] = useState("");
  const [check, setCheck] = useState(false);
  let dispatch = useDispatch<AppDispatch>();
  let router = useRouter();
  let { Loading, Success, anyError } = useSelector(
    (state: AppState) => state.registerData
  );
  useEffect(() => {
    if (Success && check) {
      router.push("/login");
    } else if (anyError) {
      setApiError(anyError);
    }
  }, [Success, anyError, Loading, check, router]);

  async function register(values: registerData) {
    await dispatch(userRegister(values));
    setCheck(true);
  }
  function showPassword(){
    const passwordInput = document.getElementById('password') as HTMLInputElement
    if(passwordInput.type === 'password'){
      passwordInput.type = 'text'
    }else{
      passwordInput.type = 'password'
    }
  }
  function showRePassword(){
    const passwordInput = document.getElementById('rePassword') as HTMLInputElement
    if(passwordInput.type === 'password'){
      passwordInput.type = 'text'
    }else{
      passwordInput.type = 'password'
    }
  }
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name is too short - should be at least 2 characters.")
      .max(20, "Name is too long - should not exceed 20 characters.")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password is too short - should be at least 8 characters.")
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{8,}$/,
        "Password must start with a capital letter, contain at least one digit, and be 8-20 characters long."
      )
      .required("Password is required"),

    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Password confirmation is required"),

    dateOfBirth: Yup.string().required("dateOfBirth is required"),

    gender: Yup.string().required("gender is required"),
  });
  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    validationSchema,
    onSubmit: register,
  });
  return (
    <Container maxWidth={"sm"}>
      <Typography variant="h4" sx={{ color: "#1976d2", textAlign: "center" }}>
        Register Now
      </Typography>
      <Paper elevation={10} sx={{ p: 2, my: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          {apiError && (
            <Alert sx={{ my: 2 }} severity="error">
              {apiError}
            </Alert>
          )}
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            type="text"
            fullWidth
            sx={{ mb: 2 }}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="name"
          />
          {formik.touched.name && formik.errors.name ? (
            <Alert severity="error">{formik.errors.name}</Alert>
          ) : (
            ""
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
            {formik.values.password && (
              <IconButton
                onClick={() => showPassword()}
                sx={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-68%)",
                }}
                aria-label="settings"
              >
                <RemoveRedEyeRoundedIcon />
              </IconButton>
            )}
          </Box>
          {formik.touched.password && formik.errors.password ? (
            <Alert severity="error">{formik.errors.password}</Alert>
          ) : (
            ""
          )}

        <Box sx={{ position: "relative" }}>
          <TextField
            id="rePassword"
            label="rePassword"
            variant="outlined"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={formik.values.rePassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="rePassword"
          />
          {formik.values.rePassword  && (
              <IconButton
                onClick={() => showRePassword()}
                sx={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-68%)",
                }}
                aria-label="settings"
              >
                <RemoveRedEyeRoundedIcon />
              </IconButton>
            )}
          </Box>
          {formik.touched.rePassword && formik.errors.rePassword ? (
            <Alert severity="error">{formik.errors.rePassword}</Alert>
          ) : (
            ""
          )}
          <FormLabel id="dateOfBirth">dateOfBirth</FormLabel>
          <TextField
            id="dateOfBirth"
            label=""
            variant="outlined"
            type="date"
            fullWidth
            sx={{ mb: 2 }}
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="dateOfBirth"
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
            <Alert severity="error">{formik.errors.dateOfBirth}</Alert>
          ) : (
            ""
          )}
          <FormControl>
            <FormLabel id="gender">Gender</FormLabel>
            <RadioGroup
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              row
              aria-labelledby="gender"
              defaultValue="female"
              name="gender"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
          {formik.touched.gender && formik.errors.gender ? (
            <Alert severity="error">{formik.errors.gender}</Alert>
          ) : (
            ""
          )}
          {Loading ? (
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
              Submit
            </Button>
          )}

          <Typography sx={{ textAlign: "center" }}>
            Already have an account? {"  "}
            <Link
              href="/login"
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
              sign in
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}
