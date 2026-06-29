import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import roleMiddleware
from "../middleware/roleMiddleware.js";

import {
  createCompany,
  getCompanies,
  updateCompany,
  updateStatus
}
from "../controllers/companyController.js";

const router = express.Router();

router.post(
  "/companies",
  authMiddleware,
  createCompany
);

router.get(
  "/companies",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  getCompanies
);

router.put(
  "/companies/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  updateCompany
);

router.put(
  "/companies/:id/status",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  updateStatus
);

export default router;