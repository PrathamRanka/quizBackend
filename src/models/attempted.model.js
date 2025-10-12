import mongoose, { Schema } from "mongoose";
import { answerSchema } from "./answers.model.js";

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  startedAt: { type: Date, default: Date.now },
  answers: { type: [answerSchema], default: [] },
  completedAt: { type: Date },
  score: { type: Number, default: 0 },
  submitted: { type: Boolean, default: false },
  warningCount: { type: Number, default: 0 },
  disqualified: { type: Boolean, default: false },
  status: { type: String, enum: ["in_progress", "submitted", "disqualified"], default: "in_progress" },
  hasViewedInstructions: { type: Boolean, default: false } 
}, { timestamps: true });

export const Session = mongoose.model("Session", sessionSchema);
