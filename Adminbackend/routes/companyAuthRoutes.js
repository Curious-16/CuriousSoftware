import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Company from "../Models/Company.js";

const router = express.Router();

router.post(
  "/company/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      const company =
      await Company.findOne({
        email:
        email.toLowerCase()
      });

      if (!company) {

        return res.status(404).json({
          success:false,
          message:"Company Not Found"
        });

      }

      const match =
      await bcrypt.compare(
        password,
        company.password
      );

      if (!match) {

        return res.status(401).json({
          success:false,
          message:"Invalid Password"
        });

      }

      const token = jwt.sign(
      {
        companyId: company._id,
        role: company.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn:"7d"
      });

      res.json({

        success:true,

        token,

        company: {

          _id:
          company._id,

          companyName:
          company.companyName,

          companyCode:
          company.companyCode,

          plan:
          company.plan

        }

      });

    }

    catch(err){

      console.log(err);

      res.status(500).json({
        success:false
      });

    }

  }
);

export default router;