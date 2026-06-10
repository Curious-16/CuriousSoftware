import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import PDFDocument from "pdfkit";

const app = express();

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

const CandidateForm = candidateDB.model(
  "candidateforms",
  new mongoose.Schema({}, { strict: false, timestamps: true })
);

const Submission = candidateDB.model(
  "submissioninnercandidates",
  new mongoose.Schema({}, { strict: false, timestamps: true })
);

/* ======================================================
   SAVE SUBMISSION
====================================================== */

app.post("/submission-details", async (req, res) => {
  try {
    const body = req.body;

    const cleanEmployeeId =
      body.employeeId?.toUpperCase().trim();

    const newSubmission = new Submission({
      ...body,
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

app.get("/submission-analysis/:employeeId", async (req, res) => {
  try {

    const employeeId =
      req.params.employeeId?.toUpperCase().trim();

    const submissions = await Submission.find({
      employeeId
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

app.get("/submission-details/:candidateId", async (req, res) => {
  try {

    const data = await Submission.findOne({
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

app.get("/assigned/:employeeId", async (req, res) => {
  try {

    const employeeId =
      req.params.employeeId?.toUpperCase().trim();

    const data = await CandidateForm.find({
      assignedEmployeeId: employeeId,
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json([]);
  }
});

/* ======================================================
   UPDATE WORKING STATUS
====================================================== */

app.put("/update-working-status/:id", async (req, res) => {
  try {

    const updated = await CandidateForm.findByIdAndUpdate(
      req.params.id,
      {
        workingStatus: req.body.workingStatus,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   REFERENCE ANALYSIS
====================================================== */

app.get("/reference-analysis/:referenceNumber", async (req, res) => {
  try {

    const candidate = await CandidateForm.findOne({
      referenceNumber: req.params.referenceNumber,
    });

    if (!candidate) {
      return res.status(404).json({ success: false });
    }

    const submissions = await Submission.find({
      candidateId: candidate._id.toString(),
    });

    res.json({
      success: true,
      candidate,
      totalSubmissions: submissions.length,
      submissions,
    });

  } catch (err) {
    res.status(500).json({ success: false });
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
   SERVER START
====================================================== */

app.listen(7002, () => {
  console.log("🚀 Server Running On 7002");
});