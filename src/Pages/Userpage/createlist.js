import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { TextField } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setuser } from "../../redux/features/user";
import { useSelector } from "react-redux";


import { db } from "../../firebase.config";
import { doc, updateDoc, arrayUnion, getDoc} from "firebase/firestore";

const steps = [
  {
    label: "Name.",
    description: `Give your list a name.`,
  },
  {
    label: "Description",
    description: "Give yourself more info about the list.",
  },
  {
    label: "Finish.",
    description: `Click Finish to finalize your list`,
  },
]; // Steps that will be shown in stepper 

export default function ListCreator() {
  const [name, setName] = useState();
  const [description, setDescription] = useState("");

  let dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }; // Renders next part of the stepper

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }; // Rendres previos part of the stepper 

  const handleReset = () => {
    setActiveStep(0);
  }; // Sets step to 0

  let userdata = useSelector((state) => {
    return state["user"];
  });
  const user = userdata.colections.username
  
  async function handleFinish(values) { // Creates a new list 
    const userRef = doc(db, "Users", user); // gets the user ref
    let path = "items." + name 
    await updateDoc(userRef, { // Updates the items by adding a new one with the name, description and itemlist  
        [path]: {name: name, description: description, todoItems: {}} 
      });

    const docSnap = await getDoc(userRef);
    dispatch(setuser(docSnap.data())) 
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography>
        Create new list:
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              {index == 0 ? (
                <TextField
                  label="Name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                ></TextField>
              ) : index == 1 ? (
                <TextField
                  label="Description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                ></TextField>
              ) : (
                ""
              )}

              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={
                      index === steps.length - 1 ? handleFinish : handleNext
                    }
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
