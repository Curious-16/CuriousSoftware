import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./AdminDashboard.css";
import { API } from "../api";

function AdminDashboard() {

  const [employees, setEmployees] = useState([]);
  const [loginStatus, setLoginStatus] = useState({});
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ================= LOAD EMPLOYEES =================

  const loadEmployees = async () => {

    try {

      const res = await axios.get(
        `${API.ADMIN}/employees`
      );

      setEmployees(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // ================= LOAD LOGIN STATUS =================

  const loadLoginStatus = async () => {

    try {

      const res = await axios.get(
                `${API.ADMIN}/today-login-status`
      );

      setLoginStatus(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // ================= INITIAL LOAD =================

  useEffect(() => {

    loadEmployees();
    loadLoginStatus();

  }, []);

  // ================= INVITE =================

  const handleInvite = async (emp) => {

    try {

      const res = await axios.post(
                `${API.ADMIN}/invite`,
        {
          email: emp.email,
          employeeId: emp.employeeId,
          firstName: emp.firstName,
        }
      );

      alert(res.data.message);

    } catch {

      alert("Invite Failed");

    }

  };

  // ================= TOGGLE STATUS =================

  const toggleStatus = async (id) => {

    try {

      await axios.put(
                `${API.ADMIN}/toggle-status/${id}`
      );

      loadEmployees();

    } catch (err) {

      console.log(err);

    }

  };

  // ================= STATS =================

  const total = employees.length;

  const active = employees.filter(
    (e) => e.status === "active"
  ).length;

  const inactive = employees.filter(
    (e) => e.status !== "active"
  ).length;

  const pending = employees.filter(
    (e) => !e.activated
  ).length;

  // ================= BAR CHART =================

  const barData = {
    labels: ["Active", "Inactive", "Pending"],
    datasets: [
      {
        label: "Employees",
        data: [active, inactive, pending],
        backgroundColor: [
          "#2563eb",
          "#ef4444",
          "#f59e0b",
        ],
        borderRadius: 8,
      },
    ],
  };

  // ================= DOUGHNUT =================

  const doughnutData = {
    labels: ["Active", "Inactive", "Pending"],
    datasets: [
      {
        data: [active, inactive, pending],
        backgroundColor: [
          "#2563eb",
          "#ef4444",
          "#f59e0b",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (

    <div className="layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <h2
          className="logo"
          style={{ color: "black" }}
        >
          Admin Panel
        </h2>

        <div className="nav">

          <div
            className={`nav-item ${
              location.pathname === "/dashboard"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/")}
          >
            🏠 Home
          </div>

          <div
            className={`nav-item ${
              location.pathname === "/add"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/add")}
          >
            ➕ Add Employee
          </div>

          <div
            className={`nav-item ${
              location.pathname ===
              "/CandidateRecruitmentForm"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate(
                "/CandidateRecruitmentForm"
              )
            }
          >
            📄 Recruitment Form
          </div>

          <div
            className={`nav-item ${
              location.pathname ===
              "/admin/queries"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("/admin/queries")
            }
          >
            ❓ Queries
          </div>

          <div
            className={`nav-item ${
              location.pathname ===
              "/monitor"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("/monitor")
            }
          >
            🟢 Monitor Employees
          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <div className="main">

        <div className="topbar">

          <h2>Employee Dashboard</h2>

          <button
            className="add-btn"
            onClick={() =>
              navigate("/add")
            }
          >
            + Add Employee
          </button>

        </div>

        {/* ================= CARDS ================= */}

        <div className="cards">

          <div className="card">
            <h4>Total Employees</h4>
            <p>{total}</p>
          </div>

          <div className="card">
            <h4>Active</h4>
            <p>{active}</p>
          </div>

          <div className="card">
            <h4>Inactive</h4>
            <p>{inactive}</p>
          </div>

          <div className="card">
            <h4>Pending</h4>
            <p>{pending}</p>
          </div>

        </div>

        {/* ================= CHARTS ================= */}

        <div className="charts">

          <div className="chart-box small-chart">

            <h4>Status Overview</h4>

            <div className="chart-inner">

              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />

            </div>

          </div>

          <div className="chart-box small-chart">

            <h4>Distribution</h4>

            <div className="chart-inner doughnut">

              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "65%",
                }}
              />

            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Activation</th>
                <th>Login Status</th>
                {/* <th>Employee Status</th> */}
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {employees.map((emp) => (

                <tr key={emp._id}>

                  <td>{emp.employeeId}</td>

                  <td>
                    {emp.firstName}{" "}
                    {emp.lastName}
                  </td>

                  <td>{emp.email}</td>

                  {/* Activation */}

                  <td>

                    {emp.activated ? (

                      <span className="status-active">
                        Activated
                      </span>

                    ) : (

                      <span className="status-pending">
                        Pending
                      </span>

                    )}

                  </td>

                  {/* Login Status */}

                  <td>

                    {loginStatus[
                      emp.employeeId
                    ] === "Online" ? (

                      <span className="login-online">
                        🟢 Logged In
                      </span>

                    ) : (

                      <span className="login-offline">
                        🔴 Not Logged In
                      </span>

                    )}

                  </td>

                  {/* Employee Status */}

                  {/* <td>

                    {emp.status ===
                    "active" ? (

                      <span className="status-active">
                        Active
                      </span>

                    ) : (

                      <span className="status-inactive">
                        Inactive
                      </span>

                    )}

                  </td> */}

                  {/* Actions */}

                  <td className="actions">

                    <div className="menu-wrapper">

                      <button
                        className="three-dot-btn"
                        onClick={() =>
                          setOpenMenu(
                            openMenu ===
                              emp._id
                              ? null
                              : emp._id
                          )
                        }
                      >
                        ⋮
                      </button>

                      {openMenu ===
                        emp._id && (

                        <div className="dropdown-menu">

                          <button
                            onClick={() => {
                              handleInvite(
                                emp
                              );
                              setOpenMenu(
                                null
                              );
                            }}
                          >
                            📧 Invite
                          </button>

                          <button
                            onClick={() => {
                              navigate(
                                `/edit/${emp._id}`
                              );
                              setOpenMenu(
                                null
                              );
                            }}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() => {
                              toggleStatus(
                                emp._id
                              );
                              setOpenMenu(
                                null
                              );
                            }}
                          >
                            {emp.status ===
                            "active"
                              ? "🚫 Deactivate"
                              : "✅ Activate"}
                          </button>

                        </div>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;