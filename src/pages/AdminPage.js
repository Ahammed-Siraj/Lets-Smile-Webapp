// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL, authHeader } from "../api";
// import { unitList, sectorList } from "../constants/datalist";
// import "../styles/AdminPage.css";

// export default function AdminPage() {
//   const [records, setRecords] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [sector, setSector] = useState("");
//   const [unit, setUnit] = useState("");
//   const [searchName, setSearchName] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     className: "",
//     school: "",
//     age: "",
//     fatherName: "",
//     number: "",
//   });

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     try {
//       const headers = authHeader();
//       const res = await axios.get(`${API_BASE_URL}/form`, { headers });
//       setRecords(res.data);
//       setFiltered(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🧠 Apply filters when any filter value changes
//   useEffect(() => {
//     let filteredData = [...records];

//     if (sector) {
//       filteredData = filteredData.filter((r) => r.sector === sector);
//     }
//     if (unit) {
//       filteredData = filteredData.filter((r) => r.underSector === unit);
//     }
//     if (searchName.trim() !== "") {
//       filteredData = filteredData.filter((r) =>
//         r.name.toLowerCase().includes(searchName.toLowerCase())
//       );
//     }

//     setFiltered(filteredData);
//   }, [sector, unit, searchName, records]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     if (!sector || !unit) return alert("Please select a sector and unit!");

//     const data = { ...formData, sector, underSector: unit };
//     try {
//       const headers = authHeader();
//       await axios.post(`${API_BASE_URL}/form`, data, { headers });
//       alert("✅ Record added successfully!");
//       setSector("");
//       setUnit("");
//       setFormData({ name: "", className: "", school: "", number: "" });
//       fetchAll();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to add record");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this record?")) return;
//     try {
//       const headers = authHeader();
//       await axios.delete(`${API_BASE_URL}/form/${id}`, { headers });
//       fetchAll();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="container">
//       <h2>🛠️ Admin Dashboard</h2>
//       {/* Add New Entry Form */}
//       <div className="add-section"  style={{ marginBottom: "2rem" }}>
//         <h3>Add New Entry</h3>
//         <form onSubmit={handleAdd} className="responsive-form">
//           <div className="form-group">
//             <label>Sector:</label>
//             <select
//               value={sector}
//               onChange={(e) => setSector(e.target.value)}
//               required>
//               <option value="">Select Sector</option>
//               {Object.keys(unitList).map((sec) => (
//                 <option key={sec}>{sec}</option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Unit:</label>
//             <select
//               value={unit}
//               onChange={(e) => setUnit(e.target.value)}
//               required
//               disabled={!sector}>
//               <option value="">Select Unit</option>
//               {sector &&
//                 unitList[sector].map((u) => <option key={u}>{u}</option>)}
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter name"
//             />
//           </div>

//           <div className="form-group">
//             <label>Class:</label>
//             <input
//               type="text"
//               name="className"
//               value={formData.className}
//               onChange={handleChange}
//               required
//               placeholder="Enter class"
//             />
//           </div>

//           <div className="form-group">
//             <label>School:</label>
//             <input
//               type="text"
//               name="school"
//               value={formData.school}
//               onChange={handleChange}
//               required
//               placeholder="Enter school name"
//             />
//           </div>
//           <div className="form-group">
//             <label>Age</label>
//             <input
//               name="age"
//               type="number"
//               value={formData.age}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Father Name</label>
//             <input
//               name="fatherName"
//               value={formData.fatherName}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Number:</label>
//             <input
//               type="text"
//               name="number"
//               value={formData.number}
//               onChange={handleChange}
//               required
//               placeholder="Enter contact number"
//             />
//           </div>

//           <button type="submit" className="submit-btn">
//             ➕ Add Record
//           </button>
//         </form>
//       </div>
//       <h3>All Records</h3>
//       {/* 🔍 Filter Section */}
//       <div
//         className="filter-card"
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "1rem",
//           marginBottom: "2rem",
//         }}>
//         <div className="filter-row">
//           <label>Sector:</label>
//           <select
//             value={sector}
//             onChange={(e) => {
//               setSector(e.target.value);
//               setUnit("");
//             }}>
//             <option value="">All Sectors</option>
//             {Object.keys(unitList).map((sec) => (
//               <option key={sec}>{sec}</option>
//             ))}
//           </select>
//         </div>

//         <div className="filter">
//           <label>Unit:</label>
//           <select
//             value={unit}
//             onChange={(e) => setUnit(e.target.value)}
//             disabled={!sector}>
//             <option value="">All Units</option>
//             {sector &&
//               unitList[sector].map((u) => <option key={u}>{u}</option>)}
//           </select>
//         </div>

//         <div className="filter-row">
//           <label>Name:</label>
//           <input
//             type="text"
//             placeholder="Search by name"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Records Table */}
//       <p>Total records: {filtered.length}</p>
//       <table className="records-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Sector</th>
//             <th>Unit</th>
//             <th>Class</th>
//             <th>School</th>
//             <th>Age</th>
//             <th>Father</th>
//             <th>Number</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.map((r) => (
//             <tr key={r._id}>
//               <td>{r.name}</td>
//               <td>{r.sector}</td>
//               <td>{r.underSector}</td>
//               <td>{r.className}</td>
//               <td>{r.school}</td>
//               <td>{r.age}</td>
//               <td>{r.father}</td>
//               <td>{r.number}</td>
//               <td>
//                 <button onClick={() => setSelected(r)}>✏️ Edit</button>
//                 <button
//                   onClick={() => handleDelete(r._id)}
//                   style={{ marginLeft: 8 }}>
//                   🗑️ Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selected && (
//         <div style={{ marginTop: 16 }}>
//           <h3>Edit {selected.name}</h3>
//           <pre>{JSON.stringify(selected, null, 2)}</pre>
//           <button onClick={() => setSelected(null)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, authHeader } from "../api";
import { unitList } from "../constants/datalist";
import "../styles/AdminPage.css";

export default function DivisionPage() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sector, setSector] = useState("");
  const [unit, setUnit] = useState("");
  const [searchName, setSearchName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    school: "",
    age: "",
    fatherName: "",
    number: "",
  });

  // ✅ Fetch all records
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const headers = authHeader();
      const res = await axios.get(`${API_BASE_URL}/form`, { headers });
      setRecords(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Apply filters
  useEffect(() => {
    let filteredData = [...records];

    if (sector) {
      filteredData = filteredData.filter((r) => r.sector === sector);
    }
    if (unit) {
      filteredData = filteredData.filter((r) => r.underSector === unit);
    }
    if (searchName.trim() !== "") {
      filteredData = filteredData.filter((r) =>
        r.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFiltered(filteredData);
  }, [sector, unit, searchName, records]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add new record
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!sector || !unit) return alert("Please select a sector and unit!");

    const data = { ...formData, sector, underSector: unit };
    try {
      const headers = authHeader();
      await axios.post(`${API_BASE_URL}/form`, data, { headers });
      alert("✅ Record added successfully!");
      setFormData({
        name: "",
        className: "",
        school: "",
        age: "",
        fatherName: "",
        number: "",
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add record");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        🏫 Division Dashboard
      </h2>

      {/* 🔹 Sector & Unit Selection */}
      <div
        className="filter-card"
        style={{
          background: "linear-gradient(135deg, #e0f7fa, #fff)",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
        <h4 style={{ marginBottom: "1rem" }}>📍 Select Division</h4>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}>
          <div className="form-group">
            <label>Sector:</label>
            <select
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setUnit("");
              }}
              required>
              <option value="">Select Sector</option>
              {Object.keys(unitList).map((sec) => (
                <option key={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Unit:</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              disabled={!sector}>
              <option value="">Select Unit</option>
              {sector &&
                unitList[sector].map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 🔍 Search & Add Section */}
      <div
        className="dual-section"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}>
        {/* Search Section */}
        <div
          className="search-section"
          style={{
            background: "#f9f9f9",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}>
          <h4>🔎 Search Records</h4>
          <div className="filter-row" style={{ marginTop: "1rem" }}>
            <label>Name:</label>
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <p style={{ marginTop: "1rem" }}>
            Total records: <b>{filtered.length}</b>
          </p>
        </div>

        {/* Add Entry Section */}
        <div
          className="add-section"
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}>
          <h4>➕ Add New Entry</h4>
          <form onSubmit={handleAdd} className="responsive-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Class:</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>School:</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Father Name:</label>
              <input
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact:</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              style={{
                marginTop: "0.5rem",
                width: "100%",
                background: "linear-gradient(135deg, #4caf50, #81c784)",
                color: "#fff",
                fontWeight: "bold",
              }}>
              Add Record
            </button>
          </form>
        </div>
      </div>

      {/* 📋 Records Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="records-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sector</th>
              <th>Unit</th>
              <th>Class</th>
              <th>School</th>
              <th>Age</th>
              <th>Father</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.sector}</td>
                <td>{r.underSector}</td>
                <td>{r.className}</td>
                <td>{r.school}</td>
                <td>{r.age}</td>
                <td>{r.fatherName}</td>
                <td>{r.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
