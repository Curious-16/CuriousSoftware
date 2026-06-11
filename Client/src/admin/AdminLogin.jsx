import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaLock,
  FaArrowRight,
  FaUsers,
  FaChartBar,
  FaShieldAlt,
  FaRegEye,
} from "react-icons/fa";

import "./AdminLogin.css";

function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {

      setLoading(true);

      // const res = await axios.post(
      //   "http://localhost:7001/admin/login",
      //   {
      //     username,
      //     password,
      //   }
      // );

       const res = await axios.post(
        "https://curioussoftware-2.onrender.com/admin/login",
        {
          username,
          password,
        }
      );

      if (res.data.success) {
        navigate("/dashboard");
      } else {
        alert("Invalid Login");
      }

    } catch (err) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="admin-login-page">

      {/* ===== LEFT SIDE ===== */}

      <div className="admin-left">

        <div className="admin-badge">
          <FaShieldAlt />
          <span>Admin Portal</span>
        </div>

        <h1>
          Secure access to <br />
          <span>Admin Portal.</span>
        </h1>

        <p className="admin-desc">
          Manage employees, operations, and business
          data securely and efficiently.
        </p>

        {/* FEATURES */}

        <div className="feature-list">

          <div className="feature-item">

            <div className="feature-icon">
              <FaUsers />
            </div>

            <div>
              <h3>Employee Management</h3>

              <p>
                Add, update and manage employee
                information with ease.
              </p>
            </div>

          </div>

          <div className="feature-item">

            <div className="feature-icon">
              <FaChartBar />
            </div>

            <div>
              <h3>Analytics Dashboard</h3>

              <p>
                Real-time insights and reports to make
                smarter business decisions.
              </p>
            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="bottom-line"></div>

        <div className="bottom-tags">
          <span>🛡 Secure</span>
          <span>•</span>
          <span>🎯 Reliable</span>
          <span>•</span>
          <span>⭐ Enterprise Grade</span>
        </div>

        <p className="copyright">
          © 2024 BEADS. All rights reserved.
        </p>

      </div>

      {/* ===== RIGHT SIDE ===== */}

      <div className="admin-right">

        <div className="login-card">

          <div className="login-icon">
            <FaUser />
          </div>

          <h2>Admin Login</h2>

          <p className="login-sub">
            Please sign in to continue
          </p>

          {/* USERNAME */}

          <label>Username</label>

          <div className="input-box">

            <FaUser className="input-icon" />

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />

          </div>

          {/* PASSWORD */}

          <label>Password</label>

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <FaRegEye className="eye-icon" />

          </div>

          {/* BUTTON */}

          <button onClick={handleLogin}>

            {loading ? "Logging in..." : "Login"}

            <FaArrowRight />

          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;