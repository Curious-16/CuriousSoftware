// ================= server.js =================

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import companyRoutes from "./routes/companyRoutes.js";
import companyAuthRoutes from "./routes/companyAuthRoutes.js";


dotenv.config();

// console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

// const DEFAULT_COMPANY_ID =
//   new mongoose.Types.ObjectId(
//     "6a2f9af9648b78b8db1fb5ce"
//   );


// =======================
// TEST AUTH ROUTE
// =======================

app.get("/test-auth", authMiddleware, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/* ======================================================
   MIDDLEWARE
====================================================== */

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "http://localhost:5173",
      "https://curious-software-git-main-curious-projects1.vercel.app",
      "https://curious-software.vercel.app"

    ];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

/* ======================================================
   DATABASE CONNECTIONS
====================================================== */

mongoose
  .connect("mongodb://127.0.0.1:27017/adminempDB")
  .then(() => {
    console.log("✅ adminempDB Connected");
  })
  .catch((err) => {
    console.log("❌ DB Error :", err);
  });

const candidateDB = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/candidateDB"
);

candidateDB.on("connected", () => {
  console.log("✅ candidateDB Connected");
});

/* ======================================================
   MODELS
====================================================== */

import Company from "./Models/Company.js";

import Employee from "./Models/Employees.js";

const CandidateForm = candidateDB.model(
  "candidateforms",
  new mongoose.Schema({}, { strict: false })
);

const Submission = candidateDB.model(
  "submissioninnercandidates",
  new mongoose.Schema({}, { strict: false })
);
/* ======================================================
   EMPLOYEE SCHEMA
====================================================== */

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      uppercase: true,
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
      lowercase: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    salary: {
      type: Number,
      default: 0,
    },

    // MULTI COMPANY SUPPORT
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true,
    },

    // ROLE MANAGEMENT
    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "EMPLOYEE",
      ],
      default: "EMPLOYEE",
    },

    // AUTH
    password: {
      type: String,
      default: null,
    },

    activated: {
      type: Boolean,
      default: false,
    },

    signupDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Multi-tenant unique indexes
employeeSchema.index(
  {
    companyId: 1,
    employeeId: 1,
  },
  {
    unique: true,
  }
);

