import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, authHeader } from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitList } from "../constants/datalist";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import smileclublogo from "../images/smileclublogo.png";
import { Modal, Button, Form } from "react-bootstrap";

export default function ViewPage() {
  const [filterUnit, setFilterUnit] = useState("");
  const [filterName, setFilterName] = useState("");
  const [sector, setSector] = useState(localStorage.getItem("sector") || "");

  const [unit, setUnit] = useState(localStorage.getItem("unit") || "");
  const userType = localStorage.getItem("userType"); // "sector" or "unit"
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // number of rows per page
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  // Fetch all records
  const fetchRecords = async () => {
    try {
      const headers = authHeader();
      const res = await axios.get(`${API_BASE_URL}/form`, { headers });
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records", error);
    }
  };

  // When table row clicked → open modal + load data
  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setEditingId(record._id);
    setFormData({ ...record }); // clone so formData updates separately
    setIsEditing(false);
  };

  // Handle input changes while editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Delete record
  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#0b6b5a",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/form/${editingId}`);
          Swal.fire("🗑 Deleted!", "Record deleted successfully.", "success");
          setSelectedRecord(null);
          fetchRecords();
        } catch (error) {
          Swal.fire("❌ Error", "Could not delete record.", "error");
          console.error(error);
        }
      }
    });
  };

  // Update record
  const handleUpdate = async () => {
    try {
      const headers = authHeader();
      const payload = { ...formData };
      await axios.put(`${API_BASE_URL}/form/${editingId}`, payload, {
        headers,
      });
      Swal.fire("Updated!", "Record updated successfully.", "success");
      setIsEditing(false);
      fetchRecords();
    } catch (error) {
      Swal.fire("❌ Error", "Failed to update record.", "error");
      console.error(error);
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

  const exportPDF = async () => {
    const logoWidth = 15;
    const logoHeight = 11;

    // === 🌈 Sort Logic Based on Login Type ===
    let sortedData;
    const userType = localStorage.getItem("userType");
    const division = localStorage.getItem("division");
    //const sector = localStorage.getItem("sector");
    const unit = localStorage.getItem("unit");

    if (userType === "division") {
      // Sort by Sector → Unit → Name
      sortedData = [...filtered].sort((a, b) => {
        if (a.sector === b.sector) {
          if (a.unit === b.unit) return a.name.localeCompare(b.name);
          return a.unit.localeCompare(b.unit);
        }
        return a.sector.localeCompare(b.sector);
      });
    } else if (userType === "sector") {
      // Sort by Unit → Name
      sortedData = [...filtered].sort((a, b) => {
        if (a.unit === b.unit) return a.name.localeCompare(b.name);
        return a.unit.localeCompare(b.unit);
      });
    } else {
      // Unit login — sort only by Name
      sortedData = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    // === 🧾 PDF Setup ===
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // === 🌈 Gradient Header ===
    const gradientHeight = 16;
    const gradientSteps = 100;
    for (let i = 0; i <= gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const r = 116 + ratio * (172 - 116);
      const g = 235 + ratio * (182 - 235);
      const b = 213 + ratio * (229 - 213);
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

    // === 🧾 Dynamic Title ===
    let title = "";

    if (userType === "division") {
      if (filterUnit) {
        title = `Let's Smile Registrations - SSF ${filterUnit} UNIT`;
      } else if (sector) {
        title = `Let's Smile Registrations - SSF ${sector} SECTOR`;
      } else {
        title = `Let's Smile Registrations - SSF ${division} DIVISION`;
      }
    } else if (userType === "sector") {
      title = `Let's Smile Registrations - ${sector}${
        filterUnit ? ` / ${filterUnit}` : ""
      } SECTOR`;
    } else if (userType === "unit") {
      title = `Let's Smile Registrations - ${unit} UNIT`;
    }

    const date = new Date()
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replaceAll("/", "-");

    doc.setFontSize(13);
    doc.setTextColor(11, 107, 90);
    doc.text(title, pageWidth / 2, (logoHeight + 10) / 2, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(70);
    doc.text(`Generated on: ${date}`, 14, gradientHeight + 8);

    // === 🧮 Dynamic Table Head ===
    let tableHead;
    if (userType === "division") {
      tableHead = [
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
    } else if (userType === "sector") {
      tableHead = [
        ["No", "Unit", "Name", "Class", "School", "Age", "Father", "Number"],
      ];
    } else {
      tableHead = [
        ["No", "Name", "Class", "School", "Age", "Father", "Number"],
      ];
    }

    // === 🧍 Table Body ===
    const tableBody = sortedData.map((i, index) => {
      if (userType === "division") {
        return [
          index + 1,
          i.sector,
          i.unit,
          i.name,
          i.className,
          i.school,
          i.age,
          i.fatherName,
          { content: i.number, link: `tel:${i.number}` },
        ];
      } else if (userType === "sector") {
        return [
          index + 1,
          i.unit,
          i.name,
          i.className,
          i.school,
          i.age,
          i.fatherName,
          { content: i.number, link: `tel:${i.number}` },
        ];
      } else {
        return [
          index + 1,
          i.name,
          i.className,
          i.school,
          i.age,
          i.fatherName,
          { content: i.number, link: `tel:${i.number}` },
        ];
      }
    });

    // === 📋 Table Render ===
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

    // === 💾 Preview + Mobile Download ===
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      Swal.fire({
        title: "📄 Download PDF?",
        text: "Do you want to download this report?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Download",
        cancelButtonText: "No, Just Preview",
        confirmButtonColor: "#0b6b5a",
        cancelButtonColor: "#999",
      }).then((result) => {
        if (result.isConfirmed) {
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = `${title}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          Swal.fire({
            title: "✅ Download Started",
            text: "Your PDF report is being downloaded.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          window.open(pdfUrl, "_blank");
        }
      });
    } else {
      window.open(pdfUrl, "_blank");
    }
  };

  const showMembersStatus = () => {
    const userType = localStorage.getItem("userType");
    const division = localStorage.getItem("division");
    // const sector = localStorage.getItem("sector");

    // === 📅 Common Date Formatting ===
    const date = new Date()
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replaceAll("/", "-");

    // === 🟢 DIVISION LOGIN ===
    if (userType === "division" && !sector) {
      // Create a list of all sectors in this division
      const allSectors = Object.keys(unitList);

      // Group all records by sector
      const sectorGroups = records.reduce((acc, curr) => {
        if (!acc[curr.sector]) acc[curr.sector] = [];
        acc[curr.sector].push(curr);
        return acc;
      }, {});

      // Generate stats for ALL sectors (even if empty)
      const sortedSectors = allSectors
        .map((sectorName) => {
          const sectorRecords = sectorGroups[sectorName] || [];
          const unitsInSector = unitList[sectorName] || [];

          // Count members per unit
          const counts = sectorRecords.reduce((acc, curr) => {
            if (!acc[curr.unit]) acc[curr.unit] = 0;
            acc[curr.unit]++;
            return acc;
          }, {});

          const totalUnits = unitsInSector.length;
          const participatedUnits = unitsInSector.filter(
            (u) => counts[u] > 0
          ).length;
          const totalMembers = Object.values(counts).reduce((a, b) => a + b, 0);

          return {
            sector: sectorName,
            totalMembers,
            participatedUnits,
            totalUnits,
          };
        })
        .sort((a, b) => b.totalMembers - a.totalMembers);

      // Division summary totals
      const grandTotalMembers = sortedSectors.reduce(
        (sum, s) => sum + s.totalMembers,
        0
      );
      const grandParticipatedUnits = sortedSectors.reduce(
        (sum, s) => sum + s.participatedUnits,
        0
      );
      const grandTotalUnits = sortedSectors.reduce(
        (sum, s) => sum + s.totalUnits,
        0
      );

      const messageText = sortedSectors
        .map(({ sector, totalMembers, participatedUnits, totalUnits }) => {
          const emoji =
            totalMembers >= 100 ? "🟡" : totalMembers >= 50 ? "🟠" : "🔴";

          return `*${emoji}* ${sector} ---: *${totalMembers}/${participatedUnits}*/${totalUnits}`;
        })
        .join("\n");

      const shareText = `\`\`\`📃 SMILE Friends List ⭐\`\`\`
🔗 Registration: 
https://smile-manjeshwar.vercel.app

📊 *SECTOR STATUS*
────────────────
${messageText}

Total: *${grandTotalMembers}/${grandParticipatedUnits}*/${grandTotalUnits}
────────────────
*Generated On:*
_${date}_
────────────────
*SSF ${division || "All Divisions"}* Division
© Let's Smile Directorate`;

      const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
        shareText
      )}`;

      // 🟢 SweetAlert layout
      const messageHTML = `
      <p style="
        color: #0b6b5a;
        font-weight: bold;
      ">
        Total: ${grandTotalMembers}/${grandParticipatedUnits}/${grandTotalUnits}
      </p>
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 6px;
        text-align: center;
        margin-top: 6px;
      ">
        ${sortedSectors
          .map(
            ({ sector, totalMembers, participatedUnits, totalUnits }) => `
            <div style="
              background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
              padding: 6px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              color: #0b6b5a;
            ">
              <div style="font-size: 0.8em; font-weight: bold;">${sector}</div>
              <div style="font-size: 1em; font-weight: bold;">${totalMembers}</div>
              <div style="font-size: 0.9em;">${participatedUnits}/${totalUnits}</div>
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

      Swal.fire({
        title: `📊 Sector Status (${division || "Division"})`,
        html: messageHTML,
        icon: "info",
        width: "600px",
        confirmButtonText: "Close",
        confirmButtonColor: "#0b6b5a",
        background: "#f8fdfd",
      });

      return; // stop here for division login
    }

    // === 🟠 SECTOR LOGIN ===
    const sectorRecords = sector
      ? records.filter((r) => r.sector === sector)
      : records;

    const counts = sectorRecords.reduce((acc, curr) => {
      if (!acc[curr.unit]) acc[curr.unit] = 0;
      acc[curr.unit]++;
      return acc;
    }, {});

    const selectedUnits = unitList[sector] || [];

    const sortedUnits = selectedUnits
      .map((unit) => ({
        unit,
        count: counts[unit] || 0,
      }))
      .sort((a, b) => b.count - a.count);

    const totalUnits = sortedUnits.length;
    const participatedUnits = sortedUnits.filter((u) => u.count > 0).length;
    const totalMembers = sortedUnits.reduce((sum, u) => sum + u.count, 0);

    const messageText = sortedUnits
      .map(({ unit, count }) => {
        const emoji = count >= 50 ? "🟡" : count >= 25 ? "🟠" : "🔴";
        return `${emoji} ${unit} ---: *${count}*`;
      })
      .join("\n");

    const shareText = `\`\`\`📃 SMILE Friends List ⭐\`\`\`
🔗 Registration: 
https://smile-manjeshwar.vercel.app

📊 *UNIT STATUS*
────────────────
${messageText}

*Total:* ${totalMembers}/${participatedUnits}/${totalUnits}
────────────────
*Generated On:*
_${date}_
────────────────
*SSF ${sector || "All Sectors"}* Sector
© Let's Smile Directorate`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    const messageHTML = `
    <p style="
      color: #0b6b5a;
      font-weight:bold;
    ">
      Total: ${totalMembers}/${participatedUnits}/${totalUnits}
    </p>
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 5px;
      text-align: center;
      margin-top: 8px;
    ">
    
      ${sortedUnits
        .map(
          ({ unit, count }) => `
          <div style="
            background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
            padding: 5px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            color: #0b6b5a;
          ">
            <div style="font-size: 0.8em; font-weight: bold;">${unit}</div>
            <div style="font-size: 1em; font-weight: bold;">${count}</div>
          </div>
        `
        )
        .join("")}
    </div>
    <br>
    <a href="${whatsappLink}" target="_blank"
      style="
        display:inline-block;
        padding:10px 10px;
        background-color:#25D366;
        color:white;
        border-radius:8px;
        text-decoration:none;
        font-weight:600;
      ">
      📲 Share on WhatsApp
    </a>
  `;

    Swal.fire({
      title: `📊 Unit Status ${sector ? `(${sector} Sector)` : ""}`,
      html: messageHTML,
      width: "600px",
      confirmButtonText: "Close",
      confirmButtonColor: "#0b6b5a",
      background: "#f8fdfd",
      icon: "info",
    });
  };

  const allUnitStatus = () => {
    const userType = localStorage.getItem("userType");
    const division = localStorage.getItem("division");

    if (userType !== "division") return;

    const sectorCodes = {
      BAKRABAIL: "BKRBL",
      DAIGOLI: "DGLI",
      KADAMBAR: "KDMBR",
      KEDUMBADY: "KED",
      KUNJATHUR: "KJR",
      MANJESHWARAM: "MJR",
      MEENJA: "MNJ",
      VORKADY: "VRKD",
    };

    // Combine all units
    const allUnits = Object.entries(unitList).flatMap(([sectorName, units]) =>
      units.map((unit) => ({
        sector: sectorName,
        code:
          sectorCodes[sectorName.toUpperCase()] ||
          sectorName.slice(0, 3).toUpperCase(),
        unit,
      }))
    );

    // Member count per unit
    const unitCounts = records.reduce((acc, curr) => {
      acc[curr.unit] = (acc[curr.unit] || 0) + 1;
      return acc;
    }, {});

    // Group units by sector
    const sectorGroups = allUnits.reduce((acc, { sector, code, unit }) => {
      if (!acc[sector]) acc[sector] = { code, units: [] };
      acc[sector].units.push({
        unit,
        count: unitCounts[unit] || 0,
      });
      return acc;
    }, {});

    // Sort units (by count)
    Object.values(sectorGroups).forEach((group) => {
      group.units.sort((a, b) => b.count - a.count);
    });

    // Sector totals + sort by total
    const sortedSectors = Object.entries(sectorGroups)
      .map(([sector, { code, units }]) => {
        const total = units.reduce((sum, u) => sum + u.count, 0);
        const participatedUnits = units.filter((u) => u.count > 0).length;
        const totalUnits = units.length;
        return { sector, code, units, total, participatedUnits, totalUnits };
      })
      .sort((a, b) => b.total - a.total);

    // Totals (overall)
    const totalUnits = allUnits.length;
    const participatedUnits = allUnits.filter(
      (u) => unitCounts[u.unit] > 0
    ).length;
    const totalMembers = Object.values(unitCounts).reduce((a, b) => a + b, 0);

    // Date
    const date = new Date()
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replaceAll("/", "-");

    // WhatsApp message
    const messageText = sortedSectors
      .map(({ sector, code, units, total, participatedUnits, totalUnits }) => {
        const unitLines = units
          .map(({ unit, count }) => `   • ${unit}: *${count}*`)
          .join("\n");
        return `*${code} - ${sector.toUpperCase()}*\n${unitLines}\n➡️ *Status: ${total}/${participatedUnits}/${totalUnits}*`;
      })
      .join("\n\n");

    const shareText = `\`\`\`📃 SMILE Friends List ⭐\`\`\`
🔗 Registration:
https://smile-manjeshwar.vercel.app

📊 *UNIT STATUS*
────────────────
${messageText}

────────────────
*📊Division Status:*
   *${totalMembers} / ${participatedUnits} / ${totalUnits}*
────────────────
*Generated On:*
_${date}_
────────────────
*SSF ${division || "Division"}*
© Let's Smile Directorate`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    // SweetAlert content
    const messageHTML = sortedSectors
      .map(({ sector, code, units, total, participatedUnits, totalUnits }) => {
        return `
      <div style="margin-bottom: 14px;">
        <h4 style="
          color: #0b6b5a;
          font-weight: bold;
          text-align: center;
          background: rgba(255,255,255,0.7);
          border-radius: 6px;
          padding: 4px;
        ">${code} - ${sector}</h4>
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 5px;
          text-align: center;
          margin-top: 6px;
        ">
          ${units
            .map(
              ({ unit, count }) => `
              <div style="
                background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
                padding: 5px;
                border-radius: 10px;
                color: #0b6b5a;
                font-weight: 600;
              ">
                <div style="font-size: 0.9em;">${unit}</div>
                <div style="font-size: 1.2em;">${count}</div>
              </div>
            `
            )
            .join("")}
        </div>
        <div style="
          text-align: right;
          margin-top: 6px;
          font-weight: 700;
          color: #0b6b5a;
        ">➡️ Total: ${total}/${participatedUnits}/${totalUnits}</div>
      </div>
    `;
      })
      .join("");

    Swal.fire({
      title: `📊 All Unit Status (${division || "Division"})`,
      html: `
      <div style="max-height: 70vh; overflow-y: auto;">${messageHTML}</div>
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
    `,
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
        width: "auto",
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
          background: "linear-gradient(135deg, #ACB6E5 0%,  #74ebd5 100%)",
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
              gap: "5px",
              background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
              marginBottom: "10px",
              justifyContent: "space-between",
            }}>
            {/* Sector Filter */}
            <div className="form-group equal-filter">
              <label>Sector</label>
              {localStorage.getItem("userType") === "division" ? (
                <select
                  value={sector}
                  onChange={(e) => {
                    setSector(e.target.value);
                    setFilterUnit("");
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
            <div className="form-group equal-filter">
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
            <div className="form-group equal-filter">
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

          {/* Buttons */}
          <div
            className="filter-card"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
              gap: "5px",
            }}>
            {/* ExportPDF Button */}
            <button className="export-btn" onClick={exportPDF}>
              📄 Export PDF
            </button>

            {/* Sector or Unit Status */}
            {localStorage.getItem("userType") !== "unit" &&
              (localStorage.getItem("userType") === "division" ? (
                <button
                  className="export-btn"
                  style={{ background: "#0b6b5a" }}
                  onClick={showMembersStatus}>
                  📊 Sector Status
                </button>
              ) : (
                <button
                  className="export-btn"
                  style={{ background: "#0b6b5a" }}
                  onClick={showMembersStatus}>
                  📊 Unit Status
                </button>
              ))}
            {/* ALL UNIT STATUS */}
            {localStorage.getItem("userType") === "division" && (
              <button
                className="export-btn"
                style={{ background: "#105652" }}
                onClick={allUnitStatus}>
                📊 All Unit Status
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
          alignItems: "center",
          padding: "10px",
          background: "linear-gradient(135deg, #ACB6E5 0%, #74ebd5 100%)",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          color: "#333",
          maxWidth: "1000px",
        }}>
        <p
          style={{
            textAlign: "center",
            fontWeight: "600",
            color: "#0b6b5a",
            marginBottom: "0px",
          }}>
          Records: {filtered.length}
        </p>

        {/* ✅ Scrollable table container */}
        <div
          className="records-table"
          style={{
            overflowY: "auto", // Only vertical scroll inside table
            overflowX: "auto", // Allow horizontal scroll if many columns
            borderRadius: "10px",
            width: "100%",
          }}>
          <table
            className="records-table"
            style={{
              background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              color: "#333",
              width: "100%",
              margin: "2px 0",
            }}>
            <thead>
              <tr>
                <th className="desktop-only">No</th>
                <th className="desktop-only">Sector</th>
                <th>Unit</th>
                <th>Name</th>
                <th className="desktop-only">Age</th>
                <th>Class</th>
                <th className="desktop-only">School</th>
                <th className="desktop-only">Father</th>
                <th className="desktop-only">Number</th>
              </tr>
            </thead>

            <tbody>
              {filtered
                .slice(
                  (currentPage - 1) * recordsPerPage,
                  currentPage * recordsPerPage
                )
                .map((r, index) => (
                  <tr
                    key={r._id}
                    className="table-row"
                    onClick={() => handleRowClick(r)}
                    style={{ cursor: "pointer" }}>
                    <td className="desktop-only">{index + 1}</td>
                    <td className="desktop-only">{r.sector}</td>
                    <td>{r.unit}</td>
                    <td>{r.name}</td>
                    <td className="desktop-only">{r.age}</td>
                    <td>{r.className}</td>
                    <td className="desktop-only">{r.school}</td>
                    <td className="desktop-only">{r.fatherName}</td>
                    <td className="desktop-only">{r.number}</td>
                  </tr>
                ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination stays fixed */}
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
            ◀
          </button>

          {(() => {
            const visiblePages = 5;
            let start = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
            let end = start + visiblePages - 1;

            if (end > totalPages) {
              end = totalPages;
              start = Math.max(end - visiblePages + 1, 1);
            }

            return [...Array(end - start + 1)].map((_, i) => {
              const page = start + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    background: currentPage === page ? "#007bff" : "#74ebd5",
                    color: currentPage === page ? "white" : "#0b6b5a",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}>
                  {page}
                </button>
              );
            });
          })()}

          <button
            className="export-btn"
            style={{
              background: "#0b6b5a",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }>
            ▶
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        show={!!selectedRecord}
        onHide={() => setSelectedRecord(null)}
        centered
        size="2sm"
        backdrop={true} // ✅ allows outside click to close
        keyboard={true}>
        {/* HEADER */}
        <Modal.Header
          className="d-flex justify-content-center"
          style={{
            backgroundColor: "#0b6b5a",
            color: "white",
            borderBottom: "none",
          }}>
          <Modal.Title>Registration Details</Modal.Title>
        </Modal.Header>

        {/* BODY */}
        <Modal.Body
          style={{
            background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
            color: "#333",
            padding: "10px",
            fontSize: "16px",
          }}>
          <div className="p-2">
            {[
              { label: "Sector", name: "sector" },
              { label: "Unit", name: "unit" },
              { label: "Name", name: "name" },
              { label: "Class", name: "className" },
              { label: "School", name: "school" },
              { label: "Age", name: "age" },
              { label: "Father", name: "fatherName" },
              { label: "Number", name: "number" },
            ].map((field) => (
              <div key={field.name} className="detail-row mb-2">
                <span className="label fw-bold">{field.label}:</span>{" "}
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    disabled={field.name === "sector" || field.name === "unit"} // ✅ Disable Sector & Unit
                    style={{
                      display: "inline-block",
                      width: "70%",
                      marginLeft: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      padding: "2px 8px",
                      backgroundColor:
                        field.name === "sector" || field.name === "unit"
                          ? "#e9ecef" // light grey background for disabled
                          : "white",
                    }}
                  />
                ) : (
                  <span className="value ms-1">{formData[field.name]}</span>
                )}
              </div>
            ))}
          </div>
        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer
          className="d-flex justify-content-center"
          style={{ backgroundColor: "#f0f8ff", borderTop: "none" }}>
          {/* Close Button */}
          <Button
            style={{
              backgroundColor: "#0b6b5a",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontWeight: "500",
            }}
            onClick={() => {
              setEditingId("");
              setIsEditing(false);
              setSelectedRecord(null);
            }}>
            Close
          </Button>

          {/* Delete Button */}
          <Button
            style={{
              backgroundColor: "#e63946",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontWeight: "500",
              color: "white",
            }}
            onClick={handleDelete}>
            Delete
          </Button>

          {/* Edit / Update Button */}
          <Button
            style={{
              backgroundColor: "#0b6b5a",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontWeight: "500",
            }}
            onClick={() => {
              if (isEditing) {
                handleUpdate();
              } else {
                setIsEditing(true);
              }
            }}>
            {isEditing ? "Update" : "Edit"}
          </Button>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
        .small-icon {
          transform: scale(0.2); /* Shrinks icon to 70% */
          margin-top: -5px;      /* Adjusts spacing if needed */
          margin-bottom: -5px;
        }

        .filter-card {
          background: #f9fafc;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
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
          padding: 10px 10px;
          font-size: 15px;
          flex-wrap: wrap;
        }
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 5px
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
      
       .filter-card  select
        input {
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          font-size: 12px;
          background: white;
          transition: border-color 0.2s;
        }
  
       .records-table thead th {
          background: #0b6b5a;
          color: white; /* optional for visibility */
        }
        select:focus,
        input:focus {
          border-color: #007bff;
        }
        .export-btn {
          padding: 7px 10px;
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
           overflow: auto; 
        }
 .records-table::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
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
          padding: 4px 6px;
          border: 1px solid #ddd;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap; /* Keeps text in a single line */
          max-width: 150px; /* Adjust for different screen sizes if needed */
        }       
          
        .desktop-only {
          display: table-cell;
        }
          .equal-filter {
            flex: 1 1 30%;
            min-width: 200px;
            display: flex;
            flex-direction: column;
            }

            .equal-filter label {
            font-weight: 600;
            margin-bottom: 4px;
            color: #333;
            }

            .equal-filter select,
            .equal-filter input {
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid #ccc;
            font-size: 14px;
            }

        @media (max-width: 768px) {
          .equal-filter {
          flex: 1 1 100%;
           margin-bottom: 2px;
         }
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
        }
      `}</style>
    </div>
  );
}

