import React from "react";
import { Link } from "react-router-dom";
import smileclublogo from "../images/smileclublogo.png";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function HomePage() {
  const isLogedIn = JSON.parse(localStorage.getItem("isLogedIn"));

  if (isLogedIn) {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: "Logout to go home?",
      confirmButtonText: "Okay",
    });
    return <Navigate to="/entry" />;
  }

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        color: "#333",
        maxWidth: "900px",
        margin: "20px auto",
      }}>
      <div
        className="banner"
        style={{
          height: "auto",
          padding: 20,
          borderRadius: "10px",
        }}>
        <div className="banner-content" style={{ height: "auto" }}>
          <div className="logo-section">
            <img
              src={smileclublogo}
              alt="Smile Club Logo"
              className="logo-img"
              style={{ borderRadius: 15, marginTop: 10 }}
            />
          </div>
          <div className="welcome-section">
            <h1
              style={{
                fontSize: "2rem",
                lineHeight: "1.2",
                marginBottom: "15px",
              }}>
              Welcome to Smile Club
            </h1>
            <div className="tagline">Building Bright Futures Together</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              color: "#333",
              maxWidth: "900px",
              margin: "20px auto",
            }}>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: "400",
                color: "#34495E",
                maxWidth: "600px",
                lineHeight: "1.5",
              }}>
              Sign up today and start your journey to making a positive impact.
              <br />
              <strong>Let’s Smile Kerala</strong>
              <br />
              is more than a community—it’s a movement of growth with kindness
              and togetherness. 🌿
            </p>
          </div>

          {/* Buttons Section */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
            }}>
            {/* style={{ display: "none" }} */}
            <Link to="/login">
              <button
                style={{
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "1rem",
                  border: "none",
                  background: "#0b6b5a",
                  color: "white",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onClick={() => {
                  localStorage.setItem("userType", "division");
                }}
                onMouseOver={(e) => (e.target.style.background = "#128a70")}
                onMouseOut={(e) => (e.target.style.background = "#0b6b5a")}>
                DIVISION
              </button>
            </Link>
            <Link to="/login">
              <button
                style={{
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "1rem",
                  border: "none",
                  background: "#0b6b5a",
                  color: "white",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onClick={() => {
                  localStorage.setItem("userType", "sector");
                }}
                onMouseOver={(e) => (e.target.style.background = "#128a70")}
                onMouseOut={(e) => (e.target.style.background = "#0b6b5a")}>
                SECTOR
              </button>
            </Link>
            <Link to="/login">
              <button
                style={{
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "1rem",
                  border: "none",
                  background: "#0b6b5a",
                  color: "white",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onClick={() => {
                  localStorage.setItem("userType", "unit");
                }}
                onMouseOver={(e) => (e.target.style.background = "#128a70")}
                onMouseOut={(e) => (e.target.style.background = "#0b6b5a")}>
                UNIT
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>
        {`
        .logo-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo-img {
          width: auto;
          height: auto;
          padding: 10px;         
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
          animation: floatGlowColor 5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% {
             transform: translateY(0px);
           }
           50% {
             transform: translateY(-10px);
           }
        }
        @keyframes floatRotate {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }
        @keyframes floatSideways {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(5px, -5px);
          }
          50% {
            transform: translate(0, -10px);
          }
          75% {
            transform: translate(-5px, -5px);
          }
        }
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
          }
        }
        @keyframes colorShift {
  0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }
        @keyframes floatScale {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }

         .welcome-section {
           text-align: center;
           margin-bottom: 10px;
         }
         .tagline {
           font-size: 1rem;
           color: #6b7280;
           font-weight: 400;
           font-style: italic;
         }

          @media (max-width: 768px) {
            .container {
              padding: 15px;
            }
            h1 {
              font-size: 1.6rem !important;
            }
            h2 {
              font-size: 1.2rem !important;
            }
            p {
              font-size: 1rem !important;
              padding: 0 10px;
            }
            button {
              width: 100%;
              max-width: 250px;
            }
          }
@keyframes floatGlowColor {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
   
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
  25% {
    transform: translateY(-5px) scale(1.03) rotate(2deg);
   
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
  50% {
    transform: translateY(-10px) scale(1.05) rotate(0deg);
    
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  }
  75% {
    transform: translateY(-5px) scale(1.03) rotate(-2deg);
    
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
}

.image {
  animation: floatGlowColor 5s ease-in-out infinite;
}

          @media (max-width: 480px) {
            h1 {
              font-size: 1.4rem !important;
            }
            h2 {
              font-size: 1.1rem !important;
            }
            p {
              font-size: 0.95rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}

