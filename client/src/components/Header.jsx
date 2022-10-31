import { NavLink } from "react-router-dom";

import React from "react";

const Header = () => {
  return (
    <div className="header">
      <h1>File Upload And Download</h1>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/list"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Files List
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;
