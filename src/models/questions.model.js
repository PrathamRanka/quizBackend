import mongoose, { Schema } from "mongoose";

// Sub-schema for options
const OptionSchema = new Schema({
  id: { type: String, required: true },
  optionText: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
}, { _id: false });

const questionSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  // 'sessionId' has been removed to avoid data duplication.
  questionText: { type: String, required: true },
  position: { type: Number, required: true },
  marks: { type: Number, required: true, default: 0 },
  metadata: {
    imageUrl: { type: String },
    shuffleOptions: { type: Boolean, default: false },
  },
  options: { type: [OptionSchema], default: [] },
}, { timestamps: true });

export const Questions = mongoose.model("Questions", questionSchema);