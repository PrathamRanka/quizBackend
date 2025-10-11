import mongoose, {schema} from "mongoose";

const answerSchema = new Schema ({
  

   questionId: {type: mongoose.Schema.Types.ObjectId, ref: "questions"},

   selectedOption: {type: String, required: true},
   answeredAt: {type: Date, default: Date.now},
   timeSpentSec: {type: Number, required: true, default: 0},
}, {timestamps: true}
)
export const answers = mongoose.model("answers",answerSchema);