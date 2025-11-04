// import React from "react";
// import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";

// export default function Footer() {
//   const division = localStorage.getItem("division") || "Division";

//   return (
//     <footer
//       style={{
//         background: "linear-gradient(135deg, #0b6b5a, #0e8270)",
//         color: "white",
//         textAlign: "center",
//         padding: "20px 10px",
//         marginTop: "auto",
//         fontFamily: "Poppins, sans-serif",
//       }}>
//       <div style={{ marginBottom: "6px", fontWeight: "600" }}>
//         © {new Date().getFullYear()} Let's Smile Club • SSF {division}
//       </div>

//       <div style={{ fontSize: "0.9em", opacity: "0.85" }}>
//         Powered by <strong>{division} IT Team</strong>
//       </div>

//       <div
//         style={{
//           marginTop: "10px",
//           display: "flex",
//           justifyContent: "center",
//           gap: "15px",
//         }}>
//         <a
//           href="https://wa.me/919876543210"
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "white" }}>
//           <FaWhatsapp size={20} />
//         </a>
//         <a
//           href="https://instagram.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "white" }}>
//           <FaInstagram size={20} />
//         </a>
//         <a
//           href="https://smile-manjeshwar.vercel.app"
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "white" }}>
//           <FaGlobe size={20} />
//         </a>
//       </div>
//     </footer>
//   );
// }
import React from "react";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Powered By: MANJESHWAR DIVISION IT TEAM</p>
        <p>© 2025 Let's Smile Club — SSF Manjeshwar</p>
        <div className="footer-icons">
          <a
            href="https://wa.me/919567323471"
            target="_blank"
            rel="noopener noreferrer">
            <FaWhatsapp />
          </a>
          <a
            href="https://www.instagram.com/ssf_mjrdvsn?igsh=bW45dzZ1N2hpeWxh"
            target="_blank"
            rel="noopener noreferrer">
            <FaInstagram />
          </a>
          {/* <a
            href="https://ssfmanjeshwar.in"
            target="_blank"
            rel="noopener noreferrer">
            <FaGlobe />
          </a> */}
        </div>
      </div>
    </footer>
  );
}
