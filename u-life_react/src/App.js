import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./components/startup/Homepage";
import Login from "./components/startup/Login";
import Signup from "./components/startup/Signup";
import Dashboard from "./components/main parts/Dashboard";
import Productivity from "./components/pages/Productivity";
import Opportunity from "./components/pages/Opportunity";
import Habits from "./components/pages/Habits";
import Finances from "./components/pages/Finances";
import Profile from "./components/pages/Profile";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/productivity" element={<ProtectedRoute><Productivity /></ProtectedRoute>} />
        <Route path="/opportunities" element={<ProtectedRoute><Opportunity /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/finances" element={<ProtectedRoute><Finances /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;