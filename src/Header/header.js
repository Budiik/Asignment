import * as React from "react";
import { useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setuser } from "../redux/features/user";
export default function ButtonAppBar() {
  const navigate = useNavigate();
  const pagechange = useCallback(
    (page) => navigate(page, { replace: true }),
    [navigate]
  ); // Navigating to a different page without refreshing the site

  let userdata = useSelector((state) => {
    return state["user"];
  }); // Gets user data from Redux local data store

  let dispatch = useDispatch(); //Function used to write data into Redux

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ cursor:"default" }}>
              ToDo list app
            </Typography>
            <Box sx={{flexGrow: 1}}></Box>

            {!userdata.colections.items ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => {
                    pagechange("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    pagechange("/signup");
                  }}
                >
                  Signup
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  dispatch(setuser({}));
                  pagechange("/");
                }}
              >
                Signout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
