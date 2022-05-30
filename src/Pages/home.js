import React from "react";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%"
      }}
    >
      <Typography component="h1" variant="h5">
        Please log in or create your acount to see your ToDo list
      </Typography>
    </Box>
  );
};

export default Home;
