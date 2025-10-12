import express from "express";
import { createQuestion } from "./../controllers/admin/manageUsers.controller.js";
// import { verifyAdmin } from "../middleware/auth.js"; // middleware to check if admin


const router = express.Router();

// router.post("/quiz/:quizId/question", verifyAdmin, insertQuestion);
router.post("/quiz/:quizId/question", createQuestion);

export default router;
