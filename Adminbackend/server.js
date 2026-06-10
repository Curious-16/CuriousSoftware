// ================= server.js =================

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ======================================================
   DATABASE CONNECTION
====================================================== */

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/adminempDB"
  )
  .then(() => {

    console.log(
      "✅ MongoDB Connected"
    );

  })
  .catch((err) => {

    console.log(
      "❌ DB Error :",
      err
    );

  });

/* ======================================================
   EMPLOYEE SCHEMA
====================================================== */

const employeeSchema =
  new mongoose.Schema(
    {

      employeeId: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        trim: true,
      },

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      mobileNumber: {
        type: String,
        trim: true,
      },

      department: String,

      designation: String,

      salary: Number,

      password: {
        type: String,
        default: null,
      },

      activated: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        default: "active",
      },

    },
    {
      timestamps: true,
    }
  );

const Employee =
  mongoose.model(
    "inneremployees",
    employeeSchema
  );

/* ======================================================
   MONITOR EMPLOYEE SCHEMA
====================================================== */

const monitorSchema = new mongoose.Schema(
{
  employeeId: {
    type: String,
    unique: true
  },

  firstName: String,
  lastName: String,
  email: String,

  loginTime: Date,

  logoutTime: Date,

  status: {
    type: String,
    default: "Offline"
  }
},
{
  timestamps: true
}
);

const MonitorEmployee =
mongoose.model(
  "monitoremps",
  monitorSchema
);

/* ======================================================
   CONTACT SCHEMA
====================================================== */

const contactSchema =
  new mongoose.Schema(
    {

      name: String,

      email: String,

      query: String,

    },
    {
      timestamps: true,
    }
  );

const ContactUs =
  mongoose.model(
    "contactus",
    contactSchema
  );

/* ======================================================
   EMAIL CONFIG
====================================================== */

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,

    },

  });

/* ======================================================
   ADMIN LOGIN
====================================================== */

app.post(
  "/admin/login",
  (req, res) => {

    const {
      username,
      password,
    } = req.body;

    if (
      username === "admin" &&
      password === "1234"
    ) {

      return res.json({

        success: true,

        message:
          "Admin Login Success",

      });

    }

    res.status(401).json({

      success: false,

      message:
        "Invalid Credentials",

    });

  }
);

/* ======================================================
   GET ALL EMPLOYEES
====================================================== */

app.get(
  "/employees",
  async (req, res) => {

    try {

      const employees =
        await Employee.find().sort({
          createdAt: -1,
        });

      res.json(employees);

    } catch (err) {

      console.log(
        "❌ Fetch Employees Error :",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Fetch Failed",

      });

    }

  }
);

/* ======================================================
   GET MONITOR EMPLOYEES
====================================================== */

app.get(
  "/monitor-employees",
  async (req, res) => {

    try {

      const data =
        await MonitorEmployee.find()
        .sort({
          employeeId: 1
        });

      res.json(data);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false
      });

    }

  }
);

/* ======================================================
   TODAY LOGIN STATUS
====================================================== */

app.get(
  "/today-login-status",
  async (req, res) => {

    try {

      const startOfDay = new Date();

      startOfDay.setHours(
        0,
        0,
        0,
        0
      );

      const monitorData =
        await MonitorEmployee.find({
          loginTime: {
            $gte: startOfDay
          }
        });

      const loginMap = {};

      monitorData.forEach((item) => {

        loginMap[item.employeeId] =
          item.status;

      });

      res.json(loginMap);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false
      });

    }

  }
);
/* ======================================================
   ADD EMPLOYEE
====================================================== */

app.post(
  "/add-employee",
  async (req, res) => {

    try {

      const {
        employeeId,
        email,
      } = req.body;

      const existingEmp =
        await Employee.findOne({

          employeeId:
            employeeId.toUpperCase(),

        });

      if (existingEmp) {

        return res.status(400).json({

          success: false,

          message:
            "Employee ID Already Exists",

        });

      }

      const existingEmail =
        await Employee.findOne({
          email,
        });

      if (existingEmail) {

        return res.status(400).json({

          success: false,

          message:
            "Email Already Exists",

        });

      }

      const employee =
        new Employee({

          ...req.body,

          employeeId:
            employeeId.toUpperCase(),

        });

      await employee.save();

      res.json({

        success: true,

        message:
          "Employee Added Successfully",

      });

    } catch (err) {

      console.log(
        "❌ Add Employee Error :",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Failed To Add Employee",

      });

    }

  }
);

/* ======================================================
   GET SINGLE EMPLOYEE
====================================================== */

app.get(
  "/employee/:id",
  async (req, res) => {

    try {

      const employee =
        await Employee.findById(
          req.params.id
        );

      if (!employee) {

        return res.status(404).json({

          success: false,

          message:
            "Employee Not Found",

        });

      }

      res.json(employee);

    } catch (err) {

      console.log(
        "❌ Fetch Employee Error :",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Fetch Failed",

      });

    }

  }
);

/* ======================================================
   UPDATE EMPLOYEE
====================================================== */