employeeSchema.index(
  {
    companyId: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

// const Employee = mongoose.model(
//   "inneremployees",
//   employeeSchema
// );

/* ======================================================
   MONITOR EMPLOYEE SCHEMA
====================================================== */

const monitorSchema = new mongoose.Schema(
{
  companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "companies",
  required: true
},
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

//* ======================================================GET ALL EMPLOYEES
   


app.get(
  "/employees",
  authMiddleware,
  async (req, res) => {

    try {

      console.log("=================================");
      console.log("JWT USER:", req.user);

      console.log(
        "COMPANY ID FROM TOKEN:",
        req.user.companyId
      );

      const employees =
        await Employee.find({
          companyId: req.user.companyId
        }).sort({
          createdAt: -1
        });

      console.log(
        "FOUND EMPLOYEES:",
        employees.length
      );

      console.log(
        "EMPLOYEE IDS:",
        employees.map(
          (e) => e.employeeId
        )
      );

      console.log("=================================");

      res.json({
        success: true,
        employees
      });

    } catch (err) {

      console.log(
        "❌ Fetch Employees Error:",
        err
      );

      res.status(500).json({
        success: false,
        message: "Fetch Failed"
      });

    }

  }
);
/* ======================================================
   GET MONITOR EMPLOYEES
====================================================== */

app.get(
  "/monitor-employees",
  authMiddleware,
  async (req, res) => {

    try {

      const data =
        await MonitorEmployee.find({companyId: req.user.companyId})
        
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
  authMiddleware,
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
          companyId: req.user.companyId,
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
authMiddleware,
async (req, res) => {

  console.log("=================================");
console.log("JWT USER:", req.user);
console.log("COMPANY ID:", req.user.companyId);
console.log("BODY:", req.body);
console.log("=================================");


try {

  const {
    employeeId,
    email
  } = req.body;

  // Validate Required Fields
  if (!employeeId || !email) {

    return res.status(400).json({
      success: false,
      message: "Employee ID and Email are required"
    });

  }

  // Check Employee ID inside same company
  const existingEmp =
    await Employee.findOne({
      companyId: req.user.companyId,
      employeeId: employeeId.toUpperCase()
    });

  if (existingEmp) {

    return res.status(400).json({
      success: false,
      message: "Employee ID Already Exists"
    });

  }

  // Check Email inside same company
  const existingEmail =
    await Employee.findOne({
      companyId: req.user.companyId,
      email: email.toLowerCase()
    });

  if (existingEmail) {

    return res.status(400).json({
      success: false,
      message: "Email Already Exists"
    });

  }

  // Create Employee
  const employee = new Employee({

    ...req.body,

    companyId: req.user.companyId,

    role: "EMPLOYEE",

    employeeId:
      employeeId.toUpperCase(),

    email:
      email.toLowerCase()

  });

  await employee.save();

  res.status(201).json({

    success: true,

    message:
      "Employee Added Successfully",

    employee

  });

} catch (err) {

  console.log(
    "❌ Add Employee Error:",
    err
  );

  res.status(500).json({

    success: false,

    message:
      "Failed To Add Employee"

  });

}


}
);

/* ======================================================
   GET SINGLE EMPLOYEE
====================================================== */

app.get(
  "/employee/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const employee =
        await Employee.findOne({
  _id: req.params.id,
  companyId:
    req.user.companyId
})

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
  authMiddleware,
  async (req, res) => {

    try {

      const {
        employeeId,
        email,
      } = req.body;

      const employee =
        await Employee.findOne({
  _id: req.params.id,
  companyId:
    req.user.companyId
})

      if (!employee) {

        return res.status(404).json({

          success: false,

          message:
            "Employee Not Found",

        });

      }

     const duplicateEmp =
  await Employee.findOne({
    companyId: employee.companyId,
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
    companyId: employee.companyId,
    email: email.toLowerCase(),
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
  authMiddleware,
  async (req, res) => {

    try {

      const employee =
        await Employee.findOne({
  _id: req.params.id,
  companyId:
    req.user.companyId
})

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
  authMiddleware,
  async (req, res) => {

    try {

      const {
        email,
        employeeId,
        firstName
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

      const company =
        await Company.findById(
          employee.companyId
        );

      if (!company) {

        return res.status(404).json({
          success: false,
          message: "Company Not Found"
        });

      }

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

          <a href="${BASE_URL}/signup/${employeeId}/${company.companyCode}">
            Activate Account
          </a>

        `

      });

      res.json({

        success: true,

        message:
          "Invite Sent Successfully"

      });

    } catch (err) {

      console.log(
        "❌ Invite Error:",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Invite Failed"

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
  companyCode
} = req.body;
  //    const employee =
  // await Employee.findOne({

  //   companyId:
  //     DEFAULT_COMPANY_ID,

  //   employeeId:
  //     employeeId.toUpperCase()

  // });

 const company =
  await Company.findOne({
    companyCode
  });

if (!company) {

  return res.status(404).json({
    success:false,
    message:"Company Not Found"
  });

}

if (!company) {

  return res.status(404).json({
    success: false,
    message: "Company Not Found"
  });

}

const employee =
  await Employee.findOne({
    companyId: company._id,
    employeeId: employeeId.toUpperCase()
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
  companyCode,
  employeeId,
  password
} = req.body;

      console.log("employeeId:", employeeId);

   const company = await Company.findOne({
  companyCode
});

if (!company) {
  return res.status(404).json({
    success: false,
    message: "Company Not Found"
  });
}

const employee =
 await Employee.findOne({
   companyId: company._id,
   employeeId:
     employeeId.toUpperCase()
 });

      console.log("Employee Found:", employee);

      // Employee Not Found
      if (!employee) {

        return res.status(404).json({
          success: false,
          message: "Employee Not Found"
        });

      }

      // Compare Password
      const isMatch = await bcrypt.compare(
        password,
        employee.password
      );

      console.log("Password Match:", isMatch);

      // Invalid Password
      if (!isMatch) {

        return res.status(401).json({
          success: false,
          message: "Invalid Password"
        });

      }

      // Update Monitor Employee Status
    await MonitorEmployee.findOneAndUpdate(
{
  companyId: employee.companyId,
  employeeId: employee.employeeId
},
{
  companyId: employee.companyId,
  employeeId: employee.employeeId,
  firstName: employee.firstName,
  lastName: employee.lastName,
  email: employee.email,
  loginTime: new Date(),
  logoutTime: null,
  status: "Online"
},
{
  upsert: true,
  new: true
}
);
      // Generate JWT Token
      const token = jwt.sign(
  {
    employeeId: employee.employeeId,

    companyId: employee.companyId,

    role: "EMPLOYEE"
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
);

      // Success Response
      res.json({
        success: true,
        message: "Login Successful",

        token,

        employee: {
          _id: employee._id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          email: employee.email,
          companyId: employee.companyId,
          role: employee.role
        }
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



app.get(
  "/signup-employee/:employeeId",
  async (req, res) => {

    try {

      const employee =
        await Employee.findOne({
          employeeId:
            req.params.employeeId.toUpperCase()
        });

      if (!employee) {

        return res.status(404).json({
          success: false,
          message: "Employee Not Found"
        });

      }

      res.json({
        employeeId:
          employee.employeeId,
        activated:
          employee.activated
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server Error"
      });

    }

  }
);



app.post(
  "/save-candidate-form",
  authMiddleware,
  async (req, res) => {

    try {

      const year =
        new Date()
          .getFullYear()
          .toString()
          .slice(-2);

      const count =
        await CandidateForm.countDocuments({
          companyId: req.user.companyId
        });

      const referenceNumber =
        `REF${year}${String(
          count + 1
        ).padStart(4, "0")}`;

      const candidate =
        new CandidateForm({

          ...req.body,

          companyId:
            req.user.companyId,

          referenceNumber

        });

      await candidate.save();

      res.status(201).json({

        success: true,

        data: candidate

      });

    } catch (err) {

      console.log(
        "SAVE CANDIDATE ERROR:",
        err
      );

      res.status(500).json({

        success: false

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
        await ContactUs.find({companyId: req.user.companyId,}).sort({
          createdAt: -1,
        });

      res.json(data);

    } catch (err) {

      res.status(500).json([]);

    }

  }
);


app.get(
  "/signup-employee/:employeeId/:companyCode",
  async (req,res) => {

    const {
      employeeId,
      companyCode
    } = req.params;

    const company =
      await Company.findOne({
        companyCode
      });

    if (!company) {

      return res.status(404).json({
        message:"Company Not Found"
      });

    }

    const employee =
      await Employee.findOne({
        companyId: company._id,
        employeeId:
          employeeId.toUpperCase()
      });

    if (!employee) {

      return res.status(404).json({
        message:"Employee Not Found"
      });

    }

    res.json(employee);

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

app.get(
  "/dashboard/superadmin",
  authMiddleware,
  async (req, res) => {

    try {

      const totalCompanies =
        await Company.countDocuments({_id: req.user.companyId});

      const totalEmployees =
        await Employee.countDocuments({
  companyId:
    req.user.companyId
})

      const totalCandidates =
        await CandidateForm.countDocuments({companyId:
    req.user.companyId});

      const totalSubmissions =
        await Submission.countDocuments({companyId:
    req.user.companyId});

      res.json({
        success: true,
        totalCompanies,
        totalEmployees,
        totalCandidates,
        totalSubmissions
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false
      });

    }

  }
);

app.use("/api", companyRoutes);
app.use("/api", companyAuthRoutes);

/* ======================================================
   SERVER
====================================================== */

app.listen(7001, () => {

  console.log(
    "🚀 Server Running On Port 7001"
  );

});