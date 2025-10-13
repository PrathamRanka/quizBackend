import { Questions } from "../../models/questions.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

/* -------------------- CREATE -------------------- */
// Add a new question
export const createQuestion = asyncHandler(async (req, res) => {
  // Destructure expected fields from the body for security (prevents mass assignment)
  const { quizId, questionText, options, marks, position, metadata } = req.body;

  // Basic validation
  if (!quizId || !questionText || !options || options.length === 0) {
    throw new ApiError(400, "Quiz ID, question text, and options are required");
  }

  const question = await Questions.create({
    quizId,
    questionText,
    options,
    marks,
    position,
    metadata,
    sessionId: req.user?._id || "admin-creation" // Assuming admin creates this
  });

  return res.status(201).json(
    new ApiResponse(201, question, "Question created successfully")
  );
});

/* -------------------- READ -------------------- */
// Get all questions (can be filtered by quizId)
export const getAllQuestions = asyncHandler(async (req, res) => {
  // Allow filtering questions by quizId via query parameter
  // Example: GET /api/questions?quizId=68ec712676aff2ddf3e3c0b5
  const { quizId } = req.query;
  const filter = quizId ? { quizId } : {};

  const questions = await Questions.find(filter);

  return res.status(200).json(
    new ApiResponse(200, questions, "Questions fetched successfully")
  );
});

// Get single question by ID
export const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Questions.findById(req.params.id);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  return res.status(200).json(
    new ApiResponse(200, question, "Question fetched successfully")
  );
});

/* -------------------- UPDATE -------------------- */
// Update a question by ID
export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Questions.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  return res.status(200).json(
    new ApiResponse(200, question, "Question updated successfully")
  );
});

/* -------------------- DELETE -------------------- */
// Delete a question by ID
export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Questions.findByIdAndDelete(req.params.id);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Question deleted successfully")
  );
});