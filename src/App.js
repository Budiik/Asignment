import Header from "./Header/header"
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/login.js";
import SignUp from "./Pages/signup.js";
import Home from "./Pages/home.js"
import Loggedinuser from "./Pages/Userpage/loggedinuser";
import { useEffect, useState } from "react";
function App() {
  
  return (
    <div className="App">
      <Header></Header> {/* Appbar that will render no matter the route */}
      
        <Routes> {/* Individual routes to which you can navigate */}
          <Route path="*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<Loggedinuser />} />
      </Routes>
    
    </div>
  );
}

export default App;