app.put(
  "/update-employee/:id",
  async (req, res) => {

    try {

      const {
        employeeId,
        email,
      } = req.body;

      const employee =
        await Employee.findById(
          req.params.id
        );

      if (!employee) {

        return res.status(404).json({

          success: false,

          message:
            "Employee Not Found",

        });

      }

      const duplicateEmp =
        await Employee.findOne({

          employeeId:
            employeeId.toUpperCase(),

          _id: {
            $ne: req.params.id,
          },

        });

      if (duplicateEmp) {

        return res.status(400).json({

          success: false,

          message:
            "Employee ID Already Used",

        });

      }

      const duplicateEmail =
        await Employee.findOne({

          email,

          _id: {
            $ne: req.params.id,
          },

        });

      if (duplicateEmail) {

        return res.status(400).json({

          success: false,

          message:
            "Email Already Used",

        });

      }

      employee.employeeId =
        employeeId.toUpperCase();

      employee.firstName =
        req.body.firstName;

      employee.lastName =
        req.body.lastName;

      employee.email =
        req.body.email;

      employee.mobileNumber =
        req.body.mobileNumber;

      employee.department =
        req.body.department;

      employee.designation =
        req.body.designation;

      employee.salary =
        req.body.salary;

      await employee.save();

      res.json({

        success: true,

        message:
          "Employee Updated Successfully",

        data: employee,

      });

    } catch (err) {

      console.log(
        "❌ Update Employee Error :",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Update Failed",

      });

    }

  }
);

/* ======================================================
   TOGGLE STATUS
====================================================== */

app.put(
  "/toggle-status/:id",
  async (req, res) => {

    try {

      const employee =
        await Employee.findById(
          req.params.id
        );

      if (!employee) {

        return res.status(404).json({

          success: false,

          message:
            "Employee Not Found",

        });

      }

      employee.status =
        employee.status === "active"
          ? "inactive"
          : "active";

      await employee.save();

      res.json({

        success: true,

        message:
          "Status Updated",

      });

    } catch (err) {

      console.log(
        "❌ Toggle Error :",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Status Update Failed",

      });

    }

  }
);

/* ======================================================
   SEND INVITE
====================================================== */

app.post(
  "/invite",
  async (req, res) => {

    try {

      const {
        email,
        employeeId,
        firstName,
      } = req.body;

      const BASE_URL =
        "http://localhost:5173";

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "Activate Your Account",

        html: `

          <h2>Hello ${firstName}</h2>

          <p>Click below to activate your account:</p>

          <a href="${BASE_URL}/signup/${employeeId}">
            Activate Account
          </a>

        `,

      });

      res.json({

        success: true,

        message:
          "Invite Sent Successfully",

      });

    } catch (err) {

      console.log(
        "❌ Invite Error :",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Invite Failed",

      });

    }

  }
);

/* ======================================================
   SET PASSWORD
====================================================== */

app.post(
  "/set-password",
  async (req, res) => {

    try {

      const {
        employeeId,
        password,
      } = req.body;

      const employee =
        await Employee.findOne({

          employeeId:
            employeeId.toUpperCase(),

        });

      if (!employee) {

        return res.status(404).json({

          success: false,

          message:
            "Employee Not Found",

        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      employee.password =
        hashedPassword;

      employee.activated =
        true;

      await employee.save();

      res.json({

        success: true,

        message:
          "Password Set Successfully",

      });

    } catch (err) {

      console.log(
        "❌ Password Error :",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Password Setup Failed",

      });

    }

  }
);

/* ======================================================
   EMPLOYEE LOGIN
====================================================== */

app.post(
  "/employee/login",
  async (req, res) => {

    try {

      const {
        employeeId,
        password
      } = req.body;

      const employee =
        await Employee.findOne({
          employeeId:
            employeeId.toUpperCase()
        });

      if (!employee) {

        return res.status(404).json({
          success: false,
          message: "Employee Not Found"
        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          employee.password
        );

      if (!isMatch) {

        return res.status(401).json({
          success: false,
          message: "Invalid Password"
        });

      }

      await MonitorEmployee.findOneAndUpdate(
        {
          employeeId:
            employee.employeeId
        },
        {
          employeeId:
            employee.employeeId,

          firstName:
            employee.firstName,

          lastName:
            employee.lastName,

          email:
            employee.email,

          loginTime:
            new Date(),

          logoutTime:
            null,

          status:
            "Online"
        },
        {
          upsert: true,
          new: true
        }
      );

      res.json({
        success: true,
        message: "Login Successful",
        employee
      });

    } catch (err) {

      console.log(
        "❌ Login Error :",
        err
      );

      res.status(500).json({
        success: false,
        message: "Login Failed"
      });

    }

  }
);
/* ======================================================
   EMPLOYEE LOGOUT
====================================================== */

app.put(
  "/employee/logout/:employeeId",
  async (req, res) => {

    try {

      await MonitorEmployee.findOneAndUpdate(
        {
          employeeId:
            req.params.employeeId.toUpperCase()
        },
        {
          logoutTime:
            new Date(),

          status:
            "Offline"
        },
        {
          new: true
        }
      );

      res.json({
        success: true,
        message: "Logout Updated"
      });

    } catch (err) {

      console.log(
        "❌ Logout Error :",
        err
      );

      res.status(500).json({
        success: false,
        message: "Logout Failed"
      });

    }

  }
);
/* ======================================================
   CONTACT APIs
====================================================== */

app.post(
  "/api/contactus",
  async (req, res) => {

    try {

      const newQuery =
        new ContactUs(req.body);

      await newQuery.save();

      res.json({

        success: true,

        message:
          "Query Saved",

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

      });

    }

  }
);

app.get(
  "/api/contactus",
  async (req, res) => {

    try {

      const data =
        await ContactUs.find().sort({
          createdAt: -1,
        });

      res.json(data);

    } catch (err) {

      res.status(500).json([]);

    }

  }
);

app.delete(
  "/api/contactus/:id",
  async (req, res) => {

    try {

      await ContactUs.findByIdAndDelete(
        req.params.id
      );

      res.json({

        success: true,

        message:
          "Deleted Successfully",

      });

    } catch (err) {

      res.status(500).json({

        success: false,

      });

    }

  }
);

/* ======================================================
   SERVER
====================================================== */

app.listen(7001, () => {

  console.log(
    "🚀 Server Running On Port 7001"
  );

});