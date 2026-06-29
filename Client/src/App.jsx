import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; // ✅ ADD THIS LINE


import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Signup from "./admin/Signup";
import EditEmployee from "./admin/EditEmployee";
import NewEmployeeForm from "./admin/NewEmployeeForm";
import EmployeesLogin from "./Employee/EmployeesLogin";
import CandidateDashboard from "./Employee/CandidateDashboard";
import Contact from "./Contact";
import AdminQueries from "./admin/AdminQueries";
import Home from "./Home";
import CandidateRecruitmentForm from "./admin/CandidateRecruitmentForm";
import SubmissionSuccess from "./admin/SubmissionSuccess";
import CandidateDetails from "./Employee/CandidateDetails";
import MonitorEmployees from "./admin/MonitorEmployees";
import SubmissionDetails from "./Employee/SubmissionDetails";
import SubmissionView from "./Employee/SubmissionView";
import AnalysisEmp from "./Employee/AnalysisEmp";
import ReferenceAnalysis from "./Employee/ReferenceAnalysis";
import CompanyLogin from "./pages/CompanyLogin";

function App() {
  return (
    <BrowserRouter>
     
      <Routes>
          <Route path="/" element={<CompanyLogin />}/>
         <Route path="/company-home" element={<Home />} />
         
         <Route path="/contact" element={<Contact />} />
        <Route path="/admin/queries" element={<AdminQueries />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/signup/:employeeId/:companyCode"element={<Signup />}/>
        <Route path="/edit/:id" element={<EditEmployee />} />
        <Route path="/add" element={<NewEmployeeForm />} />
        <Route path="/employeeslogin" element={<EmployeesLogin />} />
        <Route path="/candidates" element={<CandidateDashboard />} />
        <Route path="/CandidateRecruitmentForm" element={<CandidateRecruitmentForm/>}/>
        <Route path="/submission-success" element={<SubmissionSuccess />} />
        <Route path="/candidate-details/:id"element={<CandidateDetails />}/>
        <Route path="/monitor"element={<MonitorEmployees />}/>
        <Route path="/submission-details/:id" element={<SubmissionDetails />}/>
        <Route path="/submission-view"element={<SubmissionView />}/>
        <Route path="/analysis-emp" element={<AnalysisEmp />}/>
        <Route path="/reference-analysis/:referenceNumber" element={<ReferenceAnalysis />}/>
       
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;