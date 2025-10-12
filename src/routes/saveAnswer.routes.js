import express from "express";
import { saveAnswer } from "../controllers/saveAnswers.controller.js";

const router = express.Router();

router.post("/save-answer", saveAnswer);

export default router;
