import * as React from "react";
import { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase.config.js";

import { useFormik, validateYupSchema } from "formik";
import * as yup from "yup";

const theme = createTheme();

const validationSchema = yup.object({
  username: yup
    .string()
    .test("Unique username", "Username already in use", async function (value) {
      const docRef = doc(db, "Users", value);
      const docSnap = await getDoc(docRef); 
      if (!docSnap.exists()) { // Finding out if a user with that username exists
        return true;
      } else {
        return false;
      }
    })
    .required("Username is required"),

  password: yup
    .string("Enter your password")
    .min(6, "Password should be of minimum 6 characters length") // minimum amount of characters
    .required("Password is required"),

  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match') // Comparing the two passwords, if they dont returns Passwords must match
    .required("Password confirmation is required"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const pagechange = useCallback(
    (page) => navigate(page, { replace: true }),
    [navigate]
  ); // Navigating to a different page without refreshing the site

  async function createUser(values) {
    console.log(values);
    await db.collection("Users").doc(values.username).set({ // creating a new user, in production password would be hashed.
      password: values.password,
      username: values.username,
      items: {},
    });
  }
  const formik = useFormik({ // Setting up formik
    initialValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createUser(values);
      setTimeout(pagechange("/login"), 1000)
      
    },
    validateOnChange: false,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username) // If yup returns an error this displays it
                }
                helperText={formik.touched.username && formik.errors.username}
                autoComplete="Username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="passwordConfirmation"
                label="Verify password"
                type="password"
                id="passwordConfirmation"
                onChange={formik.handleChange}
                error={
                  formik.touched.passwordConfirmation &&
                  Boolean(formik.errors.passwordConfirmation)
                }
                helperText={
                  formik.touched.passwordConfirmation &&
                  formik.errors.passwordConfirmation
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </form>

            <Link href="login" variant="body2" fullWidth>
              Already have an account? Login
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
