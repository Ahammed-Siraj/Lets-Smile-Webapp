// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import smileclublogo from "../images/smileclublogo.png";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem("token");
//   const sector = localStorage.getItem("sector");
//   const unit = localStorage.getItem("unit");
//   const isAdmin = localStorage.getItem("isAdmin") === "true";

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("sector");
//     localStorage.removeItem("isAdmin");
//     localStorage.removeItem("userType");
//     localStorage.removeItem("unit");
//     localStorage.removeItem("isLogedIn");
//     navigate("/");
//   };

//   const linkStyle = (path) => ({
//     textDecoration: "none",
//     color: location.pathname === path ? "#74ebd5" : "inherit", // Highlight active link
//     fontWeight: location.pathname === path ? "bold" : "normal",
//   });

//   return (
//     <>
//       <nav
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "10px 20px",
//           background: "#0b6b5a",
//           boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//           position: "fixed", // 👈 keeps navbar always on top
//           top: 0,
//           left: 0,
//           width: "100%",
//           zIndex: 1000,
//         }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <img
//             src={smileclublogo}
//             alt="Smile Club Logo"
//             style={{ width: 50, height: 37 }}
//           />

//           <Link to="/" style={linkStyle("/")}>
//             Home
//           </Link>
//           {token && (
//             <Link to="/entry" style={linkStyle("/entry")}>
//               Entry
//             </Link>
//           )}
//           {token && (
//             <Link to="/view" style={linkStyle("/view")}>
//               View
//             </Link>
//           )}
//           {isAdmin && (
//             <Link to="/admin" style={linkStyle("/admin")}>
//               Admin
//             </Link>
//           )}
//         </div>
//         <div>
//           {token ? (
//             <>
//               <span style={{ marginRight: 12 }}>
//                 {localStorage.getItem("userType") === "unit" ? (
//                   <>
//                     Logged as: <strong>{unit}</strong>
//                   </>
//                 ) : (
//                   <>
//                     Logged as: <strong>{sector}</strong>
//                   </>
//                 )}
//               </span>
//               <button onClick={logout} className="secondary">
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link to="/login" style={linkStyle("/login")}>
//               Login
//             </Link>
//           )}
//         </div>
//       </nav>

//       {/* 👇 This adds space below the fixed navbar so content isn't hidden */}
//       <div style={{ height: "70px" }}></div>
//     </>
//   );
// }

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import smileclublogo from "../images/smileclublogo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const sector = localStorage.getItem("sector");
  const unit = localStorage.getItem("unit");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#74ebd5" : "#ffffff",
    fontWeight: location.pathname === path ? "bold" : "normal",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background 0.3s ease",
  });

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: "#0b6b5a",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          zIndex: 1000,
          flexWrap: "wrap",
        }}>
        {/* Left section */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={smileclublogo}
            alt="Smile Club Logo"
            style={{ width: 50, height: 37, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />

          {/* Desktop Links — hidden when menuOpen = true */}
          <div
            className="nav-links"
            style={{
              display: menuOpen ? "none" : "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}>
            <Link to="/" style={linkStyle("/")}>
              Home
            </Link>
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
            {isAdmin && (
              <Link to="/admin" style={linkStyle("/admin")}>
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div
          className="nav-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
          {token ? (
            <>
              <span
                style={{
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                }}>
                User:{" "}
                <strong>
                  {localStorage.getItem("userType") === "unit" ? unit : sector}
                </strong>
              </span>
              <div
                className="nav-links"
                style={{
                  display: menuOpen ? "none" : "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}>
                <button
                  onClick={logout}
                  style={{
                    background: "#74ebd5",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    color: "#0b6b5a",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div
              className="nav-links"
              style={{
                display: menuOpen ? "none" : "flex",
                flexWrap: "wrap",
              }}>
              <Link to="/login" style={linkStyle("/login")}>
                Login
              </Link>
            </div>
          )}

          {/* Hamburger Menu for Mobile */}
          <div
            className="menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: "1.7rem",
            }}>
            {menuOpen ? "✕" : "☰"}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="mobile-menu"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              background: "#0b6b5a",
              padding: "10px 0",
              marginTop: "10px",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center",
              animation: "slideDown 0.3s ease-in-out",
            }}>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              style={linkStyle("/")}>
              Home
            </Link>
            {token && (
              <Link
                to="/entry"
                onClick={() => setMenuOpen(false)}
                style={linkStyle("/entry")}>
                Entry
              </Link>
            )}
            {token && (
              <Link
                to="/view"
                onClick={() => setMenuOpen(false)}
                style={linkStyle("/view")}>
                View
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                style={linkStyle("/admin")}>
                Admin
              </Link>
            )}
            {token ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                style={{
                  background: "#74ebd5",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  color: "#0b6b5a",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                  alignSelf: "center",
                }}>
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={linkStyle("/login")}>
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Space below navbar */}
      <div style={{ height: "70px" }}></div>

      <style>
        {`
          @media (max-width: 768px) {
            .nav-links {
              display: none !important;
            }
            .menu-icon {
              display: block !important;
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
}

