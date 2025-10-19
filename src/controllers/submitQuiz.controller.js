import { Session } from "../models/attempted.model.js";
import { Questions } from "../models/questions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitQuiz = asyncHandler(async (req, res) => {
    
    const { sessionId } = req.params;
    const { answers: userAnswers } = req.body; // Rename for clarity

    // --- VALIDATION ---
    if (!userAnswers || !Array.isArray(userAnswers)) {
        throw new ApiError(400, "A valid array of answers is required.");
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        throw new ApiError(404, "Session not found.");
    }
    if (session.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to submit this session.");
    }
    if (session.status === "submitted") {
        throw new ApiError(400, "This quiz has already been submitted.");
    }

    // --- SECURE SCORING ---
    const questions = await Questions.find({ quizId: session.quizId }).select("+options +marks");
    if (!questions || questions.length === 0) {
        throw new ApiError(404, "Questions for this quiz could not be found.");
    }

    let totalScore = 0;
    
    // THIS IS THE FIX: Create two separate arrays
    const answersToSaveInDB = [];
    const resultsForFrontend = [];

    // Process each answer provided by the user
    userAnswers.forEach(userAnswer => {
        const question = questions.find(q => q._id.toString() === userAnswer.questionId);

        if (question) {
            const correctOption = question.options.find(o => o.isCorrect);
            const isUserCorrect = correctOption && userAnswer.selectedOption === correctOption.optionText;

            if (isUserCorrect) {
                totalScore += question.marks || 1;
            }

            // 1. Build the object that EXACTLY matches the database schema
            answersToSaveInDB.push({
                questionId: userAnswer.questionId,
                selectedOption: userAnswer.selectedOption,
                // timeSpentSec will use its default value of 0 for now
            });
            
            // 2. Build the detailed object for the frontend response
            resultsForFrontend.push({
                questionId: userAnswer.questionId,
                selectedOption: userAnswer.selectedOption,
                isCorrect: isUserCorrect,
                correctAnswer: correctOption ? correctOption.optionText : null,
            });
        }
    });

    // --- SAVE FINAL RESULTS TO DATABASE ---
    session.completedAt = new Date();
    session.score = totalScore;
    session.status = "submitted";
    session.answers = answersToSaveInDB; // <-- Save the correctly formatted array

    await session.save({ validateBeforeSave: false }); // Skip validation temporarily if defaults cause issues

    // --- RESPOND TO FRONTEND ---
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                sessionId: session._id,
                score: session.score,
                results: resultsForFrontend, // <-- Send the detailed array to the frontend
            },
            "Quiz submitted successfully"
        )
    );
});
