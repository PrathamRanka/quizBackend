// models/Quiz.js
import mongoose, {Schema} from "mongoose";

const QuizSchema = new Schema({
  quizId: { type: String, required: true, unique: true },
  title: { type: String, required: true },

  durationSec: { type: Number, required: true }, // quiz duration in seconds
  shuffleQuestions: { type: Boolean, default: True },
  createdAt: { type: Date, default: Date.now }
});

export const Quiz = mongoose.model("Quiz", QuizSchema);
