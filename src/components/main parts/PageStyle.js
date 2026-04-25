import React from "react";
import Navbar from "./Navbar";
import "../styles/pages/PageStyle.css";

export default function PageStyle({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">{children}</main>
    </div>
  );
}