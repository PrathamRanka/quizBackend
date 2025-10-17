import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema({
  // 'quizId' is removed; use the default '_id' as the unique identifier.
  title: { type: String, required: true },
  durationSec: { type: Number, required: true },
  shuffleQuestions: { type: Boolean, default: true },
}, { timestamps: true });

export const Quiz = mongoose.model("Quiz", QuizSchema);