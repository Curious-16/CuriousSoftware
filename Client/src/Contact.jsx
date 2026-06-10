import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

import "./Contact.css";

function Contact() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    query: ""
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:7001/api/contactus",
        form
      );

      if (res.data.success) {

        alert("Query sent successfully ✅");

        setForm({
          name: "",
          email: "",
          query: ""
        });

      } else {

        alert("Failed to send query ❌");

      }

    } catch (err) {

      console.log(err);

      alert("Something went wrong ❌");

    }

    setLoading(false);

  };

  // ================= CANCEL =================

  const handleCancel = () => {

    navigate("/");

  };

  return (

    <div className="contact-page">

      <div className="contact-card">

        {/* TOP ICON */}

        <div className="contact-icon">
          <FaEnvelope />
        </div>

        {/* HEADING */}

        <h1>Contact Admin</h1>

        <p className="contact-sub">
          Need help? Send your query to the admin team.
        </p>

        {/* FORM */}

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="input-box">

            <FaUser className="input-icon" />

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* EMAIL */}

          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* QUERY */}

          <textarea
            name="query"
            placeholder="Enter your query..."
            value={form.query}
            onChange={handleChange}
            required
          />

          {/* BUTTONS */}

          <div className="button-group">

            <button type="submit">

              <FaPaperPlane />

              {loading
                ? "Sending..."
                : "Submit"}

            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default Contact;