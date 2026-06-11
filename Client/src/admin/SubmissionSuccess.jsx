import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import "./SubmissionSuccess.css";
import { API } from "../api";

const SubmissionSuccess = () => {

  // ================= GET DATA =================
  const data = JSON.parse(
    localStorage.getItem("submissionData")
  );

  console.log(
    "🔥 Submission Data :",
    data
  );

  const [employees, setEmployees] =
    useState([]);

  const [
    selectedEmployee,
    setSelectedEmployee
  ] = useState("");

  const [sending, setSending] =
    useState(false);

  // ================= LOAD EMPLOYEES =================
  useEffect(() => {

    const fetchEmployees =
      async () => {

        try {

          const res =
            await axios.get(
              `${API.ADMIN}/employees`
            );

          const activeEmployees =
            res.data.filter(
              (emp) =>
                emp.activated === true &&
                emp.status === "active"
            );

          console.log(
            "✅ Employees :",
            activeEmployees
          );

          setEmployees(
            activeEmployees
          );

        } catch (err) {

          console.log(
            "❌ Employee Fetch Error :",
            err
          );

        }

      };

    fetchEmployees();

  }, []);

  // ================= ASSIGN =================
  const handleSend =
    async () => {

      if (!selectedEmployee) {

        return alert(
          "Please Select Employee"
        );

      }

      // 🔥 IMPORTANT FIX
      if (!data?._id) {

        console.log(
          "❌ Missing Candidate ID"
        );

        return alert(
          "Candidate ID Missing"
        );

      }

      try {

        setSending(true);

        const payload = {

          employeeId:
            selectedEmployee

        };

        console.log(
          "📤 Sending Payload :",
          payload
        );

        // 🔥 FIXED URL
        const res =
          await axios.post(

            `${API.CANDIDATE}/assign-candidate/${data._id}`,

            payload

          );

        console.log(
          "✅ Assigned :",
          res.data
        );

        alert(
          "Candidate Assigned Successfully 🎉"
        );

      } catch (err) {

        console.log(
          "❌ Assignment Error :",
          err
        );

        alert(
          "Assignment Failed"
        );

      } finally {

        setSending(false);

      }

    };

  // ================= DOWNLOAD =================
  const handleDownload =
    async () => {

      try {

        if (!data?._id) {

          return alert(
            "Candidate ID Missing"
          );

        }

        window.open(

          `${API.CANDIDATE}/download-candidate/${data._id}`,

          "_blank"

        );

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="success-page">

      <div className="card">

        <h2>
          Submission Successful 🎉
        </h2>

        <p>
          <b>Name:</b>{" "}
          {data?.fullName || "N/A"}
        </p>

        <p>
          <b>Technology:</b>{" "}
          {data?.technology || "N/A"}
        </p>

        <p>
          <b>Department:</b>{" "}
          {data?.department || "N/A"}
        </p>

        <p>
          <b>Reference:</b>{" "}
          {data?.referenceNumber || "N/A"}
        </p>

        {/* ================= EMPLOYEE ================= */}

        <div className="dropdown">

          <label>
            Assign Employee
          </label>

          <select

            value={
              selectedEmployee
            }

            onChange={(e) =>
              setSelectedEmployee(
                e.target.value
              )
            }

          >

            <option value="">
              Select Employee
            </option>

            {employees.map(
              (emp) => (

                <option

                  key={emp._id}

                  value={
                    emp.employeeId
                  }

                >

                  {
                    emp.firstName
                  }{" "}

                  {
                    emp.lastName
                  }

                  {" "}

                  (
                  {
                    emp.employeeId
                  }
                  )

                </option>

              )
            )}

          </select>

        </div>

        {/* ================= BUTTONS ================= */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px"
          }}
        >

          <button

            className="send-btn"

            onClick={
              handleSend
            }

            disabled={sending}

          >

            {sending
              ? "Sending..."
              : "Assign Employee"}

          </button>

          <button

            className="send-btn"

            onClick={
              handleDownload
            }

          >

            Download Form

          </button>

        </div>

      </div>

    </div>

  );

};

export default SubmissionSuccess;