// ================= EmployeesLogin.jsx =================

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { API } from "../api";

import {
  FaUser,
  FaLock,
  FaArrowRight,
  FaBorderAll,
  FaFileAlt,
  FaShieldAlt,
  FaUsers,
  FaRegEye,
} from "react-icons/fa";

import "./EmployeesLogin.css";

function EmployeesLogin() {

  const navigate = useNavigate();

  const [employeeId, setEmployeeId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ================= LOGIN =================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        setError("");

        const res =
          await axios.post(

            `${API.ADMIN}/employee/login`,

            {
              employeeId,
              password,
            }

          );

        if (res.data.success) {

          localStorage.setItem(
            "employee",
            JSON.stringify(
              res.data.employee
            )
          );

          navigate("/candidates");

        }

      } catch (err) {

        setError(

          err.response?.data?.message ||

          "Login Failed"

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="employee-login-page">

      {/* ===== LEFT SIDE ===== */}

      <div className="employee-left">

        {/* BADGE */}

        <div className="employee-badge">

          <FaUser />

          <span>
            Employee Portal
          </span>

        </div>

        {/* TITLE */}

        <h1>

          Welcome to <br />

          <span>
            Employee Portal.
          </span>

        </h1>

        {/* DESCRIPTION */}

        <p className="employee-desc">

          View assigned tasks,
          manage candidate records,
          <br />

          and track recruitment
          activities efficiently.

        </p>

        {/* FEATURES */}

        <div className="feature-list">

          {/* FEATURE 1 */}

          <div className="feature-item">

            <div className="feature-icon">
              <FaBorderAll />
            </div>

            <div>

              <h3>
                My Dashboard
              </h3>

              <p>

                Access daily work
                updates, assigned
                tasks, and notifications.

              </p>

            </div>

          </div>

          {/* FEATURE 2 */}

          <div className="feature-item">

            <div className="feature-icon">
              <FaFileAlt />
            </div>

            <div>

              <h3>
                Candidate Management
              </h3>

              <p>

                Review candidate
                profiles, update
                status, and download reports.

              </p>

            </div>

          </div>

        </div>

        {/* BOTTOM LINE */}

        <div className="bottom-line"></div>

        {/* BOTTOM TAGS */}

        <div className="bottom-tags">

          <span>
            <FaShieldAlt />
            Task Tracking
          </span>

          <span>•</span>

          <span>
            <FaUsers />
            Candidate Access
          </span>

          <span>•</span>

          <span>
            <FaShieldAlt />
            Secure Workspace
          </span>

        </div>

        {/* COPYRIGHT */}

        <p className="copyright">

          © 2024 BEADS.
          All rights reserved.

        </p>

      </div>

      {/* ===== RIGHT SIDE ===== */}

      <div className="employee-right">

        <div className="login-card">

          {/* ICON */}

          <div className="login-icon">

            <FaUser />

          </div>

          {/* TITLE */}

          <h2>
            Employee Login
          </h2>

          <p className="login-sub">

            Please sign in to continue

          </p>

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMPLOYEE ID */}

            <label>
              Employee ID
            </label>

            <div className="input-box">

              <FaUser className="input-icon" />

              <input

                type="text"

                placeholder="Enter your employee ID"

                value={employeeId}

                onChange={(e)=>
                  setEmployeeId(
                    e.target.value
                  )
                }

                required

              />

            </div>

            {/* PASSWORD */}

            <label>
              Password
            </label>

            <div className="input-box">

              <FaLock className="input-icon" />

              <input

                type="password"

                placeholder="Enter your password"

                value={password}

                onChange={(e)=>
                  setPassword(
                    e.target.value
                  )
                }

                required

              />

              <FaRegEye className="eye-icon" />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Logging In..."
                : "Login"}

              <FaArrowRight />

            </button>

          </form>

          {/* ERROR */}

          {error && (

            <p className="error-text">

              {error}

            </p>

          )}

        </div>

      </div>

    </div>

  );

}

export default EmployeesLogin;