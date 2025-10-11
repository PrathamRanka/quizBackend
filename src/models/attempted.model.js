import mongoose, {schema} from "mongoose";
import { User } from "./user.model.js";
import { Quiz } from "./quiz.model.js";
import { answerSchema } from "./answers.model.js";

const sessionSchema = new Schema ({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    quizId: {type: mongoose.Schema.Types.ObjectId, ref: "Quiz"},
    startedAt: {type: Date, default: Date.now},
    answers: [answerSchema],
    completedAt: {type: Date},
    score: {type: Number, default: 0},
    submitted : {type: Boolean, default: false},
    warningCount: {type: Number, default: 0},
    disqualified: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    
    status: { type: String, enum: ["in_progress","submitted","disqualified"], default: "in_progress" }

}, {timestamps: true}
)
export const session = mongoose.model("session",sessionSchema);