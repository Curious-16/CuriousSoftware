import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import PDFDocument from "pdfkit";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../Adminbackend/middleware/authMiddleware.js";

const app = express();
dotenv.config();

console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET
);

// const DEFAULT_COMPANY_ID =
//   new mongoose.Types.ObjectId(
//     "6a2f9af9648b78b8db1fb5ce"
//   );

app.use(cors());
app.use(express.json());

/* ======================================================
   DATABASE CONNECTIONS
====================================================== */

mongoose.connect("mongodb://127.0.0.1:27017/employeeDB")
  .then(() => console.log("✅ employeeDB Connected"))
  .catch(err => console.log("❌ DB Error :", err));

const employeeDB = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/adminempDB"
);

employeeDB.on("connected", () => {
  console.log("✅ adminempDB Connected");
});

const candidateDB = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/candidateDB"
);

candidateDB.on("connected", () => {
  console.log("✅ candidateDB Connected");
});

/* ======================================================
   MODELS
====================================================== */

const Employee = employeeDB.model(
  "inneremployees",
  new mongoose.Schema({}, { strict: false })
);

const Company = mongoose.model(
  "companies",
  new mongoose.Schema({}, { strict: false })
);

const CandidateForm = candidateDB.model(
  "candidateforms",
  new mongoose.Schema({}, { strict: false })
);

const Submission = candidateDB.model(
  "submissioninnercandidates",
  new mongoose.Schema({}, { strict: false })
);



/* ======================================================
   SAVE SUBMISSION
====================================================== */

app.post("/submission-details", authMiddleware,
  async (req, res) => {
  try {
    const body = req.body;

    const cleanEmployeeId =
      body.employeeId?.toUpperCase().trim();

    const newSubmission = new Submission({
  ...body,
  companyId:req.user.companyId,
  employeeId: cleanEmployeeId,
});

    const saved = await newSubmission.save();

    res.status(201).json({
      success: true,
      data: saved,
    });

  } catch (err) {
    console.log("❌ Submission Save Error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   SUBMISSION ANALYSIS (EMPLOYEE BASED)
====================================================== */

app.get("/submission-analysis/:employeeId",
  authMiddleware,
   async (req, res) => {
  try {

    const employeeId =
      req.params.employeeId?.toUpperCase().trim();

   const submissions = await Submission.find({
  companyId: req.user.companyId,
  employeeId: req.user.employeeId
}).sort({ createdAt: -1 });

    res.json({
      success: true,
      totalSubmissions: submissions.length,
      latestSubmissions: submissions,
    });

  } catch (err) {
    console.log("❌ Analysis Error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET SINGLE SUBMISSION
====================================================== */

app.get("/submission-details/:candidateId", 
  authMiddleware,
  async (req, res) => {
  try {

    const data = await Submission.findOne({
  companyId:req.user.companyId,
  candidateId: req.params.candidateId,
});

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   ASSIGNED CANDIDATES
====================================================== */
app.get(
  "/assigned/:employeeId",
  authMiddleware,
  async (req, res) => {
    try {

      const employeeId =
        req.params.employeeId
          ?.toUpperCase()
          .trim();

      const data =
        await CandidateForm.find({
          companyId: req.user.companyId,
          assignedEmployeeId: employeeId
        })
        .sort({ _id: -1 });

      res.json(data);

    } catch (err) {

      console.log("ASSIGNED ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed To Load Candidates"
      });

    }
  }
);

/* ======================================================
   UPDATE WORKING STATUS
====================================================== */

app.put("/update-working-status/:id",authMiddleware,
   async (req, res) => {
  try {

   const updated = await CandidateForm.findOneAndUpdate(
  {
    _id: req.params.id,
    companyId:req.user.companyId
  },
  {
    workingStatus: req.body.workingStatus
  },
  {
    new: true
  }
);

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   REFERENCE ANALYSIS
====================================================== */

app.get(
  "/reference-analysis/:referenceNumber",
  authMiddleware,
  async (req, res) => {

    try {

      console.log("============== REFERENCE ==============");

      console.log("Reference:", req.params.referenceNumber);

      console.log("CompanyId:", req.user.companyId);

      const candidate = await CandidateForm.findOne({

        companyId: req.user.companyId,

        referenceNumber: req.params.referenceNumber

      });

      console.log("Candidate:", candidate);

      if (!candidate) {

        console.log("Candidate NOT FOUND");

        return res.status(404).json({
          success:false,
          message:"Candidate Not Found"
        });

      }

      const submissions = await Submission.find({

        companyId:req.user.companyId,

        candidateId:candidate._id.toString()

      });

      console.log("Submissions:", submissions.length);

      res.json({

        success:true,

        candidate,

        totalSubmissions:submissions.length,

        submissions

      });

    }

    catch(err){

      console.log("REFERENCE ERROR:",err);

      res.status(500).json({

        success:false,

        message:err.message

      });

    }

});
/* ======================================================
   ⭐ CLEAR ANALYSIS (NON-DESTRUCTIVE RESET APIs)
====================================================== */

/* CLEAR BY EMPLOYEE (analysis reset) */
app.get("/clear-analysis-employee/:employeeId", async (req, res) => {
  try {

    const employeeId =
      req.params.employeeId?.toUpperCase().trim();

    // Just return empty result (NO DELETE)
    res.json({
      success: true,
      message: "Analysis cleared (view reset only)",
      totalSubmissions: 0,
      latestSubmissions: [],
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* CLEAR BY REFERENCE NUMBER (view reset only) */
app.get("/clear-analysis-reference/:referenceNumber", async (req, res) => {
  try {

    res.json({
      success: true,
      message: "Reference analysis cleared (view reset only)",
      totalSubmissions: 0,
      submissions: [],
      candidate: null,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});



/* ======================================================
   ASSIGN CANDIDATE TO EMPLOYEE
====================================================== */

app.post(
  "/assign-candidate/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const { employeeId } = req.body;

      const candidate =
        await CandidateForm.findOneAndUpdate(
          {
            _id: req.params.id,
            companyId: req.user.companyId
          },
          {
            assignedEmployeeId:
              employeeId.toUpperCase()
          },
          {
            new: true
          }
        );

      if (!candidate) {

        return res.status(404).json({
          success: false,
          message: "Candidate Not Found"
        });

      }

      res.json({
        success: true,
        message:
          "Candidate Assigned Successfully",
        candidate
      });

    } catch (err) {

      console.log(
        "❌ ASSIGN ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Assignment Failed"
      });

    }

  }
);



/* ======================================================
   SERVER START
====================================================== */

app.listen(7002, () => {
  console.log("🚀 Server Running On 7002");
});