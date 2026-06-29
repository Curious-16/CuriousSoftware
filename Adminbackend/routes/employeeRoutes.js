import express from "express";
import mongoose from "mongoose";
import Employee from "../Models/Employee.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Default company for current migration
// const DEFAULT_COMPANY_ID =
//   "6a2f9af9648b78b8db1fb5ce";

// ADD EMPLOYEE
router.post("/add-employee", authMiddleware,
  async (req, res) => {
  console.log("ADD EMPLOYEE API HIT");

  try {
    const {
      employeeId,
      firstName,
      email
    } = req.body;

    const empId =
      employeeId.trim().toUpperCase();

    
    // Check only inside the same company
    const companyId = req.user.companyId;
    const existing =
      await Employee.findOne({
        companyId,
        $or: [
          { employeeId: empId },
          { email }
        ]
      });

    if (existing) {
      return res.status(400).json({
        message:
          "Employee already exists in this company"
      });
    }
    
    
    
    const newEmployee =
      new Employee({
        companyId,
        employeeId: empId,
        firstName,
        email
        
      });

    await newEmployee.save();

    res.json({
      message:
        "Employee added successfully"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

export default router;