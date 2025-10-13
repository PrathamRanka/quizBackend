import { Router } from "express";
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} from "../controllers/admin/manageUsers.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

// Apply JWT and Admin verification to all routes in this file
router.use(verifyJWT, verifyAdmin);

// Define the routes for question management
router.route("/questions")
    .post(createQuestion)
    .get(getAllQuestions);

router.route("/questions/:id")
    .get(getQuestionById)
    .patch(updateQuestion) // PATCH is often better for updates than PUT
    .delete(deleteQuestion);

export default router;