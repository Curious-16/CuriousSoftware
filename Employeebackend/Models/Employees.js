const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({

  name: String,
  phone: String,
  email: String,
  vendorSubmitted: String,
  interviews: String,
  shortlisted: String,
  jobOffered: String,
  assignedTo: String,
  dateOfJoining: String

});

module.exports = mongoose.model("Employee", EmployeeSchema);