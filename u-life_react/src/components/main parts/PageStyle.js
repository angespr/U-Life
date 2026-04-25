import React from "react";
import Navbar from "./Navbar";
import "../styles/pages/PageStyle.css";

// helps contain navbar across all pages user is on
function PageStyle({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-container">
        {children}
      </div>
    </>
  );
}

export default PageStyle;