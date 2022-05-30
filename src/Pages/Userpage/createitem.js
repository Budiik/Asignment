import * as React from "react";
import Box from "@mui/material/Box";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { db } from "../../firebase.config";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";
import { setuser } from "../../redux/features/user";

export default function HorizontalNonLinearStepper(content) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [itemName, setItemName] = useState();
  const [itemDescription, setItemDescription] = useState(); // Stores the data in states

  let dispatch = useDispatch();
  let userdata = useSelector((state) => {
    return state["user"];
  });
  const user = userdata.colections.username;

  async function handleFinish() { 

    const userRef = doc(db, "Users", user);
    let path = "items." + content.content + ".todoItems." + itemName 
    await updateDoc(userRef, { // Creates a new list item 
      [path] :{
        itemdescription: itemDescription,
        date: selectedDate,
        finished: false,
        timeAdded: new Date()
        
      },
      
    });

    

    const docSnap = await getDoc(userRef);
    dispatch(setuser(docSnap.data())); // Updates user state in redux
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row">
        <TextField
          id="name"
          label="Name"
          onChange={(e) => {
            setItemName(e.target.value);
          }}
          sx={{width:"25%"}}
        />
        <TextField
          sx={{width:"35%"}}
          multiline
          id="description"
          label="Description"
          onChange={(e) => {
            setItemDescription(e.target.value);
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} >
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Deadline"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            
          />
        </LocalizationProvider>
        <Button
          onClick={() => {
            handleFinish();
          }}
          flexGrowth={1}
        >
          Create Item
        </Button>

        
      </Stack>
    </Box>
  );
}
