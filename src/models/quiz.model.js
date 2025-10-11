import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema({
  quizId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  durationSec: { type: Number, required: true }, // quiz duration in seconds
  shuffleQuestions: { type: Boolean, default: true }, // fixed: True → true
}, { timestamps: true }); // adds createdAt and updatedAt

export const Quiz = mongoose.model("Quiz", QuizSchema);
