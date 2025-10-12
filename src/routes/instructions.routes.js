import express from "express";
import { showInstructions } from "../controllers/instruction.controller.js";
import { verifyJWT} from "../middlewares/verifyJWT.js";


const router  = express.Router();

router.post("/instructions", verifyJWT, showInstructions);
router.post("/start", verifyJWT, startQuiz);

export default router;