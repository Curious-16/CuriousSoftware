import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBuilding,
  FaBriefcase,
  FaMoneyBillWave,
  FaSave,
} from "react-icons/fa";


import "./NewEmployeeForm.css";

function NewEmployeeForm() {

  const navigate = useNavigate();

  const initialState = {
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    department: "",
    designation: "",
    salary: "",
  };

  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
const handleSubmit = async () => {

  try {

    const token =
      localStorage.getItem("token");

    console.log(
      "TOKEN:",
      token
    );

    console.log(
      "FORM DATA:",
      form
    );

    

    const res = await axios.post(

      `${API.ADMIN}/add-employee`,

      form,

      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }

    );

    console.log(
      "ADD EMPLOYEE RESPONSE:",
      res.data
    );

    alert(res.data.message);

    navigate("/dashboard");

  } catch (err) {

    console.log(
      "ADD EMPLOYEE ERROR:",
      err.response?.data
    );

    alert(
      err.response?.data?.message ||
      "Something went wrong"
    );

  }

};

  return (

    <div className="form-page">

      {/* BACK BUTTON */}

      <div className="top-back">

        <button
          className="back-btn-top"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          Back
        </button>

      </div>

      {/* HEADER */}

      <div className="form-header">

        <div className="header-icon">
          <FaUser />
        </div>

        <div>
          <h1>Add Employee</h1>

          <p>
            Add a new employee to the organization
          </p>
        </div>

      </div>

      {/* MAIN CARD */}

      <div className="form-container">

        {/* PERSONAL INFORMATION */}

        <div className="form-section">

          <div className="section-top">

            <div className="section-icon personal-icon">
              <FaUser />
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>
                Enter the employee personal details
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* FIRST NAME */}

            <div className="form-field">

              <label>
                First Name <span>*</span>
              </label>

              <div className="input-box">

                <FaUser />

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  placeholder="Enter first name"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* LAST NAME */}

            <div className="form-field">

              <label>
                Last Name <span>*</span>
              </label>

              <div className="input-box">

                <FaUser />

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  placeholder="Enter last name"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="form-field">

              <label>
                Email <span>*</span>
              </label>

              <div className="input-box">

                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Enter email address"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* MOBILE */}

            <div className="form-field">

              <label>
                Mobile Number <span>*</span>
              </label>

              <div className="input-box">

                <FaPhone />

                <input
                  type="text"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  placeholder="Enter mobile number"
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </div>

        {/* DIVIDER */}

        <div className="section-divider"></div>

        {/* EMPLOYMENT INFORMATION */}

        <div className="form-section">

          <div className="section-top">

            <div className="section-icon work-icon">
              <FaBriefcase />
            </div>

            <div>
              <h2>Employment Information</h2>

              <p>
                Enter employee work details
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* EMPLOYEE ID */}

            <div className="form-field">

              <label>
                Employee ID <span>*</span>
              </label>

              <div className="input-box">

                <FaIdCard />

                <input
                  type="text"
                  name="employeeId"
                  value={form.employeeId}
                  placeholder="Enter employee ID"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* DEPARTMENT */}

            <div className="form-field">

              <label>
                Department <span>*</span>
              </label>

              <div className="input-box">

                <FaBuilding />

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">
                    Select department
                  </option>

                  <option value="IT">
                    IT
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="Finance">
                    Finance
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>

                </select>

              </div>

            </div>

            {/* DESIGNATION */}

            <div className="form-field">

              <label>
                Designation <span>*</span>
              </label>

              <div className="input-box">

                <FaBriefcase />

                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  placeholder="Enter designation"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* SALARY */}

            <div className="form-field">

              <label>
                Salary <span>*</span>
              </label>

              <div className="input-box">

                <FaMoneyBillWave />

                <input
                  type="number"
                  name="salary"
                  value={form.salary}
                  placeholder="Enter salary"
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </div>

        {/* BUTTONS */}

        <div className="form-actions">

          <button
            className="cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSubmit}
          >
            
            <FaSave  />
            Save Employee
          </button>

        </div>

      </div>

    </div>
  );
}

export default NewEmployeeForm;