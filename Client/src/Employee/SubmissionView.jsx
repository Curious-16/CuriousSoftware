import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./SubmissionView.css";

export default function SubmissionView() {

  const location = useLocation();

  const data = location.state?.submission;

  // ================= PAGE STATE =================

  const [activePage, setActivePage] =
    useState("dashboard");

  // ================= RATE FIX =================

  const rate =
    parseInt(
      data?.rate?.replace(/\$/g, "")
    ) || 0;

  // ================= ANALYSIS =================

  const submissionScore =
    data?.submission ? 95 : 20;

  const vendorScore =
    data?.vendor ? 88 : 30;

  const interviewScore =
    data?.interviewType ? 82 : 25;

  const recruiterScore =
    data?.recruiter ? 75 : 20;

  const profileCompletion =
    Math.round(

      (
        [
          data?.candidateName,
          data?.jobTitle,
          data?.vendor,
          data?.recruiter,
          data?.email,
          data?.phone,
          data?.interviewType,
          data?.location,
        ].filter(Boolean).length / 8
      ) * 100

    );

  const rateLevel =
    rate >= 70
      ? "High"
      : rate >= 40
      ? "Medium"
      : "Low";

  return (

    <div className="analysis-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div className="analysis-sidebar">

        <h2 className="analysis-logo">
          PT Dashboard
        </h2>

        <ul className="analysis-menu">

          <li
            className={
              activePage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "dashboard"
              )
            }
          >
            Dashboard
          </li>

          <li
            className={
              activePage === "analytics"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "analytics"
              )
            }
          >
            Submission Analytics
          </li>

        </ul>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="analysis-content">

        {/* =====================================================
            DASHBOARD PAGE
        ===================================================== */}

        {
          activePage === "dashboard" && (

            <>

              <div className="analysis-header">

                <div>

                  <h1>
                    Dashboard Home
                  </h1>

                  <p>
                    Recruitment dashboard overview
                  </p>

                </div>

              </div>

            </>

          )
        }

        {/* =====================================================
            SUBMISSION ANALYTICS PAGE
        ===================================================== */}

        {
          activePage === "analytics" && (

            <>

              {/* HEADER */}

              <div className="analysis-header">

                <div>

                  <h1>
                    Submission Intelligence
                  </h1>

                  <p>
                    AI-based submission analysis dashboard
                  </p>

                </div>

              </div>

              {/* ANALYSIS CARDS */}

              <div className="analysis-cards">

                <div className="analysis-card">

                  <h2>
                    Profile Completion
                  </h2>

                  <h3>
                    {profileCompletion}%
                  </h3>

                  <span>
                    Candidate profile strength
                  </span>

                </div>

                <div className="analysis-card">

                  <h2>
                    Submission Status
                  </h2>

                  <h3>
                    {
                      data?.submission
                        ? "Submitted"
                        : "Pending"
                    }
                  </h3>

                  <span>
                    Current submission state
                  </span>

                </div>

                <div className="analysis-card">

                  <h2>
                    Offered Rate
                  </h2>

                  <h3>
                    ${rate}/hr
                  </h3>

                  <span>
                    {rateLevel} Budget Level
                  </span>

                </div>

                <div className="analysis-card">

                  <h2>
                    Interview Readiness
                  </h2>

                  <h3>
                    {interviewScore}%
                  </h3>

                  <span>
                    Candidate preparation score
                  </span>

                </div>

              </div>

              {/* CHARTS */}

              <div className="chart-grid">

                {/* PERFORMANCE CHART */}

                <div className="chart-card">

                  <h2>
                    Submission Performance Metrics
                  </h2>

                  <div className="bar-chart">

                    <div
                      className="bar"
                      style={{
                        height:
                          `${submissionScore}%`
                      }}
                    >
                      <span>
                        Submission
                      </span>
                    </div>

                    <div
                      className="bar"
                      style={{
                        height:
                          `${vendorScore}%`
                      }}
                    >
                      <span>
                        Vendor
                      </span>
                    </div>

                    <div
                      className="bar"
                      style={{
                        height:
                          `${interviewScore}%`
                      }}
                    >
                      <span>
                        Interview
                      </span>
                    </div>

                    <div
                      className="bar"
                      style={{
                        height:
                          `${recruiterScore}%`
                      }}
                    >
                      <span>
                        Recruiter
                      </span>
                    </div>

                    <div
                      className="bar"
                      style={{
                        height:
                          `${profileCompletion}%`
                      }}
                    >
                      <span>
                        Profile
                      </span>
                    </div>

                  </div>

                </div>

                {/* QUALITY INDEX */}

                <div className="chart-card">

                  <h2>
                    Candidate Quality Index
                  </h2>

                  <div className="progress-circle">

                    <div className="circle-inner">

                      <h3>
                        {profileCompletion}%
                      </h3>

                      <p>
                        Quality
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =====================================================
                  HORIZONTAL DETAILS SECTION
              ===================================================== */}

              <div className="submission-details-card">

                <h2 className="details-title">
                  Candidate Submission Report
                </h2>

                <div className="horizontal-details">

                  <div className="horizontal-card">
                    <span>Candidate Name</span>
                    <p>{data?.candidateName}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Job Title</span>
                    <p>{data?.jobTitle}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Submission</span>
                    <p>{data?.submission}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Vendor</span>
                    <p>{data?.vendor}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Recruiter</span>
                    <p>{data?.recruiter}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Interview Type</span>
                    <p>{data?.interviewType}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Rate</span>
                    <p>${rate}/hr</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Location</span>
                    <p>{data?.location}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Email</span>
                    <p>{data?.email}</p>
                  </div>

                  <div className="horizontal-card">
                    <span>Phone</span>
                    <p>{data?.phone}</p>
                  </div>

                </div>

              </div>

            </>

          )
        }

      </div>

    </div>

  );

}