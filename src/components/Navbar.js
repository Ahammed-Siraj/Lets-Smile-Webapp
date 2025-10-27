// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import smileclublogo from "../images/smileclublogo.png";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem("token");
//   const sector = localStorage.getItem("sector");
//   const unit = localStorage.getItem("unit");
//   const isAdmin = localStorage.getItem("isAdmin") === "true";

//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const linkStyle = (path) => ({
//     textDecoration: "none",
//     color: location.pathname === path ? "#74ebd5" : "#ffffff",
//     fontWeight: location.pathname === path ? "bold" : "normal",
//     padding: "8px 12px",
//     borderRadius: "5px",
//     transition: "background 0.3s ease",
//   });

//   return (
//     <>
//       <nav
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           background: "#0b6b5a",
//           color: "#fff",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "10px 20px",
//           boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//           zIndex: 1000,
//           flexWrap: "wrap",
//         }}>
//         {/* Left section */}
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <img
//             src={smileclublogo}
//             alt="Smile Club Logo"
//             style={{ width: 50, height: 37, cursor: "pointer" }}
//             onClick={() => navigate("/")}
//           />

//           {/* Desktop Links — hidden when menuOpen = true */}
//           <div
//             className="nav-links"
//             style={{
//               display: menuOpen ? "none" : "flex",
//               gap: "15px",
//               flexWrap: "wrap",
//             }}>
//             <Link to="/" style={linkStyle("/")}>
//               Home
//             </Link>
//             {token && (
//               <Link to="/entry" style={linkStyle("/entry")}>
//                 Entry
//               </Link>
//             )}
//             {token && (
//               <Link to="/view" style={linkStyle("/view")}>
//                 View
//               </Link>
//             )}
//             {isAdmin && (
//               <Link to="/admin" style={linkStyle("/admin")}>
//                 Admin
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* Right Section */}
//         <div
//           className="nav-right"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//           }}>
//           {token ? (
//             <>
//               <span
//                 style={{
//                   fontSize: "0.9rem",
//                   whiteSpace: "nowrap",
//                 }}>
//                 User:{" "}
//                 <strong>
//                   {localStorage.getItem("userType") === "unit" ? unit : sector}
//                 </strong>
//               </span>
//               <div
//                 className="nav-links"
//                 style={{
//                   display: menuOpen ? "none" : "flex",
//                   gap: "15px",
//                   flexWrap: "wrap",
//                 }}>
//                 <button
//                   onClick={logout}
//                   style={{
//                     background: "#74ebd5",
//                     border: "none",
//                     padding: "8px 12px",
//                     borderRadius: "5px",
//                     color: "#0b6b5a",
//                     fontWeight: "bold",
//                     cursor: "pointer",
//                   }}>
//                   Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div
//               className="nav-links"
//               style={{
//                 display: menuOpen ? "none" : "flex",
//                 flexWrap: "wrap",
//               }}>
//               <Link to="/login" style={linkStyle("/login")}>
//                 Login
//               </Link>
//             </div>
//           )}

//           {/* Hamburger Menu for Mobile */}
//           <div
//             className="menu-icon"
//             onClick={() => setMenuOpen(!menuOpen)}
//             style={{
//               display: "none",
//               cursor: "pointer",
//               color: "#fff",
//               fontSize: "1.7rem",
//             }}>
//             {menuOpen ? "✕" : "☰"}
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {menuOpen && (
//           <div
//             className="mobile-menu"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               width: "100%",
//               background: "#0b6b5a",
//               padding: "10px 0",
//               marginTop: "10px",
//               borderTop: "1px solid rgba(255,255,255,0.2)",
//               textAlign: "center",
//               animation: "slideDown 0.3s ease-in-out",
//             }}>
//             <Link
//               to="/"
//               onClick={() => setMenuOpen(false)}
//               style={linkStyle("/")}>
//               Home
//             </Link>
//             {token && (
//               <Link
//                 to="/entry"
//                 onClick={() => setMenuOpen(false)}
//                 style={linkStyle("/entry")}>
//                 Entry
//               </Link>
//             )}
//             {token && (
//               <Link
//                 to="/view"
//                 onClick={() => setMenuOpen(false)}
//                 style={linkStyle("/view")}>
//                 View
//               </Link>
//             )}
//             {isAdmin && (
//               <Link
//                 to="/admin"
//                 onClick={() => setMenuOpen(false)}
//                 style={linkStyle("/admin")}>
//                 Admin
//               </Link>
//             )}
//             {token ? (
//               <button
//                 onClick={() => {
//                   logout();
//                   setMenuOpen(false);
//                 }}
//                 style={{
//                   background: "#74ebd5",
//                   border: "none",
//                   padding: "8px 12px",
//                   borderRadius: "5px",
//                   color: "#0b6b5a",
//                   fontWeight: "bold",
//                   cursor: "pointer",
//                   marginTop: "10px",
//                   alignSelf: "center",
//                 }}>
//                 Logout
//               </button>
//             ) : (
//               <Link
//                 to="/login"
//                 onClick={() => setMenuOpen(false)}
//                 style={linkStyle("/login")}>
//                 Login
//               </Link>
//             )}
//           </div>
//         )}
//       </nav>

//       {/* Space below navbar */}
//       <div style={{ height: "70px" }}></div>

//       <style>
//         {`
//           @media (max-width: 768px) {
//             .nav-links {
//               display: none !important;
//             }
//             .menu-icon {
//               display: block !important;
//             }
//           }

//           @keyframes slideDown {
//             from {
//               opacity: 0;
//               transform: translateY(-10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>
//     </>
//   );
// }

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import smileclublogo from "../images/smileclublogo.png";

export default function Navbar() {
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
    background: location.pathname === path ? "#74ebd5" : "transparent",
    color: location.pathname === path ? "#0b6b5a" : "#0b6b5a",
    fontWeight: location.pathname === path ? "bold" : "normal",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "2px solid #74ebd5",
    transition: "all 0.3s ease",
  });

  return (
    <>
      {/* Fixed Top Navbar */}
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
                {localStorage.getItem("userType") === "unit" ? unit : sector}
              </strong>
            </span>
          )}
          {token ? (
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
          ) : (
            <Link to="/login" style={{ ...linkStyle("/login"), color: "#fff" }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Space below navbar */}
      <div style={{ height: "70px" }}></div>

      {/* Second nav: hide when on home page */}
      {location.pathname !== "/" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            padding: "15px",
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
          {isAdmin && (
            <Link to="/admin" style={linkStyle("/admin")}>
              Admin
            </Link>
          )}
        </div>
      )}
    </>
  );
}
