import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, authHeader } from "../api";
import { unitList } from "../constants/datalist";

export default function EntryPage() {
  const [sector, setSector] = useState("");
  const [unit, setUnit] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    school: "",
    age: "",
    fatherName: "",
    number: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loggedSector = localStorage.getItem("sector");
    if (loggedSector) setSector(loggedSector);
  }, []);
  useEffect(() => {
    const loggedUnit = localStorage.getItem("unit");
    if (loggedUnit) setUnit(loggedUnit);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = authHeader();
      const payload = { ...formData, sector, unit };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/form/${editingId}`, payload, {
          headers,
        });
        alert("Updated");
      } else {
        await axios.post(`${API_BASE_URL}/form`, payload, { headers });
        alert("Saved");
      }
      setFormData({
        name: "",
        className: "",
        school: "",
        age: "",
        fatherName: "",
        number: "",
      });
      setUnit(localStorage.getItem("unit") || "");
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        color: "#333",
        maxWidth: "1000px",
      }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "500",
          marginBottom: "20px",
          color: "#0b6b5a",
        }}>
        📝 Let’s Get Started
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
          padding: "20px 20px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          color: "#333",
          maxWidth: "1000px",
          margin: "10px",
        }}>
        <div className="form-group">
          <label>
            <strong>Sector</strong>
          </label>
          {localStorage.getItem("userType") === "sector" ||
          localStorage.getItem("userType") === "unit" ? (
            <input value={sector} readOnly />
          ) : (
            <select
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setUnit("");
              }}>
              <option value="">All Sectors</option>
              {Object.keys(unitList).map((sec) => (
                <option key={sec}>{sec}</option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>
            <strong>Unit</strong>
          </label>
          {localStorage.getItem("userType") === "unit" ? (
            <input value={unit} readOnly />
          ) : (
            <select
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
          )}
        </div>
        <div className="form-group">
          <label>
            <strong>Name</strong>
          </label>
          <input
            name="name"
            value={formData.name}
            required
            onChange={(e) => {
              const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
              setFormData((prev) => ({ ...prev, name: lettersOnly }));
            }}
          />
        </div>
        <div className="form-group">
          <label>
            <strong>School Name</strong>
          </label>
          <input
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <strong>Class</strong>
          </label>
          <input
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div className="form-group">
          <label>
            <strong>Age</strong>
          </label>
          <input
            name="age"
            value={formData.age}
            type="number"
            onChange={handleChange}
            required
          />
        </div> */}
        <div className="form-group">
          <label>
            <strong>Age</strong>
          </label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            required>
            <option value="">Select Age</option>
            {[...Array(8)].map((_, i) => {
              const age = i + 7;
              return (
                <option key={age} value={age}>
                  {age}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label>
            <strong>Father Name</strong>
          </label>
          <input
            name="fatherName"
            value={formData.fatherName}
            onChange={(e) => {
              const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
              setFormData((prev) => ({ ...prev, fatherName: lettersOnly }));
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <strong>Number</strong>
          </label>
          <input
            name="number"
            value={formData.number}
            onChange={handleChange}
            type="number"
            required
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}>
          <button
            type="submit"
            style={{
              borderRadius: "8px", // ✅ Correct property
              padding: "10px 20px",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}>
            {editingId ? "UPDATE" : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}

