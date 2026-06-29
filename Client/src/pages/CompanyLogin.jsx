import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CompanyLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:7001/api/company/login",
        {
          email,
          password
        }
      );

      console.log(res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "company",
        JSON.stringify(
          res.data.company
        )
      );

      navigate("/company-home");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (
    <div>

      <h2>Company Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );

}

export default CompanyLogin;