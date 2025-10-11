import mongoose, {schema} from "mongoose";
const attemptedSchema = new Schema ({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    quizId: {type: mongoose.Schema.Types.ObjectId, ref: "Quiz"},
    startedAt: {type: Date, default: Date.now},
    completedAt: {type: Date},
    score: {type: Number, default: 0},
    submitted : {type: Boolean, default: false},
    warningCount: {type: Number, default: 0},
    disqualified: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},

}, {timestamps: true}
)
export const attempted = mongoose.model("attempted",attemptedSchema);