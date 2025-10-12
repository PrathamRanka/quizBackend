import { Questions } from "../../models/questions.model.js";

/* -------------------- CREATE -------------------- */
// Add a new question
export const createQuestion = async (req, res) => {
  try {
    const question = await Questions.create(req.body);
    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating question",
      error: error.message,
    });
  }
};

/* -------------------- READ -------------------- */
// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Questions.find();
    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error: error.message,
    });
  }
};

// Get single question by ID
export const getQuestionById = async (req, res) => {
  try {
    const question = await Questions.findById(req.params.id);
    if (!question)
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching question",
      error: error.message,
    });
  }
};

/* -------------------- UPDATE -------------------- */
// Update a question by ID
export const updateQuestion = async (req, res) => {
  try {
    const question = await Questions.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question)
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating question",
      error: error.message,
    });
  }
};

/* -------------------- DELETE -------------------- */
// Delete a question by ID
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Questions.findByIdAndDelete(req.params.id);
    if (!question)
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
};
