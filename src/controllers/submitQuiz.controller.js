

import Session from "../models/session.model.js";
import Question from "../models/questions.model.js";

export const submitQuiz = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // 1️⃣ Fetch the session
    const session = await Session.findById(sessionId);
    if (!session) return res.status(400).json({ message: "Invalid session" });

    if (session.disqualified)
      return res.status(403).json({ message: "You are disqualified", disqualified: true });

    if (session.status === "submitted")
      return res.status(400).json({ message: "Quiz already submitted" });

    // 2️⃣ Fetch all questions for this quiz
    const questionIds = session.answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // 3️⃣ Calculate score
    let score = 0;
    let maxScore = 0;

    questions.forEach(question => {
      const userAnswer = session.answers.find(a =>
        a.questionId.equals(question._id)
      );

      maxScore += question.marks;

      if (!userAnswer) return; // unanswered question

      // Single-choice: find the correct option
      const correctOption = question.options.find(o => o.is_correct);
      if (userAnswer.selectedOption === correctOption.id) {
        score += question.marks;
      }
    });

    // 4️⃣ Update session
    session.score = score;
   
    session.completedAt = new Date();
    session.status = "submitted";

    await session.save();

    // 5️⃣ Return result
    return res.status(200).json({
      ok: true,
      score,
      maxScore,
      submittedAt: session.completedAt,
      warnings: session.warningCount,
      disqualified: session.disqualified
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
