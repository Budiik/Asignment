import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import CreateItem from "./createitem";
import { Typography } from "@material-ui/core";
import { Divider, IconButton, Stack, TextField, Tooltip } from "@mui/material";

import { db } from "../../firebase.config";
import { doc, updateDoc, getDoc, deleteField } from "firebase/firestore";

import { useDispatch } from "react-redux";
import { setuser } from "../../redux/features/user";
import { useSelector } from "react-redux";

import InputAdornment from "@mui/material/InputAdornment";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Search from "@mui/icons-material/Search";

export default function ListPage(content) {
  const [finishedSearch, setFinishedSearch] = useState("All"); // Stores what elements will user see default == All
  const [searchedString, setSearchedString] = useState(""); // Stores searched string

  const dispatch = useDispatch();
  let userdata = useSelector((state) => {
    return state["user"];
  });

  const user = userdata.colections.username;
  let list = userdata.colections.items[content.content.name]
  console.log(list)

  const markAsDone = async (itemName) => {
    // Item clicked will be marked as done in the Firebase database, subsequently the redux store will be updated
    const userRef = doc(db, "Users", user);
    let path =
      "items." + content.content.name + ".todoItems." + itemName + ".finished";
    await updateDoc(userRef, {
      [path]: true,
    });
    const docSnap = await getDoc(userRef);
    dispatch(setuser(docSnap.data()));
  };
  const deleteItem = async (itemName) => {
    // Item clicked will be deleted from the database, subsequently the redux store will be updated
    const userRef = doc(db, "Users", user);
    let path = "items." + content.content.name + ".todoItems." + itemName;
    await updateDoc(userRef, {
      [path]: deleteField(),
    });
    const docSnap = await getDoc(userRef);
    dispatch(setuser(docSnap.data()));
  };

  return (
    list ? 
    <Box sx={{ maxWidth: "60vw", width: "60vw", display: "grid", gap: 1 }}>
      <Box>
        <Typography>List name: {content.content.name}</Typography>
        <Typography>List description: {content.content.description}</Typography>
      </Box>
      <Stack direction="row" gap={2} width={"100%"}>
        <TextField
          onChange={(e) => {
            setSearchedString(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        ></TextField>
        {/* Changes in this field are stored and Later used to aply searching */}
        <Button onClick={() => setFinishedSearch("All")}>All</Button>{" "}
        {/* These buttons change Finished search state, therefore the items shown will be change */}
        <Button onClick={() => setFinishedSearch(true)}>Finished</Button>
        <Button onClick={() => setFinishedSearch(false)}>Unfinished</Button>
        <Box flexGrow={1}></Box>
        
      </Stack>
      <Box
        height={"50vh"}
        sx={{ overflowY: "auto" }}
        maxHeight={"50vh"}
        width="100%"
        border={1}
      >
        <Typography width={"100%"} align="center">
          Your items{" "}
        </Typography>
        <Divider></Divider>
        {Object.keys(userdata.colections.items[content.content.name].todoItems).map((key) =>
          (finishedSearch == userdata.colections.items[content.content.name].todoItems[key].finished ||
            finishedSearch == "All") && // If the item finished state matches the required state // and
          (key.startsWith(searchedString) || searchedString == "") ? ( // The item name starts with, this could also be changed to includes depending on preference, the string searched or there is no search string proceeds
            <Box>
              <Box width="100%" sx={{ display: "flex" }}>
                <Box maxWidth={"20%"} width={"20%"}>
                  <Typography width={"100%"}>Name: {key}</Typography>
                </Box>
                <Box maxWidth={"40%"} width={"40%"}>
                  <Typography width={"100%"}>
                    Description: {userdata.colections.items[content.content.name].todoItems[key].itemdescription}
                  </Typography>
                </Box>

                {!userdata.colections.items[content.content.name].todoItems[key].finished ? (
                  <Box maxWidth={"30%"} width={"30%"}>
                    <Typography width={"100%"}>
                      Deadline:{" "}
                      {String(
                        new Date(
                          userdata.colections.items[content.content.name].todoItems[key].date.seconds * 1000
                        ).toUTCString()
                      )}
                    </Typography>
                  </Box>
                ) : (
                  <Box maxWidth={"30%"} width={"30%"}>
                    <Typography width={"100%"}>Yeey you finished</Typography>
                  </Box>
                )}
                <Stack maxWidth={"10%"} width={"10%"} direction="row">
                  {!userdata.colections.items[content.content.name].todoItems[key].finished ? (
                    <Box width={"50%"}>
                      <Tooltip title="Mark as done">
                        <IconButton
                          onClick={() => markAsDone(key)}
                          sx={{ alignItems: "center" }}
                        >
                          <CheckIcon sx={{ color: "green" }}></CheckIcon>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Box width="50%"></Box>
                  )}
                  <Box width={"50%"}>
                    <Tooltip title="Delete" width={"50%"}>
                      <IconButton onClick={() => deleteItem(key)}>
                        <CloseIcon sx={{ color: "red" }}></CloseIcon>
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              </Box>
              <Divider></Divider>
            </Box>
          ) : (
            <></>
          )
        )}
      </Box>
      <CreateItem content={content.content.name}></CreateItem>{" "}
      {/* Create item form  */}
    </Box> : <></>
  );
}
