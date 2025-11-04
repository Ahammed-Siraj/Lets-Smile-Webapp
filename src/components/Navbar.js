import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import smileclublogo from "../images/smileclublogo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const sector = localStorage.getItem("sector");
  const unit = localStorage.getItem("unit");
  const division = localStorage.getItem("division");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    background: location.pathname === path ? "#f7f7f8" : "transparent",
    color: location.pathname === path ? "#0b6b5a" : "#74ebd5",
    fontWeight: location.pathname === path ? "bold" : "normal",
    padding: "5px 20px",
    marginTop: "3px",
    borderRadius: "5px 5px 0 0",
    transition: "all 0.3s ease",
  });

  // fixed heights (for spacing calculation)
  const mainNavHeight = 60;
  const secondNavHeight = 40;

  return (
    <>
      {/* Fixed Top Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: `${mainNavHeight}px`,
          background: "#0b6b5a",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px,10px,0pc,10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          zIndex: 1000,
          flexWrap: "wrap",
        }}>
        {/* Left Section - Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={smileclublogo}
            alt="Smile Club Logo"
            style={{ width: 50, height: 37, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </div>

        {/* Right Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}>
          {token && (
            <span style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>
              User:{" "}
              <strong>
                {/* {localStorage.getItem("userType") === "unit" ? unit : sector} */}
                {localStorage.getItem("userType") === "unit"
                  ? unit
                  : localStorage.getItem("userType") === "sector"
                  ? sector
                  : division}
              </strong>
            </span>
          )}
          {token && (
            <button
              onClick={logout}
              style={{
                background: "#74ebd5",
                border: "none",
                padding: "6px 8px",
                borderRadius: "5px",
                color: "#0b6b5a",
                fontWeight: "bold",
                cursor: "pointer",
              }}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Second navbar — fixed directly below first */}
      {location.pathname !== "/" && (
        <div
          style={{
            position: "fixed",
            top: `${mainNavHeight}px`, // directly below first nav
            left: 0,
            width: "100%",
            height: `${secondNavHeight}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "down",
            flexWrap: "wrap",
            backgroundColor: "#0b6b5a",
            gap: "10px",
            zIndex: 999,
          }}>
          {!token && (
            <Link to="/" style={linkStyle("/")}>
              Home
            </Link>
          )}

          {token && (
            <Link to="/entry" style={linkStyle("/entry")}>
              Entry
            </Link>
          )}
          {token && (
            <Link to="/view" style={linkStyle("/view")}>
              View
            </Link>
          )}
        </div>
      )}

      {/* Push content below both navs */}
      <div
        style={{
          height:
            location.pathname !== "/"
              ? `${mainNavHeight + secondNavHeight}px`
              : `${mainNavHeight}px`,
        }}></div>
    </>
  );
}

