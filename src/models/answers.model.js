import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: "Questions", required: true },
  selectedOption: { type: String, required: true },
  answeredAt: { type: Date, default: Date.now },
  timeSpentSec: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export const Answer = mongoose.model("Answer", answerSchema);
export { answerSchema }; // export schema for embedding in Session
