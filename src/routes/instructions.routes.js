import express from "express";
import { showInstructions } from "../controllers/instruction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { startQuiz } from "../controllers/quiz.controller.js";

const router  = express.Router();

router.post("/instructions", verifyJWT, showInstructions);
router.post("/quizzes/:quizId/start", verifyJWT, startQuiz);

export default router;