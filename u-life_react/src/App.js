import React, { useState } from "react";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Navbar from "./components/main parts/Navbar"

function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      
      <Navbar />

      <button onClick={() => setPage("login")}>Login</button>
      <button onClick={() => setPage("signup")}>Signup</button>

      {page === "login" ? (
        <Login goToSignup={() => setPage("signup")} />
      ) : (
        <Signup />
      )}


    </div>
  );
}

export default App;