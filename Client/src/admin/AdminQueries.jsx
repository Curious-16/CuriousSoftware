import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import {
  FaTrash,
  FaArrowLeft,
  FaSearch,
  FaEnvelope,
  FaUserCircle,
  FaRegClock,
} from "react-icons/fa";

import "./AdminQueries.css";

function AdminQueries() {

  const [queries, setQueries] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // ================= FETCH QUERIES =================

  const fetchQueries = async () => {

    try {

      const res = await axios.get(
                `${API.ADMIN}/api/contactus`
      );

      setQueries(res.data);

    } catch (err) {

      console.log("❌ Fetch Error :", err);

    }

  };

  useEffect(() => {

    fetchQueries();

  }, []);

  // ================= DELETE QUERY =================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this query?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
          `${API.ADMIN}/api/contactus/${id}`
      );

      setQueries((prevQueries) =>
        prevQueries.filter(
          (q) => q._id !== id
        )
      );

      alert("Query deleted successfully");

    } catch (err) {

      console.log("❌ Delete Error :", err);

      alert("Delete failed");

    }

  };

  // ================= BACK =================

  const handleBack = () => {

    navigate("/dashboard");

  };

  // ================= FILTER =================

  const filteredQueries = queries.filter((q) =>
    q.name?.toLowerCase().includes(search.toLowerCase()) ||
    q.email?.toLowerCase().includes(search.toLowerCase()) ||
    q.query?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="query-page">

      {/* ================= HEADER ================= */}

      <div className="query-header">

        <div className="query-title">

          <h1>Employee Queries</h1>

          <p>
            Manage and review employee support
            queries in a premium dashboard UI.
          </p>

        </div>

        <div className="search-wrapper">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search queries..."
            className="search-box"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="query-table-wrapper">

        <table>

          <thead>

            <tr>

              <th>User</th>

              <th>Email</th>

              <th>Query Message</th>

              <th>Date & Time</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredQueries.length > 0 ? (

              filteredQueries.map((q) => (

                <tr key={q._id}>

                  {/* USER */}

                  <td>

                    <div className="user-info">

                      <div className="user-avatar">

                        <FaUserCircle />

                      </div>

                      <div>

                        <h4 className="user-name">
                          {q.name || "N/A"}
                        </h4>

                        <span className="user-tag">
                          Employee
                        </span>

                      </div>

                    </div>

                  </td>

                  {/* EMAIL */}

                  <td>

                    <div className="email-box">

                      <FaEnvelope />

                      <span>
                        {q.email || "N/A"}
                      </span>

                    </div>

                  </td>

                  {/* QUERY */}

                  <td>

                    <div className="query-message">

                      {q.query || "N/A"}

                    </div>

                  </td>

                  {/* DATE */}

                  <td>

                    <div className="date-box">

                      <FaRegClock />

                      <span>

                        {q.createdAt
                          ? new Date(
                              q.createdAt
                            ).toLocaleString()
                          : "N/A"}

                      </span>

                    </div>

                  </td>

                  {/* ACTION */}

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(q._id)
                      }
                    >

                      <FaTrash />

                      Delete

                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  className="no-data"
                >

                  No Queries Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ================= BACK BUTTON ================= */}

      <button
        className="bottom-back-btn"
        onClick={handleBack}
      >

        <FaArrowLeft />

        Back To Dashboard

      </button>

    </div>

  );

}

export default AdminQueries;