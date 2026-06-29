import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Signup.css";
import { API } from "../api";

function Signup() {

  const {
  employeeId,
  companyCode
} = useParams();
  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [activated, setActivated] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!employeeId || !companyCode)
      return;

    axios
      .get(
        `${API.ADMIN}/signup-employee/${employeeId}/${companyCode}`
      )
      .then((res) => {

        setActivated(
          res.data.activated || false
        );

      })
      .catch((err) => {

        console.log(
          err.response?.data || err.message
        );

        setMessage(
          "Employee Not Found"
        );

      });

  }, [
    employeeId,
    companyCode
  ]);

  const handleSubmit = async () => {

    if (!password.trim()) {

      setMessage(
        "Password cannot be empty"
      );

      return;

    }

    try {

      setLoading(true);

     const res = await axios.post(
  `${API.ADMIN}/set-password`,
  {
    employeeId,
    password,
    companyCode
  }
);

      setMessage(
        res.data.message
      );

      setActivated(true);

      setPassword("");

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );

      setMessage(
        err.response?.data?.message ||
        "Password Setup Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="signup-container">

      <div
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >

        <h2>
          Account Setup
        </h2>

        <h3>
          Employee:
          {" "}
          {employeeId}
        </h3>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button
          onClick={handleSubmit}
          disabled={loading}
        >

          {loading
            ? "Processing..."
            : activated
            ? "Reset Password"
            : "Set Password"}

        </button>

        <p>{message}</p>

      </div>

    </div>

  );

}

export default Signup;