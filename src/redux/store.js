import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// Configurating a store using a root reducer we created
const store = configureStore({
    reducer : rootReducer
})
export default store