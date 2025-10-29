import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, authHeader } from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitList } from "../constants/datalist";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import smileclublogo from "../images/smileclublogo.png";

export default function ViewPage() {
  const [records, setRecords] = useState([]);
  const [filterUnit, setFilterUnit] = useState("");
  const [filterName, setFilterName] = useState("");
  const sector = localStorage.getItem("sector") || ""; // ✅ fixed sector from login
  const unit = localStorage.getItem("unit") || ""; // ✅ fixed unit from login
  const userType = localStorage.getItem("userType"); // "sector" or "unit"
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // number of rows per page

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const headers = authHeader();
      const res = await axios.get(`${API_BASE_URL}/form`, { headers });
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) {
      Swal.fire("No record selected", "Please select a record first.", "info");
      return;
    }

    // Confirm delete
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/registration/${selectedRecord._id}`, {
        headers: authHeader(),
      });

      Swal.fire("Deleted!", "Record deleted successfully.", "success");

      // Refresh the table/list
      fetchRecords();

      // Clear selected record
      setSelectedRecord(null);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong while deleting.", "error");
    }
  };

  // 🧠 Apply filters (sector fixed)
  const filtered = records.filter((r) => {
    const matchUnit =
      userType === "unit"
        ? r.unit === unit
        : filterUnit
        ? r.unit === filterUnit
        : true;
    const matchSector = sector ? r.sector === sector : true;
    const matchName = filterName
      ? r.name.toLowerCase().includes(filterName.toLowerCase())
      : true;
    return matchSector && matchUnit && matchName;
  });
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  // 📄 Export filtered data to PDF

  const exportPDF = async () => {
    const logoWidth = 15;
    const logoHeight = 11;

    // Sort data by Unit → Name
    const sortedData = [...filtered].sort((a, b) => {
      if (a.unit === b.unit) return a.name.localeCompare(b.name);
      return a.unit.localeCompare(b.unit);
    });

    // Create A4 PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // === 🌈 Draw gradient header ===
    const gradientHeight = 16;
    const gradientSteps = 100; // smoother gradient
    for (let i = 0; i <= gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const r = 116 + ratio * (172 - 116); // interpolate R (74ebd5 → ACB6E5)
      const g = 235 + ratio * (182 - 235); // G
      const b = 213 + ratio * (229 - 213); // B
      doc.setFillColor(r, g, b);
      doc.rect(
        (pageWidth / gradientSteps) * i,
        0,
        pageWidth / gradientSteps,
        gradientHeight,
        "F"
      );
    }

    // === 🖼️ Logo ===
    try {
      doc.addImage(smileclublogo, "PNG", 10, 2.5, logoWidth, logoHeight);
    } catch (err) {
      console.warn("Logo not found or failed to load:", err);
    }

    // === 🧾 Title + Date ===
    const title = `Let's Smile Registrations - ${sector}${
      filterUnit ? ` / ${filterUnit}` : ""
    }`;
    const date = new Date().toLocaleString();

    doc.setFontSize(14);
    doc.setTextColor(11, 107, 90);
    doc.text(title, logoWidth + 22, (logoHeight + 10) / 2);

    doc.setFontSize(10);
    doc.setTextColor(70);
    doc.text(`Generated on: ${date}`, 14, gradientHeight + 8);

    // === 📋 Table with clickable phone numbers ===
    // const tableBody = sortedData.map((i, index) => [
    //   index + 1,
    //   i.sector,
    //   i.unit,
    //   i.name,
    //   i.className,
    //   i.school,
    //   i.age,
    //   i.fatherName,
    //   { content: i.number, link: `tel:${i.number}` },
    // ]);
    // Determine if the user is logged in as a specific sector
    const isSectorUser = localStorage.getItem("sector"); // or check localStorage if stored there

    // Define table head dynamically
    const tableHead = isSectorUser
      ? [["No", "Unit", "Name", "Class", "School", "Age", "Father", "Number"]]
      : [
          [
            "No",
            "Sector",
            "Unit",
            "Name",
            "Class",
            "School",
            "Age",
            "Father",
            "Number",
          ],
        ];

    // Define table body dynamically
    const tableBody = sortedData.map((i, index) =>
      isSectorUser
        ? [
            index + 1,
            i.unit,
            i.name,
            i.className,
            i.school,
            i.age,
            i.fatherName,
            { content: i.number, link: `tel:${i.number}` },
          ]
        : [
            index + 1,
            i.sector,
            i.unit,
            i.name,
            i.className,
            i.school,
            i.age,
            i.fatherName,
            { content: i.number, link: `tel:${i.number}` },
          ]
    );

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: gradientHeight + 12,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: {
        fillColor: [11, 107, 90],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 255, 255] },
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
          `Page ${pageCount}`,
          data.settings.margin.left,
          pageHeight - 10
        );
      },
    });

    // === 💾 Save PDF ===
    //doc.save(`Let's Smile_${sector}.pdf`);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  // 📊 Show unit count for the selected sector only + WhatsApp share
  //   const showUnitCounts = () => {
  //     // Filter records for selected/fixed sector
  //     const sectorRecords = sector
  //       ? records.filter((r) => r.sector === sector)
  //       : records;

  //     // Group by unit
  //     const counts = sectorRecords.reduce((acc, curr) => {
  //       if (!acc[curr.unit]) acc[curr.unit] = 0;
  //       acc[curr.unit]++;
  //       return acc;
  //     }, {});

  //     // Create text summary

  //     const selectedUnits = unitList[sector] || []; // fallback to empty array if not found

  //     const messageText = selectedUnits
  //       .map((unit) => ({
  //         unit,
  //         count: counts[unit] || 0,
  //       }))
  //       .sort((a, b) => b.count - a.count)
  //       .map(({ unit, count }) => `*#* ${unit} ---: *${count}*`)
  //       .join("\n");

  //     const shareText = `\`\`\`⭐ SMILE Friends List ⭐\`\`\`
  // 📋 *UNIT STATUS*
  // ────────────────
  // ${messageText}
  // ────────────────
  // 🏘️ *SSF* ${sector || "All Sectors"} Sector
  // 💬 © Smile Club`;

  //     const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  //     // HTML formatted for SweetAlert popup
  //     const messageHTML = Object.entries(counts)
  //       .map(([unit, count]) => `${unit}: ${count}`)
  //       .join("<br>");

  //     Swal.fire({
  //       title: `📊 Unit Status ${sector ? ` (${sector} Sector)` : ""}`,
  //       html:
  //         (messageHTML || "No records found for this sector.") +
  //         `<br><br><a href="${whatsappLink}" target="_blank"
  //           style="
  //             display:inline-block;
  //             padding:8px 16px;
  //             background-color:#25D366;
  //             color:white;
  //             border-radius:8px;
  //             text-decoration:none;
  //             font-weight:600;
  //           ">
  //           📲 Share on WhatsApp
  //         </a>`,
  //       icon: "info",
  //       confirmButtonText: "Close",
  //       confirmButtonColor: "#0b6b5a",
  //     });
  //   };

  const showUnitCounts = () => {
    // Filter records for selected/fixed sector
    const sectorRecords = sector
      ? records.filter((r) => r.sector === sector)
      : records;

    // Group by unit
    const counts = sectorRecords.reduce((acc, curr) => {
      if (!acc[curr.unit]) acc[curr.unit] = 0;
      acc[curr.unit]++;
      return acc;
    }, {});

    // Get all units for this sector
    const selectedUnits = unitList[sector] || [];

    // Build and sort list
    const sortedUnits = selectedUnits
      .map((unit) => ({
        unit,
        count: counts[unit] || 0,
      }))
      .sort((a, b) => b.count - a.count);

    // WhatsApp message
    const messageText = sortedUnits
      .map(({ unit, count }) => `*⏺* ${unit} ---: *${count}*`)
      .join("\n");

    const shareText = `\`\`\`📃 SMILE Friends List ⭐\`\`\`
📊 *UNIT STATUS*
────────────────
${messageText}
────────────────
*SSF* ${sector || "All Sectors"} Sector
© Smile Club`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    // Stylish HTML for SweetAlert
    const messageHTML = `
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 5px;
      text-align: center;
      margin-top: 10px;
    ">
      ${sortedUnits
        .map(
          ({ unit, count }, idx) => `
          <div style="
            background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
            padding: 5px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            color: #0b6b5a;
            font-weight: semibold;
          ">
            <div style="font-size: 1.1em;">${unit}</div>
            <div style="font-size: 1.3em; font-weight: bold;">${count}</div>
          </div>
        `
        )
        .join("")}
    </div>
    <br>
    <a href="${whatsappLink}" target="_blank"
      style="
        display:inline-block;
        padding:10px 20px;
        background-color:#25D366;
        color:white;
        border-radius:8px;
        text-decoration:none;
        font-weight:600;
      ">
      📲 Share on WhatsApp
    </a>
  `;

    // Show SweetAlert
    Swal.fire({
      title: `📊 Unit Status ${sector ? ` (${sector} Sector)` : ""}`,
      html: messageHTML,
      icon: "info",
      width: "600px",
      confirmButtonText: "Close",
      confirmButtonColor: "#0b6b5a",
      background: "#f8fdfd",
    });
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
      }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "500",
          marginBottom: "10px",
          color: "#0b6b5a",
        }}>
        📋 SMILE Friends List
      </h2>

      {/* 🔍 Filter Section */}
      <div
        className="filter-card"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          color: "#333",
          maxWidth: "1000px",
        }}>
        {/* <h4>🔎 Filter Options</h4> */}

        <div className="filter-row">
          <div
            className="filter-card"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
              marginBottom: "10px",
            }}>
            <div className="form-group">
              <label>Sector</label>
              {localStorage.getItem("userType") === "admin" ? (
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
              ) : (
                <input value={sector} readOnly />
              )}
            </div>
            {/* Unit Filter */}
            <div className="filter-item">
              <label>Unit</label>
              {localStorage.getItem("userType") !== "unit" ? (
                <select
                  value={filterUnit}
                  onChange={(e) => setFilterUnit(e.target.value)}>
                  <option value="">All Units</option>
                  {sector &&
                    unitList[sector]?.map((u) => <option key={u}>{u}</option>)}
                </select>
              ) : (
                <input value={unit} readOnly />
              )}
            </div>

            {/* Name Filter */}
            <div className="filter-item">
              <label>Name</label>
              <input
                type="text"
                placeholder="Search by name"
                value={filterName}
                onChange={(e) => {
                  const lettersOnly = e.target.value.replace(
                    /[^a-zA-Z\s]/g,
                    ""
                  );
                  setFilterName(lettersOnly);
                }}
              />
            </div>
          </div>

          {/* Export Button */}
          <div
            className="filter-item"
            style={{
              alignSelf: "end",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              flexWrap: "wrap",
            }}>
            <button className="export-btn" onClick={exportPDF}>
              📄 Export PDF
            </button>

            {localStorage.getItem("userType") !== "unit" && (
              <button
                className="export-btn"
                style={{ background: "#0b6b5a" }}
                onClick={showUnitCounts}>
                📊 Unit Counts
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📊 Records Table */}
      <div
        className="records-table-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "10px",
          background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          color: "#333",
          maxWidth: "1000px",
        }}>
        <p
          style={{
            textAlign: "right",
            fontWeight: "600",
            color: "#0b6b5a",
            marginBottom: "10px",
          }}>
          Total Records: {filtered.length}
        </p>
        <table
          className="records-table"
          style={{
            background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            color: "#333",
            maxWidth: "1000px",
          }}>
          <thead>
            <tr>
              <th className="desktop-only">Sector</th>
              <th>Unit</th>
              <th>Name</th>
              <th>Age</th>
              <th>Class</th>
              <th className="desktop-only">School</th>
              <th className="desktop-only">Father</th>
              <th className="desktop-only">Number</th>
            </tr>
          </thead>
          {/* <tbody>
            {filtered.map((r) => (
              <tr
                key={r._id}
                className="table-row"
                onClick={() => setSelectedRecord(r)}
                style={{ cursor: "pointer" }}>
                <td className="desktop-only">{r.sector}</td>
                <td>{r.unit}</td>
                <td>{r.name}</td>
                <td>{r.age}</td>
                <td>{r.className}</td>
                <td className="desktop-only">{r.school}</td>
                <td className="desktop-only">{r.fatherName}</td>
                <td className="desktop-only">{r.number}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody> */}
          <tbody>
            {filtered
              .slice(
                (currentPage - 1) * recordsPerPage,
                currentPage * recordsPerPage
              )
              .map((r) => (
                <tr
                  key={r._id}
                  className="table-row"
                  onClick={() => setSelectedRecord(r)}
                  style={{ cursor: "pointer" }}>
                  <td className="desktop-only">{r.sector}</td>
                  <td>{r.unit}</td>
                  <td>{r.name}</td>
                  <td>{r.age}</td>
                  <td>{r.className}</td>
                  <td className="desktop-only">{r.school}</td>
                  <td className="desktop-only">{r.fatherName}</td>
                  <td className="desktop-only">{r.number}</td>
                </tr>
              ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "15px",
            gap: "8px",
          }}>
          <button
            className="export-btn"
            style={{
              background: "#0b6b5a",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}>
            ◀ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                background: currentPage === i + 1 ? "#007bff" : "#74ebd5",
                color: currentPage === i + 1 ? "white" : "#0b6b5a",
                border: "none",
                borderRadius: "8px",
                padding: "6px 10px",
                fontWeight: "600",
                cursor: "pointer",
              }}>
              {i + 1}
            </button>
          ))}

          <button
            className="export-btn"
            style={{
              background: "#0b6b5a",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}>
            Next ▶
          </button>
        </div>
      </div>

      {/* Modal for Record Details */}

      <Modal
        show={!!selectedRecord}
        onHide={() => setSelectedRecord(null)}
        centered
        size="2sm"
        backdrop="static">
        {/* HEADER */}
        <Modal.Header
          className="d-flex justify-content-center"
          style={{
            backgroundColor: "#0b6b5a", // Deep blue header
            color: "white",
            borderBottom: "none",
          }}>
          <Modal.Title>Registration Details</Modal.Title>
        </Modal.Header>

        {/* BODY */}
        <Modal.Body
          style={{
            background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)", // Light pastel background
            color: "#333",
            padding: "20px",
            fontSize: "16px",
          }}>
          {selectedRecord && (
            <div className="p-2">
              <div className="record-details">
                <div className="detail-row">
                  <span className="label fw-bold">Sector:</span>{" "}
                  <span className="value">{selectedRecord.sector}</span>
                </div>
                <div className="detail-row">
                  <span className="label fw-bold">Unit:</span>{" "}
                  <span className="value">{selectedRecord.unit}</span>
                </div>
                <div className="detail-row">
                  <span className="label fw-bold">Name:</span>{" "}
                  <span className="value">{selectedRecord.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label fw-bold">Class:</span>{" "}
                  <span className="value">{selectedRecord.className}</span>
                </div>
                <div className="detail-row">
                  <span className="label fw-bold">School:</span>{" "}
                  <span className="value">{selectedRecord.school}</span>
                </div>
                <div className="detail-row">
                  <span className="label fw-bold">Age:</span>{" "}
                  <span className="value">{selectedRecord.age}</span>
                </div>
                <div className="detail-row">
                  <span className="label fw-bold">Father:</span>{" "}
                  <span className="value">{selectedRecord.fatherName}</span>
                </div>
                <div className="detail-row">
                  <span className="label fw-bold">Number:</span>{" "}
                  <span className="value">{selectedRecord.number}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer
          className="d-flex justify-content-center"
          style={{ backgroundColor: "#f0f8ff", borderTop: "none" }}>
          <Button
            style={{
              backgroundColor: "#0b6b5a", // Custom blue button
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontWeight: "500",
            }}
            onClick={() => setSelectedRecord(null)}>
            Close
          </Button>

          <Button
            style={{
              backgroundColor: "#e63946",
              border: "none",
              borderRadius: "8px",
              display: "none",
              padding: "8px 18px",
              fontWeight: "500",
              color: "white",
            }}
            disabled={!selectedRecord}
            onClick={handleDelete}>
            Delete
          </Button>

          <Button
            style={{
              backgroundColor: "#0b6b5a", // Custom blue button
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontWeight: "500",
              display: "none",
            }}
            onClick={() => setSelectedRecord(null)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 💅 Inline Styles */}
      <style jsx>{`
        .filter-card {
          background: #f9fafc;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }
        .record-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 15px;
          flex-wrap: wrap;
        }
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          min-width: 180px;
          flex: 1;
        }

        .filter-item label {
          font-weight: 600;
          margin-bottom: 4px;
        }

        select,
        input {
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          background: white;
          transition: border-color 0.2s;
        }

        select:focus,
        input:focus {
          border-color: #007bff;
        }

        .export-btn {
          padding: 10px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }
        .export-btn:hover {
          background: #0056b3;
        }
        .records-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed; /* Important for truncation */
        }

        @media (max-width: 768px) {
          .filter-row {
            flex-direction: column;
          }
          .filter-item {
            width: 100%;
          }
        }
        .records-table-wrapper {
          overflow-x: auto;
        }
        .records-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
        }
        .records-table th,
        .records-table td {
          padding: 8px 10px;
          border: 1px solid #ddd;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap; /* Keeps text in a single line */
          max-width: 150px; /* Adjust for different screen sizes if needed */
        }
        .records-table th {
          color: #000; /* black text */
          font-weight: 700; /* bold */
        }
        .desktop-only {
          display: table-cell;
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none; /* hide extra columns on mobile */
          }
          .records-table td,
          .records-table th {
            font-size: 13px;
            padding: 6px 8px;
          }
          .filter-row {
            flex-direction: column;
          }
          .records-table th,
          .records-table td {
            font-size: 13px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
}

