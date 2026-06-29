import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [stats, setStats] = useState({});

  useEffect(() => {

    axios
      .get(
        "http://localhost:7001/dashboard/superadmin"
      )
      .then((res) => {

        setStats(res.data);

      });

  }, []);

  return (
    <div className="container mt-4">

      <h2>Super Admin Dashboard</h2>

      <div className="row">

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Companies</h5>
            <h2>{stats.totalCompanies}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Employees</h5>
            <h2>{stats.totalEmployees}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Candidates</h5>
            <h2>{stats.totalCandidates}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Submissions</h5>
            <h2>{stats.totalSubmissions}</h2>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;