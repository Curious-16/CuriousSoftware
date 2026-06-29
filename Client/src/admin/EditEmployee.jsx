// ================= EditEmployee.jsx =================

import { useParams, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import axios from "axios";

import "./EditEmployee.css";
import { API } from "../api";

function EditEmployee() {

  const { id } = useParams();

  const navigate = useNavigate();

  // ================= FORM STATE =================

  const [form, setForm] = useState({

    employeeId: "",

    firstName: "",

    lastName: "",

    email: "",

  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ================= LOAD EMPLOYEE DATA =================

  useEffect(() => {

    const fetchEmployee =
      async () => {

        try {

          const token =
  localStorage.getItem("token");

const res =
  await axios.get(
    `${API.ADMIN}/employee/${id}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

          console.log(
            "✅ Employee Data :",
            res.data
          );

          // ================= SET EXISTING DATA =================

          setForm({

            employeeId:
              res.data.employeeId || "",

            firstName:
              res.data.firstName || "",

            lastName:
              res.data.lastName || "",

            email:
              res.data.email || "",

          });

        } catch (err) {

          console.log(
            "❌ Fetch Error :",
            err
          );

          setError(
            err.response?.data?.message ||
              "Failed To Load Employee"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchEmployee();

  }, [id]);

  // ================= HANDLE INPUT =================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };

  // ================= UPDATE EMPLOYEE =================

  const updateEmployee =
    async () => {

      try {

        setError("");

        const token =
  localStorage.getItem("token");

const res =
  await axios.put(
    `${API.ADMIN}/update-employee/${id}`,
    form,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

        alert(
          res.data.message
        );

        navigate("/dashboard");

      } catch (err) {

        console.log(
          "❌ Update Error :",
          err
        );

        setError(

          err.response?.data
            ?.message ||
            "Update Failed"

        );

      }

    };

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="form-container">

        <h2>
          Loading Employee...
        </h2>

      </div>

    );

  }

  return (

    <div className="form-container">

      <div className="edit-card">

        <h2>
          Edit Employee
        </h2>

        {/* ================= EMPLOYEE ID ================= */}

        <div className="input-group">

          <label>
            Employee ID
          </label>

          <input
            type="text"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            placeholder="Enter Employee ID"
          />

        </div>

        {/* ================= FIRST NAME ================= */}

        <div className="input-group">

          <label>
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter First Name"
          />

        </div>

        {/* ================= LAST NAME ================= */}

        <div className="input-group">

          <label>
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter Last Name"
          />

        </div>

        {/* ================= EMAIL ================= */}

        <div className="input-group">

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
          />

        </div>

        {/* ================= UPDATE BUTTON ================= */}

        <button
          className="update-btn"
          onClick={updateEmployee}
        >

          Update Employee

        </button>

        {/* ================= ERROR ================= */}

        {error && (

          <p className="error-text">

            {error}

          </p>

        )}

      </div>

    </div>

  );

}

export default EditEmployee;