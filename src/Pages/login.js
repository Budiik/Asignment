import * as React from "react";
import {useState, useCallback} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  doc,
  getDoc,
} from "@firebase/firestore";
import { db } from "../firebase.config.js";
import {setuser} from "../redux/features/user"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";




const theme = createTheme();

export default function Login() {
  const [alertmessage, setAlertmessage] = useState({ message: "", color: "" }); // Creating a state that can store a required alert message, and the requiered color
  let dispatch = useDispatch()//Function used to write data into Redux

  const navigate = useNavigate();
  const pagechange = useCallback((page) => navigate(page, {replace: true}), [navigate]) // Navigating to a different page without refreshing the site




  
  async function handleSubmit(event) { 
    event.preventDefault(); // Prevents answers to be empty
    const data = new FormData(event.currentTarget); // Formating recieved data 
    const docRef = doc(db, "Users", data.get("username")); // Trying to find user by username ↓
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) { // If user exists, proceeds, else (49) sets alert to User does not exist
      if (docSnap.data().password == data.get("password")) { // If passowrd passed and password stored in database match, proceeds, else (43) sets alert to Wrong password
          dispatch(setuser(docSnap.data())) // Passing userdata to the store from where you can read it in any part of the website
          
          pagechange("/user") // Changes the page to user where his data is shown
      } else {
        setAlertmessage({
          message: "Wrong password",
          color: "red",
        });
      }
    } else {
      setAlertmessage({
        message: "User does not exist",
        color: "red",
      });
    }
  }

  return (<ThemeProvider theme={theme}>
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
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
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
              autoComplete="current-password"
            />
            <Typography
              component="h1"
              variant="h5"
              color={alertmessage.color}
              marginTop="2%"
              textAlign={"center"}
            >
              {alertmessage.message}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Link href="signup" variant="body2" fullWidth>
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>)
  ;
}
