import React from "react";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* <p>Powered By: MANJESHWAR DIVISION IT TEAM</p> */}
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
        </div>
      </div>
    </footer>
  );
}
