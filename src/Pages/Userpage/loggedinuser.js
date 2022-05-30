import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import Stack from "@mui/material/Stack";
import ListCreator from "./createlist";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Typography } from "@material-ui/core";
import ListPage from "./listpage";
import CloseIcon from "@mui/icons-material/Close";
import { Icon, IconButton, ListItem, Tooltip } from "@mui/material";

import { db } from "../../firebase.config";
import { doc, updateDoc, getDoc, deleteField } from "firebase/firestore";

import { useDispatch } from "react-redux";
import { setuser } from "../../redux/features/user";
import { Box } from "@mui/system";

export default function Userpage() {
  const [open, setOpen] = useState(false); // If True, opens the accordeon in left navbar to show current lists and the option to create a new one.
  const [comp, setComp] = useState(
    <Typography>Select an existing list or create a new one</Typography>
  ); // Uses state to store what component should be rendered

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pagechange = useCallback(
    (page) => navigate(page, { replace: true }),
    [navigate]
  );

  let userdata = useSelector((state) => {
    return state["user"];
  });

  const user = userdata.colections.username;
  const handleClick = () => {
    setOpen(!open);
  }; // Sets open to true if previously was false and the other way around

  useEffect(() => {
    if (!userdata.colections.items) {
      pagechange("/login");
    } // If there is no user currently stored, user gets redirected to login Route
  });

  const deleteList = async (list) => {
    // Item clicked will be deleted from the database, subsequently the redux store will be updated
    const userRef = doc(db, "Users", user);
    let path = "items." + list;
    await updateDoc(userRef, {
      [path]: deleteField(),
    });
    const docSnap = await getDoc(userRef);
    dispatch(setuser(docSnap.data()));
  };

  return (
    <Stack direction="row" spacing={5}>
      <List
        sx={{ width: "100%", maxWidth: 300, bgcolor: "background.paper" }}
        component="nav"
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Your Lists" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {" "}
          {/* Expands when Item Button was clicked */}
          <List component="div" disablePadding>
            {userdata.colections.items ? ( // For every list stored in userdata it creates a button to display that lists page
              Object.keys(userdata.colections.items).map((key) => (
                <ListItem sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ cursor: "pointer" }}
                    primary={userdata.colections.items[key].name}
                    flexGrowth={1}
                    onClick={() => {
                      setComp(
                        <ListPage
                          content={userdata.colections.items[key]}
                        ></ListPage>
        
                      );
                    }}
                  />
                  <Tooltip title="Click to delete this list">
                    <IconButton // Button to delete list
                      onClick={() => {
                        deleteList(key);
                      }}
                    >
                      <CloseIcon
                        content={key}
                        sx={{ color: "red" }}
                      ></CloseIcon>
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))
            ) : (
              <></>
            )}

            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                setComp(<ListCreator></ListCreator>);
              }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add List" />{" "}
              {/* A button that displays List creator on clicks */}
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      {comp}
    </Stack>
  );
}
