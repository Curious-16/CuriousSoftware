import bcrypt from "bcrypt";
import Company from "../Models/Company.js";

/* ======================================================
   CREATE COMPANY
====================================================== */

export const createCompany = async (req, res) => {

  try {

    const {
      companyCode,
      companyName,
      email,
      password,
      plan
    } = req.body;

    // Check Company Code

    const existingCode =
      await Company.findOne({
        companyCode: companyCode.toUpperCase()
      });

    if (existingCode) {

      return res.status(400).json({
        success: false,
        message: "Company Code Already Exists"
      });

    }

    // Check Email

   const existingEmail =
await Employee.findOne({
  companyId:
    req.user.companyId,
  email:
    email.toLowerCase()
});

    if (existingEmail) {

      return res.status(400).json({
        success: false,
        message: "Email Already Exists"
      });

    }

    // Hash Password

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // Create Company

    const company =
      await Company.create({

        companyCode:
          companyCode.toUpperCase(),

        companyName,

        email:
          email.toLowerCase(),

        password:
          hashedPassword,

        plan:
          plan || "Starter",

        status:
          "Active"

      });

    res.status(201).json({

      success: true,

      message:
        "Company Created Successfully",

      company: {

        _id:
          company._id,

        companyCode:
          company.companyCode,

        companyName:
          company.companyName,

        email:
          company.email,

        plan:
          company.plan,

        status:
          company.status

      }

    });

  } catch (err) {

    console.log(
      "❌ Create Company Error:",
      err
    );

    res.status(500).json({

      success: false,

      message:
        err.message

    });

  }

};

/* ======================================================
   GET COMPANIES
====================================================== */

export const getCompanies =
async (req, res) => {

  try {

    const companies =
      await Company.find()
      .select("-password")
      .sort({
        createdAt: -1
      });

    res.json({

      success: true,

      companies

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        err.message

    });

  }

};

/* ======================================================
   UPDATE COMPANY
====================================================== */

export const updateCompany =
async (req, res) => {

  try {

    const company =
      await Company.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true
        }

      ).select("-password");

    res.json({

      success: true,

      company

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        err.message

    });

  }

};

/* ======================================================
   UPDATE STATUS
====================================================== */

export const updateStatus =
async (req, res) => {

  try {

    const company =
      await Company.findByIdAndUpdate(

        req.params.id,

        {
          status:
            req.body.status
        },

        {
          new: true
        }

      ).select("-password");

    res.json({

      success: true,

      company

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message:
        err.message

    });

  }

};