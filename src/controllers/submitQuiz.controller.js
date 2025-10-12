import { Session } from "../models/attempted.model.js";
import { Questions } from "../models/questions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const submitQuiz = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { sessionId } = req.params;

  // Fetch session
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  //  Check if already submitted or disqualified
  if (session.status === "submitted") {
    throw new ApiError(400, "Quiz already submitted");
  }
  if (session.status === "disqualified") {
    throw new ApiError(403, "You have been disqualified");
  }

  //  Fetch all questions for this quiz
  const questions = await Questions.find({ quizId: session.quizId });
  if (!questions || questions.length === 0) {
    throw new ApiError(404, "No questions found for this quiz");
  }

  //  Calculate score
  let totalScore = 0;

  questions.forEach((q) => {
    const userAnswer = session.answers.find(
      (a) => a.questionId.toString() === q._id.toString()
    );

    if (userAnswer) {
      // Find correct option
      const correctOption = q.options.find((o) => o.isCorrect);
      if (correctOption && userAnswer.selectedOption === correctOption.id) {
        totalScore += q.marks;
      }
    }
  });

  //  Update session
  session.completedAt = new Date();
  session.score = totalScore;
  session.status = "submitted";

  await session.save();

  //  Return result to frontend
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sessionId: session._id,
        score: session.score,
        completedAt: session.completedAt,
        status: session.status,
      },
      "Quiz submitted successfully"
    )
  );
});

export { submitQuiz };
