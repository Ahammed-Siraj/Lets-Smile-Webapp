import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";
import { divisionList, sectorList, unitList } from "../constants/datalist";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Add this import at the top

export default function LoginPage() {
  const [division, setDivision] = useState("");
  const [sector, setSector] = useState("");
  const [unit, setUnit] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🧠 Prepare login payload based on user type
      let payload = {};

      if (userType === "unit") {
        payload = { type: "unit", name: unit, password };
      } else if (userType === "sector") {
        payload = { type: "sector", name: sector, password };
      } else if (userType === "division") {
        payload = { type: "division", name: division, password };
      } else if (userType === "admin") {
        payload = { type: "admin", name: "admin", password };
      }

      const res = await axios.post(`${API_BASE_URL}/login`, payload);

      // 🧩 Save credentials
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("division", division || "");
      localStorage.setItem("sector", sector || "");
      localStorage.setItem("unit", unit || "");
      localStorage.setItem("isLogedIn", "true");

      // 🧭 Navigation based on user type

      navigate("/entry");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Login failed";
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        color: "#333",
        maxWidth: "900px",
        margin: "20px auto",
      }}>
      <h2 className="mb-3">
        <strong>Login</strong>
      </h2>

      <p style={{ textAlign: "center", fontSize: "16px" }}>
        Password same as <br />
        <a
          href="https://portal.ssfkerala.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0066cc",
            fontWeight: "bold",
            textDecoration: "underline",
          }}>
          portal.ssfkerala.org
        </a>
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "400px",
          textAlign: "left",
          background: "linear-gradient(135deg, #ACB6E5 0%, #74ebd5 100%)",
          padding: "20px",
          borderRadius: "10px",
        }}>
        {/* 🔹 Division (Only for Division Login) */}
        {userType === "division" && (
          <div className="form-group mb-3">
            <label>
              <strong>Division</strong>
            </label>
            <select
              className="form-control"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              required>
              <option value="">Select Division</option>
              {divisionList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🔹 Sector (For Sector & Unit Logins) */}
        {(userType === "sector" || userType === "unit") && (
          <div className="form-group mb-3">
            <label>
              <strong>Sector</strong>
            </label>
            <select
              className="form-control"
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setUnit("");
              }}
              required>
              <option value="">Select Sector</option>
              {sectorList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🔹 Unit (Only for Unit Login) */}
        {userType === "unit" && (
          <div className="form-group mb-3">
            <label>
              <strong>Unit</strong>
            </label>
            <select
              className="form-control"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required>
              <option value="">Select Unit</option>
              {sector &&
                unitList[sector]?.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
            </select>
          </div>
        )}

      
        {/* 🔒 Password with Toggle */}
        <div className="form-group mb-3" style={{ position: "relative" }}>
          <label>
            <strong>Password</strong>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: "35px" }} // space for the icon
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "70%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#0b6b5a",
              fontSize: "1.1rem",
            }}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* 🚀 Submit Button */}
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
          style={{
            borderRadius: "8px",
            background: "#0b6b5a",
            border: "none",
            padding: "10px 0",
            fontSize: "1rem",
            fontWeight: "500",
          }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Responsive CSS */}
      <style>
        {`
          @media (max-width: 768px) {
            .login-container {
              width: 90%;
              padding: 20px;
              margin-top: 20px;
            }
            form {
              width: 100%;
            }
            h2 {
              font-size: 1.5rem !important;
            }
            p {
              font-size: 0.95rem !important;
            }
          }

          @media (max-width: 480px) {
            .login-container {
              width: 95%;
              padding: 15px;
            }
            h2 {
              font-size: 1.3rem !important;
            }
            .form-control {
              font-size: 0.9rem;
              padding: 8px;
            }
            button {
              font-size: 0.95rem;
              padding: 8px 0;
            }
          }
        `}
      </style>
    </div>
  );
}

