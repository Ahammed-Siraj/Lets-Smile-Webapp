import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, authHeader } from "../api";
import { unitList } from "../constants/datalist";
import Swal from "sweetalert2";

export default function EntryPage() {
  const [sector, setSector] = useState("");
  const [unit, setUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    school: "",
    age: "",
    fatherName: "",
    number: "",
  });

  useEffect(() => {
    const loggedSector = localStorage.getItem("sector");
    if (loggedSector) setSector(loggedSector);
  }, []);
  useEffect(() => {
    const loggedUnit = localStorage.getItem("unit");
    if (loggedUnit) setUnit(loggedUnit);
  }, []);
  // Helper function (place this above or outside your component)
  function getOrdinalSuffix(n) {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // prevent multiple clicks
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const headers = authHeader();
      const payload = { ...formData, sector, unit };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/form/${editingId}`, payload, {
          headers,
        });
        Swal.fire("Updated!", "Record updated successfully.", "success");
      } else {
        await axios.post(`${API_BASE_URL}/form`, payload, { headers });
        Swal.fire("Saved!", "Record added successfully.", "success");
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
      Swal.fire("error!", err.response?.data?.message, "Error");
      // alert(err.response?.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
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
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        color: "#333",
        maxWidth: "1000px",
        width: "auto",
      }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "500",
          marginBottom: "10px",
          color: "#0b6b5a",
        }}>
        📝 Let’s Get Started
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #ACB6E5 0%, #74ebd5 100%)",
          padding: "10px 10px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          color: "#333",
          maxWidth: "1000px",
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
              <option value="">Select Sector</option>
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
            placeholder="Enter Name"
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
            placeholder="Enter School Name"
            value={formData.school}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <strong>Class</strong>
          </label>
          <select
            name="className"
            value={formData.className}
            onChange={handleChange}
            required>
            <option value="">Select Class</option>
            {[...Array(10)].map((_, i) => {
              const classLabel = `${i + 1}${getOrdinalSuffix(i + 1)} Std`;
              return (
                <option key={classLabel} value={classLabel}>
                  {classLabel}
                </option>
              );
            })}
          </select>
        </div>
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
            placeholder="Enter Father Name"
            onChange={(e) => {
              const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
              setFormData((prev) => ({ ...prev, fatherName: lettersOnly }));
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <strong>Contact</strong>
          </label>
          <input
            name="number"
            value={formData.number}
            onChange={handleChange}
            type="tel"
            pattern="[0-9]{10}"
            minLength="10"
            maxLength="10"
            required
            placeholder="Enter 10-digit number"
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
            disabled={isSubmitting}
            style={{
              borderRadius: "8px", // ✅ Correct property
              padding: "10px 20px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              backgroundColor: isSubmitting ? "#999" : "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}>
            {isSubmitting ? "Please wait..." : editingId ? "UPDATE" : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}

