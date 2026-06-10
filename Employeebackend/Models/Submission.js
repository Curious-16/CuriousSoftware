const submissionSchema =
new mongoose.Schema({

  candidateId: String,

  candidateName: String,

  employeeId: String,

  employeeName: String,

  appliedDate: String,

  submission: String,

  jobTitle: String,

  implementationPartner: String,

  rate: String,

  location: String,

  vendor: String,

  recruiter: String,

  phone: String,

  ext: String,

  email: String,

  interviewType: String,

  timing: String,

},
{
  timestamps: true
});