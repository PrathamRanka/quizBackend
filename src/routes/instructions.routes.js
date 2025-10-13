import express from "express";
import { showInstructions } from "../controllers/instruction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router  = express.Router();

router.post("/instructions", verifyJWT, showInstructions);


export default router;