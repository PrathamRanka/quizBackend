import { Session } from "../models/attempted.model.js";
import { Questions } from "../models/questions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitQuiz = asyncHandler(async (req, res) => {
    
    const { sessionId } = req.params;
    const { answers } = req.body;

    // --- VALIDATION ---
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        throw new ApiError(400, "A valid array of answers is required for submission.");
    }

    const session = await Session.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) {
        throw new ApiError(404, "Session not found for this user.");
    }
    if (session.status === "submitted" || session.status === "completed") {
        throw new ApiError(400, "This quiz has already been submitted.");
    }
    if (session.status === "disqualified") {
        throw new ApiError(403, "You have been disqualified from this quiz.");
    }

    // --- SECURE SCORING ---
    const questions = await Questions.find({ quizId: session.quizId }).select("options marks");
    if (!questions || questions.length === 0) {
        throw new ApiError(404, "No questions found for this quiz.");
    }

    let totalScore = 0;

    const processedAnswers = answers.map(userAnswer => {
        const question = questions.find(
            (q) => q._id.toString() === userAnswer.questionId
        );

        if (!question) {
            return { ...userAnswer, isCorrect: false, correctAnswer: null };
        }

        const correctOption = question.options.find((o) => o.isCorrect);
        const isUserCorrect = correctOption && userAnswer.selectedOption === correctOption.optionText;

        if (isUserCorrect) {
            totalScore += question.marks || 1;
        }

        return {
            questionId: userAnswer.questionId,
            selectedOption: userAnswer.selectedOption,
            isCorrect: isUserCorrect,
            correctAnswer: correctOption ? correctOption.optionText : null,
        };
    });

    // --- SAVE FINAL RESULTS ---
    session.completedAt = new Date();
    session.score = totalScore;
    session.status = "submitted"; 
    session.answers = processedAnswers; 

    await session.save();

    // --- RESPOND TO FRONTEND ---
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                sessionId: session._id,
                score: session.score,
                results: session.answers, 
            },
            "Quiz submitted successfully"
        )
    );
});