import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    // Multi-Tenant Company Reference
    companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "companies",
  required: true
},
    candidateId: {
      type: String,
      trim: true
    },

    candidateName: {
      type: String,
      trim: true
    },

    employeeId: {
      type: String,
      trim: true
    },

    employeeName: {
      type: String,
      trim: true
    },

    appliedDate: {
      type: String
    },

    submission: {
      type: String
    },

    jobTitle: {
      type: String,
      trim: true
    },

    implementationPartner: {
      type: String,
      trim: true
    },

    rate: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    vendor: {
      type: String,
      trim: true
    },

    recruiter: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    ext: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    interviewType: {
      type: String,
      trim: true
    },

    timing: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Helpful index for SaaS filtering
submissionSchema.index({
  companyId: 1
});

const Submission = mongoose.model(
  "submissions",
  submissionSchema
);

export default Submission;