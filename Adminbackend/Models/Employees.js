import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // Multi-Tenant Company Reference
   companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "companies",
  required: true
},

    employeeId: {
      type: String,
      required: true,
      uppercase: true,
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

    // Authentication
    password: {
      type: String,
      default: null
    },

    activated: {
      type: Boolean,
      default: false
    },

    signupDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Employee ID unique inside a company
employeeSchema.index(
  {
    companyId: 1,
    employeeId: 1
  },
  {
    unique: true
  }
);

// Email unique inside a company
employeeSchema.index(
  {
    companyId: 1,
    email: 1
  },
  {
    unique: true
  }
);

const Employee = mongoose.model(
  "inneremployees",
  employeeSchema
);

export default Employee;