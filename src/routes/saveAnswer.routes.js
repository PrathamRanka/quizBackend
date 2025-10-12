import express from "express";
import { saveAnswer } from "../controllers/saveAnswers.controller.js";

const router = express.Router();

router.post("/sessions/:sessionId/answers", saveAnswer);

export default router;
