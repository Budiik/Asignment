import { createSlice } from "@reduxjs/toolkit"

const initState = {
    colections: {}
} // initial data in our store


let userSlice = createSlice({
    name: "user",
    initialState: initState,
    reducers : {
        setuser: function (state,action){
            state.colections = action.payload
        }
    }
}) // creating a redux slice which is a combination of a reducer, a function that store works with the data, payload, passed, and an initial state 
export const {setuser} = userSlice.actions
export default userSlice.reducer