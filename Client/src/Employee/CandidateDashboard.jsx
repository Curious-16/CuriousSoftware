// ================= CandidateDashboard.jsx =================

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import "./candidate.css";
import { API } from "../api";

export default function CandidateDashboard() {

  const navigate =
    useNavigate();

  const [employee, setEmployee] =
    useState(null);

  const [data, setData] =
    useState([]);

  const [filteredData, setFilteredData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // ================= WORKING STATUS OPTIONS =================

  const workingStatusOptions = [

    "Marketing",

    "Marketing Hold",

    "Job Offer",

    "Job Offer On Hold",

    "Background Check In Progress",

    "Background Check Completed",

    "Onboarding In Process",

    "Consultant Joined In The Project",

    "Consultant Joined Other Employer",

    "Consultant Not Responding",

    "Management Took A Decision To Stop Marketing",

  ];

  const blockedStatuses = [
  "Marketing Hold",
  "Job Offer On Hold",
  "Consultant Joined In The Project",
  "Consultant Joined Other Employer",
  "Consultant Not Responding",
  "Management Took A Decision To Stop Marketing",
];

  // ================= GET EMPLOYEE =================

  useEffect(() => {

    const emp = JSON.parse(
      localStorage.getItem(
        "employee"
      )
    );

    console.log(
      "✅ Logged Employee :",
      emp
    );

    if (!emp) {

      navigate("/");

      return;

    }

    setEmployee(emp);

  }, [navigate]);

  // ================= LOAD ASSIGNED CANDIDATES =================

  useEffect(() => {

    if (
      !employee?.employeeId
    ) {

      return;

    }

    loadAssigned();

  }, [employee]);

  const loadAssigned =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.get(
            `${API.CANDIDATE}/assigned/${employee.employeeId}`
          );

        console.log(
          "✅ Assigned Candidates :",
          res.data
        );

        setData(res.data);

        setFilteredData(
          res.data
        );

      } catch (err) {

        console.log(
          "❌ Load Error :",
          err
        );

      } finally {

        setLoading(false);

      }

    };

  // ================= SEARCH FILTER =================

  useEffect(() => {

    const filtered =
      data.filter((item) => {

        const value =
          search.toLowerCase();

        return (

          item.fullName
            ?.toLowerCase()
            .includes(value) ||

          item.technology
            ?.toLowerCase()
            .includes(value) ||

          item.department
            ?.toLowerCase()
            .includes(value) ||

          item.referenceNumber
            ?.toLowerCase()
            .includes(value) ||

          item.workingStatus
            ?.toLowerCase()
            .includes(value)

        );

      });

    setFilteredData(
      filtered
    );

  }, [search, data]);

  // ================= HANDLE WORKING STATUS CHANGE =================

  const handleWorkingStatusChange =
    async (
      candidateId,
      newStatus
    ) => {

      try {

        // ================= UPDATE LOCAL STATE =================

        const updatedData =
          data.map((item) =>

            item._id === candidateId
              ? {
                  ...item,
                  workingStatus:
                    newStatus,
                }
              : item
          );

        setData(updatedData);

        setFilteredData(
          updatedData
        );

        // ================= API UPDATE =================

        await axios.put(
          `${API.CANDIDATE}/update-working-status/${candidateId}`,
          {
            workingStatus:
              newStatus,
          }
        );

        console.log(
          "✅ Working Status Updated"
        );

      } catch (err) {

        console.log(
          "❌ Status Update Error :",
          err
        );

        alert(
          "Failed To Update Status"
        );

      }

    };

  // ================= DOWNLOAD PDF =================

  const handleDownload =
    async (candidateId) => {

      try {

        if (!candidateId) {

          alert(
            "Candidate ID Missing"
          );

          return;

        }

        console.log(
          "📥 Download Candidate ID :",
          candidateId
        );

        const res =
          await axios.get(
            `${API.CANDIDATE}/download-candidate/${candidateId}`,
            {
              responseType: "blob",
            }
          );

        const fileURL =
          window.URL.createObjectURL(
            new Blob([res.data])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = fileURL;

        link.setAttribute(
          "download",
          `candidate_${candidateId}.pdf`
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          fileURL
        );

        console.log(
          "✅ Download Success"
        );

      } catch (err) {

        console.log(
          "❌ Download Error :",
          err
        );

        alert(
          "Download Failed"
        );

      }

    };

  // ================= OPEN CANDIDATE DETAILS =================

  const openReferenceAnalysis =
  (referenceNumber) => {

    navigate(
      `/reference-analysis/${referenceNumber}`
    );

  };
  // ================= OPEN SUBMISSION DETAILS =================

  const openSubmissionDetails =
    (candidate) => {

      navigate(
        `/submission-details/${candidate._id}`,
        {
          state: {
            candidate,
          },
        }
      );

    };

    // ================= OPEN ANALYSIS PAGE =================

const openAnalysisPage = () => {
  navigate("/analysis-emp");
};

  // ================= LOGOUT =================

  const handleLogout =
    async () => {

      try {

        if (
          employee?.employeeId
        ) {

          await axios.put(
            `${API.ADMIN}/employee/logout/${employee.employeeId}`
          );

        }

      } catch (err) {

        console.log(
          "❌ Logout Error :",
          err
        );

      } finally {

        localStorage.removeItem(
          "employee"
        );

        navigate("/");

      }

    };

  return (

    <div className="dashboard-container">

      {/* ================= TOP BAR ================= */}

      <div className="topbar">

        <div className="top-left">

          <h1>
            Candidate Dashboard
          </h1>

          {/* ================= SEARCH ================= */}

          <div className="search-wrapper">

  <input
    type="text"
    placeholder="Search by Name, Technology, Department, Ref Number"
    className="search-box"
    value={search}
    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }
  />

  {/* ================= ANALYSIS BUTTON ================= */}

  <button
    className="analysis-btn"
    onClick={openAnalysisPage}
  >
    Analysis-emp
  </button>

</div>
</div>

        {/* ================= PROFILE CARD ================= */}

        <div className="profile-card">

          <div className="profile-circle">

            {
              employee?.firstName
                ?.charAt(0)
                ?.toUpperCase()
            }

          </div>

          <div className="profile-info">

            <h3>

              {employee?.firstName}{" "}

              {employee?.lastName}

            </h3>

            <p>
              📧 {employee?.email}
            </p>

            <p>
              🆔 {employee?.employeeId}
            </p>

            {/* ================= LOGOUT ================= */}

            <button
              className="logout-btn"
              onClick={
                handleLogout
              }
            >

              Logout

            </button>

          </div>

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="table-wrapper">

        {loading ? (

          <div className="loading">

            Loading Candidates...

          </div>

        ) : (

          <table>

            {/* ================= TABLE HEAD ================= */}

            <thead>

              <tr>

                <th>Name</th>

                <th>Technology</th>

                <th>Department</th>

                <th>Reference</th>

                <th>Assigned Employee</th>

                <th>Working Status</th>

                <th>Submission Details</th>

                <th>Download</th>

              </tr>

            </thead>

            {/* ================= TABLE BODY ================= */}

            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item) => (

                  <tr key={item._id}>

                    {/* ================= NAME ================= */}

                    <td>
  <span className="candidate-name">
    {item.fullName}
  </span>
</td>

                    {/* ================= TECHNOLOGY ================= */}

                    <td>

                      {item.technology}

                    </td>

                    {/* ================= DEPARTMENT ================= */}

                    <td>

                      {item.department}

                    </td>

                    {/* ================= REFERENCE ================= */}

                    <td>

                      <span
  className="reference-badge"
  onClick={() =>
    openReferenceAnalysis(
      item.referenceNumber
    )
  }
>
  {item.referenceNumber}
</span>

                    </td>

                    {/* ================= ASSIGNED EMPLOYEE ================= */}

                    <td>

                      {
                        item.assignedEmployeeName
                      }

                    </td>

                    {/* ================= WORKING STATUS DROPDOWN ================= */}

                    <td>

                      <select
                        className="status-dropdown"
                        value={
                          item.workingStatus ||
                          "Marketing"
                        }
                        onChange={(e) =>
                          handleWorkingStatusChange(
                            item._id,
                            e.target.value
                          )
                        }
                      >

                        {workingStatusOptions.map(
                          (status, index) => (

                            <option
                              key={index}
                              value={status}
                            >

                              {status}

                            </option>

                          )
                        )}

                      </select>

                    </td>

                    {/* ================= SUBMISSION DETAILS LINK ================= */}

                    <td>

  {blockedStatuses.includes(
    item.workingStatus
  ) ? (

    <span
      className="submission-disabled"
    >
      Submission Blocked
    </span>

  ) : (

    <span
      className="reference-link"
      onClick={() =>
        openSubmissionDetails(
          item
        )
      }
    >
      Submission Details
    </span>

  )}

</td>
                    

                    {/* ================= DOWNLOAD BUTTON ================= */}

                    <td>

                      <button
                        className="show-btn"
                        onClick={() =>
                          handleDownload(
                            item._id
                          )
                        }
                      >

                        Download PDF

                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign:
                        "center",

                      padding:
                        "25px",

                      color:
                        "gray",

                      fontWeight:
                        "600",
                    }}
                  >

                    No Candidates Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

}