import { useEffect, useState } from "react";
import axios from "axios";

function Companies() {

  const [companies, setCompanies] =
    useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:7001/companies")
      .then((res) => {

        setCompanies(res.data);

      });

  }, []);

  return (
    <div>

      <h2>Companies</h2>

      <table>

        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Plan</th>
          </tr>
        </thead>

        <tbody>

          {companies.map((c) => (

            <tr key={c._id}>
              <td>{c.companyCode}</td>
              <td>{c.companyName}</td>
              <td>{c.plan}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Companies;