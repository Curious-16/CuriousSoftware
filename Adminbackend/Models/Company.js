import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
{
  companyCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  companyName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  plan: {
    type: String,
    enum: [
      "Starter",
      "Growth",
      "Enterprise"
    ],
    default: "Starter"
  },

  status: {
    type: String,
    enum: [
      "Active",
      "Inactive"
    ],
    default: "Active"
  }
},
{
  timestamps: true
}
);

export default mongoose.model(
  "companies",
  companySchema
);