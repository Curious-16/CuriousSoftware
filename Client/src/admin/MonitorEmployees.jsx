// ================= MonitorEmployees.jsx =================

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MonitorEmployees.css";

function MonitorEmployees() {

  const navigate = useNavigate();

  const [monitorData, setMonitorData] =
    useState([]);

  const [filteredData, setFilteredData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  // ================= LOAD MONITOR =================

  const loadMonitor = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          "http://localhost:7001/monitor-employees"
        );

      setMonitorData(res.data);

      const filtered =
        res.data.filter((item) => {

          if (!item.loginTime)
            return false;

          const loginDate =
            new Date(item.loginTime)
              .toISOString()
              .split("T")[0];

          return (
            loginDate ===
            selectedDate
          );

        });

      setFilteredData(filtered);

    } catch (err) {

      console.log(
        "❌ Monitor Error :",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  // ================= INITIAL LOAD =================

  useEffect(() => {

    loadMonitor();

  }, []);

  // ================= FILTER DATE =================

  const filterByDate = () => {

    const filtered =
      monitorData.filter((item) => {

        if (!item.loginTime)
          return false;

        const loginDate =
          new Date(item.loginTime)
            .toISOString()
            .split("T")[0];

        return (
          loginDate ===
          selectedDate
        );

      });

    setFilteredData(filtered);

  };

  // ================= TODAY =================

  const showToday = () => {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    setSelectedDate(today);

    const filtered =
      monitorData.filter((item) => {

        if (!item.loginTime)
          return false;

        const loginDate =
          new Date(item.loginTime)
            .toISOString()
            .split("T")[0];

        return (
          loginDate ===
          today
        );

      });

    setFilteredData(filtered);

  };

  // ================= FORMAT DATE =================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }

    return new Date(date)
      .toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      );

  };

  return (

    <div className="monitor-page">

      {/* ================= HEADER ================= */}

      <div className="monitor-header">

        <div>

          <h1>
            Employee Monitor
          </h1>

          <p>
            Employee Login &
            Logout Tracking
          </p>

        </div>

        <div className="header-buttons">

          <button
            className="refresh-btn"
            onClick={loadMonitor}
          >
            🔄 Refresh
          </button>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back
          </button>

        </div>

      </div>

      {/* ================= FILTER ================= */}

      <div className="filter-bar">

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value
            )
          }
        />

        <button
          className="filter-btn"
          onClick={filterByDate}
        >
          Filter
        </button>

        <button
          className="today-btn"
          onClick={showToday}
        >
          Today
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="monitor-table-wrapper">

        {loading ? (

          <div className="loading">
            Loading Monitor Data...
          </div>

        ) : (

          <table className="monitor-table">

            <thead>

              <tr>

                <th>
                  Employee ID
                </th>

                <th>
                  Employee Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Login Time
                </th>

                <th>
                  Logout Time
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map(
                  (item) => (

                    <tr
                      key={item._id}
                    >

                      <td>
                        {
                          item.employeeId
                        }
                      </td>

                      <td>
                        {
                          item.firstName
                        }{" "}
                        {
                          item.lastName
                        }
                      </td>

                      <td>
                        {item.email}
                      </td>

                      <td>
                        {formatDate(
                          item.loginTime
                        )}
                      </td>

                      <td>
                        {item.logoutTime
                          ? formatDate(
                              item.logoutTime
                            )
                          : "-"}
                      </td>

                      <td>

                        <span
                          className={
                            item.status ===
                            "Online"
                              ? "online-status"
                              : "offline-status"
                          }
                        >

                          {item.status ===
                          "Online"
                            ? "🟢 Online"
                            : "🔴 Offline"}

                        </span>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                      fontWeight:
                        "600"
                    }}
                  >

                    No Monitor Data Found

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

export default MonitorEmployees;