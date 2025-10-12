import { submitQuiz } from "../controllers/submitQuiz.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/sessions/:sessionId/submit", verifyJWT, submitQuiz);

export default router;