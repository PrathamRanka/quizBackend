// set by verifyJWT middleware
// frontend sends quizId of selected quiz
// 1. Validate quizId
// 2. Check if the quiz exists
 // 3. Check if a session already exists for this user and quiz
  // 4. Create a new session if it doesn't exist
   // 5. Mark that the user has viewed instructions
     // 6. Send success response
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Session } from "../models/attempted.model.js";
import { Quiz } from "../models/quiz.model.js";
import { asyncHandler } from "../utils/asyncHandler";

const showInstructions = async (req, res) => {

    const userId = req.user._id;
    const { quizId } = req.body;


    if (!quizId){
        throw new ApiError(400, "Quiz ID is required");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz){
        throw new ApiError(404, "Quiz not found");
    }

    let session = await Session.findOne({ userId, quizId});


    if (!session) {
    session = await Session.create({ userId, quizId });
  }

        session.hasViewedInstructions = true;
        await session.save();

        return res.status(200).json( new ApiResponse(200, "Instructions viewed", { sessionId: session._id}));


}

export { showInstructions };