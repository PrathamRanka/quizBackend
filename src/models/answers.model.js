import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: "Questions", required: true },
  selectedOption: { type: String, required: true },
  timeSpentSec: { type: Number, required: true, default: 0 },
}, { timestamps: true }); // 'createdAt' here acts as 'answeredAt'

export const Answer = mongoose.model("Answer", answerSchema);
export { answerSchema };  