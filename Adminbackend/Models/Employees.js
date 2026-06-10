import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,       // 🔥 ensures no duplicate EMP IDs
      uppercase: true,    // 🔥 auto converts to EMP001 format
      trim: true
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,       // 🔥 prevents duplicate emails
      lowercase: true,
      trim: true
    },

    mobileNumber: {
      type: String,
      trim: true
    },

    department: {
      type: String,
      trim: true
    },

    designation: {
      type: String,
      trim: true
    },

    salary: {
      type: Number,
      default: 0
    },

    // 🔐 AUTH FIELDS
    password: {
      type: String,
      default: null       // no password until signup
    },

    activated: {
      type: Boolean,
      default: false      // becomes true after signup
    },

    signupDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true      // 🔥 adds createdAt & updatedAt automatically
  }
);

const Employee = mongoose.model("inneremployees", employeeSchema);

export default Employee;