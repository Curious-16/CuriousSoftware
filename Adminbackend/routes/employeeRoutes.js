import express from "express";
import Employee from "../Models/Employee.js";

const router = express.Router();

// ✅ ADD EMPLOYEE
router.post("/add-employee", async (req, res) => {
  console.log("ADD EMPLOYEE API HIT");

  try {
    const { employeeId, firstName, email } = req.body;

    const empId = employeeId.trim().toUpperCase();

    const existing = await Employee.findOne({
      $or: [{ employeeId: empId }, { email }]
    });

    if (existing) {
      return res.status(400).json({
        message: "Employee already exists"
      });
    }

    const newEmployee = new Employee({
      employeeId: empId,
      firstName,
      email
    });

    await newEmployee.save();

    res.json({ message: "Employee added successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;