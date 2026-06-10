import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

/* SAVE QUERY */
router.post("/api/contact", async (req, res) => {
  try {
    const { name, email, query } = req.body;

    const newContact = new Contact({ name, email, query });
    await newContact.save();

    res.status(200).json({ message: "Query submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET ALL QUERIES (ADMIN) */
router.get("/api/contact", async (req, res) => {
  try {
    const data = await Contact.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;