import { Router } from "express";
import { exportResultsAsCsv } from "../controllers/exportData.controller";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
const router = Router();

// Apply JWT and Admin verification to all routes in this file
router.use(verifyJWT, verifyAdmin);

// Define the route for exporting quiz results as CSV
router.get("/export-results", exportResultsAsCsv);
export default router;
