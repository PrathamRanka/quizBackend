import { verifyJWT } from "../middlewares/auth.middleware.js";
import { startQuiz } from "../controllers/quiz.controller.js";
import express from "express";

const router  = express.Router();

router.post("/quizzes/:quizId/start", verifyJWT, startQuiz);
export default router;