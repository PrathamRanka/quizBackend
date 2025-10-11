import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { startQuiz } from "../controllers/quizController.js";

const router = express.Router();


router.post("/start", verifyJWT, startQuiz);

export default router;
