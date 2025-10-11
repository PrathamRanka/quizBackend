import mongoose, {schema} from "mongoose";
const OptionSchema = new mongoose.Schema({
    
    id: {type: String, required: true},
    optionText: {type: String, required: true},
    isCorrect: {type: Boolean, required: true},
}, {_id: false});


const questionSchema = new Schema ({
quizId: {type: mongoose.Schema.Types.ObjectId, ref: "Quiz"},

 sessionId: {type:string, required:true},
questionText: {type: String, required: true},
options: [{type: String, required: true}],
marks: {type: Number, required: true, default: 0},
position : {type: Number, required: true},
metadata : { 
    imageUrl : {type: String},
shuffleOptions: {type: Boolean, default: false}
},
isCorrect: {type: Boolean, default: false},
  options: { type: [OptionSchema], default: [] }
}, {timestamps: true});

export const questions = mongoose.model("questions",questionSchema);