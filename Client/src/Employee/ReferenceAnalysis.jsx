import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../api";

import "./ReferenceAnalysis.css";

export default function ReferenceAnalysis() {
  const { referenceNumber } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get(
        `${API.CANDIDATE}/reference-analysis/${referenceNumber}`
      );

      setData(res.data);
    } catch (err) {
      console.log("Reference Analysis Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="loading-text">Loading Analysis...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading-container">
        <h2 className="loading-text">No Data Found</h2>
      </div>
    );
  }

  return (
    <div className="reference-analysis-container">

      {/* Header Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
      </div>

      <div className="analysis-header">
        <h1>Reference Analysis</h1>
        <p>Candidate Submission Tracking</p>
      </div>

      {/* Candidate Info */}
      <div className="candidate-card">
        <h2>{data.candidate?.fullName}</h2>

        <div className="details-grid">
          <div className="detail-box">
            <label>Reference Number</label>
            {/* ✅ FIXED HERE */}
            <span>{data.candidate?.referenceNumber || "-"}</span>
          </div>

          <div className="detail-box">
            <label>Technology</label>
            <span>{data.candidate?.technology}</span>
          </div>

          <div className="detail-box">
            <label>Department</label>
            <span>{data.candidate?.department}</span>
          </div>

          <div className="detail-box">
            <label>Assigned Employee</label>
            <span>
              {data.candidate?.assignedEmployeeName || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Total Submissions */}
      <div className="total-submission-card">
        <h2>{data.totalSubmissions || 0}</h2>
        <p>Total Submissions</p>
      </div>

      {/* Table */}
      <div className="table-section">
        <h2 className="table-title">Submission History</h2>

        <div className="table-responsive">
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Vendor</th>
                <th>Recruiter</th>
                <th>Applied Date</th>
                <th>Interview Type</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {data.submissions?.length > 0 ? (
                data.submissions.map((item) => (
                  <tr key={item._id}>
                    <td>{item.jobTitle}</td>
                    <td>{item.vendor}</td>
                    <td>{item.recruiter}</td>
                    <td>{item.appliedDate}</td>
                    <td>{item.interviewType}</td>
                    <td>{item.timing}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No Submission Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}