import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./analysis.css";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { API } from "../api";
export default function AnalysisEmp() {

  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ================= LOAD ANALYSIS =================

  const loadAnalysis = async (customFromDate = "", customToDate = "") => {
    try {
      setLoading(true);

      const employee = JSON.parse(localStorage.getItem("employee"));

      // ================= SAFETY CHECK =================
      if (!employee?.employeeId) {
        alert("Session Expired. Please Login Again");
        navigate("/");
        return;
      }

      const employeeId = employee.employeeId.toUpperCase().trim();

      const res = await axios.get(
        `${API.CANDIDATE}/submission-analysis/${employeeId}`,
        {
          params: {
            fromDate: customFromDate,
            toDate: customToDate,
          },
        }
      );

      setAnalysis(res.data);

    } catch (err) {
      console.log("❌ Analysis Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem("employee"));

    if (!employee?.employeeId) {
      navigate("/");
      return;
    }

    loadAnalysis();
  }, []);

  // ================= SEARCH =================

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      alert("Please Select From Date And To Date");
      return;
    }

    if (fromDate > toDate) {
      alert("From Date Cannot Be Greater Than To Date");
      return;
    }

    loadAnalysis(fromDate, toDate);
  };

  // ================= REFRESH =================

  const handleRefresh = () => {
    setFromDate("");
    setToDate("");
    loadAnalysis();
  };

  // ================= PDF DOWNLOAD =================

  const handleDownloadPDF = () => {
    if (!analysis?.latestSubmissions?.length) {
      alert("No Submission Data Found");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Submission Analysis Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`From Date : ${fromDate || "All Records"}`, 14, 25);
    doc.text(`To Date : ${toDate || "All Records"}`, 14, 32);
    doc.text(`Total Submissions : ${analysis.totalSubmissions || 0}`, 14, 39);

    autoTable(doc, {
      startY: 48,
      head: [[
        "Candidate",
        "Job Title",
        "Vendor",
        "Recruiter",
        "Applied Date",
        "Time",
      ]],
      body: analysis.latestSubmissions.map((item) => [
        item.candidateName,
        item.jobTitle,
        item.vendor,
        item.recruiter,
        item.appliedDate,
        item.timing,
      ]),
    });

    doc.save("Submission_Report.pdf");
  };

  return (
    <div className="analysis-container">

      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="analysis-title">
        Submission Analysis Dashboard
      </h1>

      {/* FILTER SECTION */}
      <div className="filter-section">

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>

        <button className="refresh-btn" onClick={handleRefresh}>
          Refresh
        </button>

        <button className="download-btn" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loading">
          Loading Analysis...
        </div>
      )}

      {/* CARDS */}
      {!loading && analysis && (
        <div className="cards-grid">

          <div className="card">
            <h2>{analysis.totalSubmissions || 0}</h2>
            <p>Total Submissions</p>
          </div>

          <div className="card">
            <h2>{analysis.todaySubmissions || 0}</h2>
            <p>Today's Submission</p>
          </div>

          <div className="card">
            <h2>{analysis.weeklySubmissions || 0}</h2>
            <p>Weekly Submission</p>
          </div>

          <div className="card">
            <h2>{analysis.monthlySubmissions || 0}</h2>
            <p>Monthly Submission</p>
          </div>

        </div>
      )}

      {/* TABLE */}
      {!loading && (
        <div className="table-wrapper">

          <h2>Latest Submissions</h2>

          <table>

            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Title</th>
                <th>Vendor</th>
                <th>Recruiter</th>
                <th>Applied Date</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>

              {analysis?.latestSubmissions?.length > 0 ? (
                analysis.latestSubmissions.map((item) => (
                  <tr key={item._id}>
                    <td>{item.candidateName}</td>
                    <td>{item.jobTitle}</td>
                    <td>{item.vendor}</td>
                    <td>{item.recruiter}</td>
                    <td>{item.appliedDate}</td>
                    <td>{item.timing}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No Submission Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}