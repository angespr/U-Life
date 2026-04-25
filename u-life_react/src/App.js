import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/startup/Homepage";
import Login from "./components/startup/Login";
import Signup from "./components/startup/Signup";
import Dashboard from "./components/main parts/Dashboard";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;