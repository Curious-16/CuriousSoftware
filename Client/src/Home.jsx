import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaUserShield,
  FaUserTie,
  FaClock,
  FaUsers,
  FaChartBar,
  FaShieldAlt,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* ===== NAVBAR ===== */}
      <div className="navbar">
        <div className="logo-box">
          <div className="logo-icon">B</div>
          <h2 className="nav-logo">BEADS</h2>
        </div>

        <div className="nav-links">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/contact")}>Contact</span>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-wrapper">

        {/* TOP TAG */}
        <div className="top-badge">
          <span className="dot"></span>
          Employee Management Platform
        </div>

        {/* TITLE */}
        <h1 className="brand-name">BEADS</h1>
        <h2 className="brand-sub">Software Solution</h2>

        <p className="brand-desc">
          Smart platform to manage employees,
          candidates, and business operations efficiently.
        </p>

        {/* LOGIN CARDS */}
        <div className="portal-wrapper">

          {/* ADMIN */}
          <div
            className="login-box"
            onClick={() => navigate("/adminlogin")}
          >
            <div className="icon-box">
              <FaUserShield className="icon" />
            </div>

            <span className="small-title">FOR MANAGEMENT</span>

            <h3>Admin Portal</h3>

            <p>
              Manage employees, data and
              system control
            </p>

            <button>
              Login as Admin →
            </button>
          </div>

          {/* EMPLOYEE */}
          <div
            className="login-box"
            onClick={() => navigate("/employeeslogin")}
          >
            <div className="icon-box">
              <FaUserTie className="icon" />
            </div>

            <span className="small-title">FOR STAFF</span>

            <h3>Employee Portal</h3>

            <p>
              Access dashboard and manage
              your work
            </p>

            <button className="outline-btn">
              Login as Employee →
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div className="features">

          <div className="feature">
            <div className="feature-icon">
              <FaClock />
            </div>
            <span>24/7 Access</span>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <span>Team Management</span>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <FaChartBar />
            </div>
            <span>Analytics</span>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <span>Verified Secure</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;