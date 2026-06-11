import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./submission.css";
import { API } from "../api";

export default function SubmissionDetails() {

  const location = useLocation();
  const navigate = useNavigate();

  const candidate = location.state?.candidate;

  const employee = JSON.parse(
    localStorage.getItem("employee")
  );

  // ================= AUTO DATE =================
  const currentDate = new Date().toISOString().split("T")[0];

  // ================= AUTO TIME =================
  const currentTime = new Date().toLocaleTimeString();

  // ================= SAFE EMPLOYEE =================
  const safeEmployeeId =
    employee?.employeeId?.toUpperCase().trim() || "";

  const safeEmployeeName =
    `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim();

  // ================= FORM STATE =================
  const [formData, setFormData] = useState({

    candidateId: candidate?._id || "",
    candidateName: candidate?.fullName || "",

    employeeId: safeEmployeeId,
    employeeName: safeEmployeeName,

    appliedDate: currentDate,

    submission: "",
    jobTitle: "",
    implementationPartner: "",
    rate: "",
    location: "",
    vendor: "",
    recruiter: "",
    phone: "",
    ext: "",
    email: "",
    interviewType: "",
    timing: currentTime,
  });

  // =====================================================
  // LOAD PREVIOUS SUBMISSION DATA
  // =====================================================
  useEffect(() => {
    if (!candidate?._id) return;
    loadPreviousSubmission();
  }, [candidate]);

  const loadPreviousSubmission = async () => {
    try {
      const res = await axios.get(
       `${API.CANDIDATE}/submission-details/${candidate._id}`
      );

      if (res.data) {
        setFormData({
          candidateId: candidate._id,
          candidateName: res.data.candidateName || "",

          employeeId: res.data.employeeId || safeEmployeeId,
          employeeName: res.data.employeeName || safeEmployeeName,

          appliedDate: res.data.appliedDate || currentDate,
          submission: res.data.submission || "",
          jobTitle: res.data.jobTitle || "",
          implementationPartner: res.data.implementationPartner || "",
          rate: res.data.rate || "",
          location: res.data.location || "",
          vendor: res.data.vendor || "",
          recruiter: res.data.recruiter || "",
          phone: res.data.phone || "",
          ext: res.data.ext || "",
          email: res.data.email || "",
          interviewType: res.data.interviewType || "",
          timing: res.data.timing || currentTime,
        });

        console.log("✅ Previous Submission Loaded");
      }

    } catch (err) {
      console.log("ℹ️ No Previous Submission Found");
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // ================= FINAL SAFETY CHECK =================
      const finalPayload = {
        ...formData,
        employeeId: formData.employeeId?.toUpperCase().trim(),
        employeeName: formData.employeeName,
      };

      if (!finalPayload.employeeId) {
        alert("Employee ID missing. Please login again.");
        navigate("/");
        return;
      }

      const res = await axios.post(
        `${API.CANDIDATE}/submission-details`,
        finalPayload
      );

      alert("Submission Details Saved Successfully");

      navigate("/submission-view", {
        state: {
          submission: res.data.data,
        },
      });

    } catch (err) {
      console.log(err);
      alert("Failed To Save");
    }
  };

  return (
    <div className="submission-container">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>Submission Details</h1>

      <form className="submission-form" onSubmit={handleSubmit}>

        {/* Candidate Name */}
        <div className="form-group">
          <label>Candidate Full Name</label>
          <input
            type="text"
            name="candidateName"
            value={formData.candidateName}
            readOnly
          />
        </div>

        {/* Applied Date */}
        <div className="form-group">
          <label>Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            readOnly
          />
        </div>

        {/* Submission */}
        <div className="form-group">
          <label>Submission</label>
          <input
            type="text"
            name="submission"
            value={formData.submission}
            onChange={handleChange}
            required
          />
        </div>

        {/* Job Title */}
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>

        {/* Implementation Partner */}
        <div className="form-group">
          <label>Implementation Partner / Client</label>
          <input
            type="text"
            name="implementationPartner"
            value={formData.implementationPartner}
            onChange={handleChange}
          />
        </div>

        {/* Rate */}
        <div className="form-group">
          <label>Rate ($)</label>
          <input
            type="text"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Vendor */}
        <div className="form-group">
          <label>Vendor</label>
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
          />
        </div>

        {/* Recruiter */}
        <div className="form-group">
          <label>Recruiter / Vendor</label>
          <input
            type="text"
            name="recruiter"
            value={formData.recruiter}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Ext */}
        <div className="form-group">
          <label>Ext</label>
          <input
            type="text"
            name="ext"
            value={formData.ext}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Interview Type */}
        <div className="form-group">
          <label>Interview Type</label>
          <select
            name="interviewType"
            value={formData.interviewType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Telephonic">Telephonic</option>
            <option value="Video Conference">Video Conference</option>
            <option value="Face To Face">Face To Face</option>
          </select>
        </div>

        {/* Timing */}
        <div className="form-group">
          <label>Timing</label>
          <input
            type="text"
            name="timing"
            value={formData.timing}
            readOnly
          />
        </div>

        {/* SUBMIT */}
        <button type="submit" className="submit-btn">
          Save Submission
        </button>

      </form>

    </div>
  );
}