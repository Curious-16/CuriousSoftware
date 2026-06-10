import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import axios from "axios";

import "./CandidateDetails.css";

export default function CandidateDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [candidate, setCandidate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchCandidate();

  }, []);

  const fetchCandidate =
    async () => {

      try {

        const res =
          await axios.get(
            `http://localhost:7002/candidate-form/${id}`
          );

        console.log(
          "✅ Candidate Details :",
          res.data
        );

        setCandidate(res.data);

      } catch (err) {

        console.log(
          "❌ Fetch Error :",
          err
        );

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (
      <div className="details-page">
        Loading...
      </div>
    );

  }

  if (!candidate) {

    return (
      <div className="details-page">
        Candidate Not Found
      </div>
    );

  }

  return (

    <div className="details-page">

      <div className="details-card">

        <div className="details-top">

          <h1>
            Candidate Details
          </h1>

          <button
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >
            Back
          </button>

        </div>

        <div className="details-grid">

          <div>
            <label>Full Name</label>
            <p>{candidate.fullName}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{candidate.email}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{candidate.phone}</p>
          </div>

          <div>
            <label>Technology</label>
            <p>{candidate.technology}</p>
          </div>

          <div>
            <label>Department</label>
            <p>{candidate.department}</p>
          </div>

          <div>
            <label>Reference Number</label>
            <p>{candidate.referenceNumber}</p>
          </div>

          <div>
            <label>Location</label>
            <p>{candidate.location}</p>
          </div>

          <div>
            <label>Work Authorization</label>
            <p>{candidate.workAuth}</p>
          </div>

          <div>
            <label>Visa Validity</label>
            <p>{candidate.visaValidity}</p>
          </div>

          <div>
            <label>Education</label>
            <p>{candidate.education}</p>
          </div>

          <div>
            <label>University</label>
            <p>{candidate.university}</p>
          </div>

          <div>
            <label>Passing Year</label>
            <p>{candidate.passingYear}</p>
          </div>

          <div>
            <label>Assigned Employee</label>
            <p>
              {
                candidate.assignedEmployeeName
              }
            </p>
          </div>

        </div>

      </div>

    </div>

  );

}