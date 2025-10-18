import { Router } from "express";
import { checkServerStatus } from "../controllers/status.controller.js";

const router = Router();
router.route("/status").get(checkServerStatus);

export default router;