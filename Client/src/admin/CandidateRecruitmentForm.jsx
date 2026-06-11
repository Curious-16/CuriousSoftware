// ================= CandidateRecruitmentForm.jsx =================

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CandidateRecruitmentForm.css";
import { API } from "../api";

const CandidateRecruitmentForm = () => {

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // ================= GET CANDIDATE =================
  const storedData = JSON.parse(
    localStorage.getItem("selectedCandidate")
  );

  // because API returns { candidate : {} }
  const storedCandidate =
    storedData?.candidate || storedData || {};

  console.log("🔥 Stored Candidate :", storedCandidate);

  // ================= FORM STATE =================
  const [formData, setFormData] = useState({

    fullName:
      storedCandidate?.fullName ||
      storedCandidate?.name ||
      storedCandidate?.candidateName ||
      "",

    location:
      storedCandidate?.location || "",

    phone:
      storedCandidate?.phone || "",

    email:
      storedCandidate?.email || "",

    ssnLast4:
      storedCandidate?.ssnLast4 || "",

    workAuth:
      storedCandidate?.workAuth || "",

    visaValidity:
      storedCandidate?.visaValidity || "",

    dob:
      storedCandidate?.dob || "",

    skypeId:
      storedCandidate?.skypeId || "",

    hangout:
      storedCandidate?.hangout || "",

    totalITExp:
      storedCandidate?.totalITExp || "",

    totalUSExp:
      storedCandidate?.totalUSExp || "",

    education:
      storedCandidate?.education || "",

    university:
      storedCandidate?.university || "",

    passingYear:
      storedCandidate?.passingYear || "",

    passportNumber:
      storedCandidate?.passportNumber || "",

    linkedin:
      storedCandidate?.linkedin || "",

    certification:
      storedCandidate?.certification || "",

    submissionDate:
      storedCandidate?.submissionDate || "",

    interviewDate:
      storedCandidate?.interviewDate || "",

    shortlistDate:
      storedCandidate?.shortlistDate || "",

    joiningDate:
      storedCandidate?.joiningDate || "",

    vendorName:
      storedCandidate?.vendorName || "",

    vendorPhone:
      storedCandidate?.vendorPhone || "",

    vendorEmail:
      storedCandidate?.vendorEmail || "",

    vendorAddress:
      storedCandidate?.vendorAddress || "",

    vendorWebsite:
      storedCandidate?.vendorWebsite || "",

    vendorContact:
      storedCandidate?.vendorContact || "",

    technology:
      storedCandidate?.technology || "",

    department:
      storedCandidate?.department || "",

    referenceNumber:
      storedCandidate?.referenceNumber || ""

  });

  // ================= REFERENCES =================
  const [hasReference, setHasReference] = useState(
    storedCandidate?.references?.length > 0
      ? "yes"
      : "no"
  );

  const [references, setReferences] = useState(
    storedCandidate?.references || [
      {
        name: "",
        company: "",
        project: "",
        designation: "",
        phone: "",
        email: ""
      }
    ]
  );

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  // ================= ENTER NEXT =================
  const handleKeyDown = (e, index) => {

    if (e.key === "Enter") {

      e.preventDefault();

      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }

    }

  };

  // ================= REFERENCES =================
  const handleReferenceChange = (
    index,
    field,
    value
  ) => {

    const updated = [...references];

    updated[index][field] = value;

    setReferences(updated);

  };

  const addReference = () => {

    setReferences([
      ...references,
      {
        name: "",
        company: "",
        project: "",
        designation: "",
        phone: "",
        email: ""
      }
    ]);

  };

  const removeReference = (index) => {

    const updated = references.filter(
      (_, i) => i !== index
    );

    setReferences(updated);

  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {

        ...formData,

        references:
          hasReference === "yes"
            ? references
            : []

      };

      console.log("📤 Payload :", payload);

      const res = await axios.post(
                `${API.CANDIDATE}/save-candidate-form`,
        payload
      );

      console.log("✅ Submitted :", res.data);

      localStorage.setItem(
        "submissionData",
        JSON.stringify(res.data.data)
      );

      localStorage.removeItem(
        "selectedCandidate"
      );

      alert("Form Submitted Successfully");

      navigate("/submission-success");

    } catch (err) {

      console.log("❌ Submit Error :", err);

      alert("Failed To Submit");

    }

  };

  let i = 0;

  return (

    <div className="recruitment-page">

      <h2 className="recruitment-title">
        Recruitment Form
      </h2>

      <form onSubmit={handleSubmit}>

        {/* ================= CANDIDATE DETAILS ================= */}
        <div className="recruitment-card">

          <h3 className="section-title">
            Candidate Details
          </h3>

          {[
            ["Full Name", "fullName"],
            ["Location", "location"],
            ["Phone", "phone"],
            ["Email", "email"],
            ["Last 4 SSN", "ssnLast4"],
            ["Skype ID", "skypeId"],
            ["Hangout", "hangout"],
            ["Total IT Exp", "totalITExp"],
            ["Total US Exp", "totalUSExp"],
            ["Education", "education"],
            ["University", "university"],
            ["Passing Year", "passingYear"],
            ["Passport Number", "passportNumber"],
            ["LinkedIn", "linkedin"],
            ["Certification", "certification"],
            ["Technology", "technology"],
            ["Department", "department"],
            ["Reference Number", "referenceNumber"]
          ].map(([label, name]) => {

            const index = i++;

            return (

              <div
                className="form-grid"
                key={name}
              >

                <label>{label}</label>

                <input
                  className="form-input"
                  ref={(el) =>
                    (inputRefs.current[index] = el)
                  }
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                />

              </div>

            );

          })}

        </div>

        {/* ================= WORK AUTH ================= */}
        <div className="recruitment-card">

          <h3 className="section-title">
            Work Authorization
          </h3>

          <select
            className="form-input"
            name="workAuth"
            value={formData.workAuth}
            onChange={handleChange}
          >

            <option value="">Select</option>
            <option>US Citizen</option>
            <option>Green Card</option>
            <option>H1B</option>
            <option>OPT</option>
            <option>CPT</option>
            <option>EAD</option>

          </select>

        </div>

        {/* ================= VISA ================= */}
        <div className="recruitment-card">

          <h3 className="section-title">
            Visa & DOB
          </h3>

          <input
            type="date"
            className="form-input"
            name="visaValidity"
            value={formData.visaValidity}
            onChange={handleChange}
          />

          <input
            type="date"
            className="form-input"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

        </div>

        {/* ================= TIMELINE ================= */}
        <div className="recruitment-card">

          <h3 className="section-title">
            Recruitment Timeline
          </h3>

          {[
            ["Submission Date", "submissionDate"],
            ["Interview Date", "interviewDate"],
            ["Shortlist Date", "shortlistDate"],
            ["Joining Date", "joiningDate"]
          ].map(([label, name]) => (

            <div
              className="form-grid"
              key={name}
            >

              <label>{label}</label>

              <input
                type="date"
                className="form-input"
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />

            </div>

          ))}

        </div>

        {/* ================= REFERENCES ================= */}
        <div className="recruitment-card">

          <h3 className="section-title">
            Reference Details
          </h3>

          <select
            className="form-input"
            value={hasReference}
            onChange={(e) =>
              setHasReference(e.target.value)
            }
          >

            <option value="no">No</option>
            <option value="yes">Yes</option>

          </select>

          {hasReference === "yes" &&
            references.map((ref, index) => (

              <div
                key={index}
                className="reference-box"
              >

                {Object.keys(ref).map((key) => (

                  <input
                    key={key}
                    className="form-input"
                    placeholder={key}
                    value={ref[key]}
                    onChange={(e) =>
                      handleReferenceChange(
                        index,
                        key,
                        e.target.value
                      )
                    }
                  />

                ))}

                <button
                  type="button"
                  className="remove-ref-btn"
                  onClick={() =>
                    removeReference(index)
                  }
                >
                  ❌ Remove
                </button>

              </div>

            ))}

          {hasReference === "yes" && (

            <button
              type="button"
              className="add-ref-btn"
              onClick={addReference}
            >
              ➕ Add Reference
            </button>

          )}

        </div>

        {/* ================= BUTTONS ================= */}
        <div className="bottom-btns">

          <button
            type="submit"
            className="submit-btn"
          >
            Submit
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

        </div>

      </form>

    </div>

  );

};

export default CandidateRecruitmentForm;