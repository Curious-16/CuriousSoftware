import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Signup.css";
import { API } from "../api";

function Signup() {
  const { employeeId } = useParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);


  // 🔍 Fetch employee details
  useEffect(() => {
    if (!employeeId) return;

    axios
      .get(`${API.ADMIN}/employee/${employeeId}`)
      .then((res) => {
        setActivated(res.data.activated);
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
        setMessage("Failed to load employee data");
      });
  }, [employeeId]);

  // 🔐 Set / Reset password
  const handleSubmit = async () => {
    if (!password.trim()) {
      setMessage("Password cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API.ADMIN}/set-password`, {
        employeeId,
        password,
      });

      setMessage(res.data.message || "Password updated successfully");
      setActivated(true);
      setPassword("");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Account Setup - {employeeId}</h2>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={activated ? "reset" : ""}
        >
          {loading
            ? "Processing..."
            : !activated
            ? "Set Password"
            : "Reset Password"}
        </button>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default Signup;