import { Session } from "../models/attempted.model.js";
import { Questions } from "../models/questions.model.js";
import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitQuiz = asyncHandler(async (req, res) => {
    
    const { sessionId } = req.params;
    const { answers: userAnswers } = req.body;

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
    

    const answersToSaveInDB = [];
    userAnswers.forEach(userAnswer => {
        const question = questions.find(q => q._id.toString() === userAnswer.questionId);

        if (question) {
            const correctOption = question.options.find(o => o.isCorrect);
            const isUserCorrect = correctOption && userAnswer.selectedOption === correctOption.optionText;

            if (isUserCorrect) {
                totalScore += question.marks || 1;
            }

            answersToSaveInDB.push({
                questionId: userAnswer.questionId,
                selectedOption: userAnswer.selectedOption,
            });
            
    
        }
    });

    // --- SAVE FINAL RESULTS TO DATABASE ---
    // session.completedAt = new Date();
    session.score = totalScore;
    session.status = "submitted";
    session.answers = answersToSaveInDB; // <-- Save the correctly formatted array

    await session.save({ validateBeforeSave: false }); // Skip validation temporarily if defaults cause issues
})
