import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @description This controller checks if a quiz is allowed to start.
 * @summary It supports a "default" quiz that can run anytime and a scheduled quiz based on QUIZ_START_TIME.
 * @returns {ApiResponse} Responds with status "running" or "waiting".
 */
const checkServerStatus = asyncHandler(async (req, res) => {
  // 1. Check if the frontend is asking for the default "run anytime" quiz.
  // The frontend can make a request to /status?mode=default
  const { mode } = req.query;

  if (mode === 'default') {
    // If the mode is 'default', immediately approve the quiz start.
    // This is perfect for development or for quizzes that don't need a schedule.
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "running" }, "Default quiz mode is active."));
  }

  // --- Logic for the SCHEDULED quiz ---

  // 2. Get the configured start time from your .env file
  const quizStartTimeString = process.env.QUIZ_START_TIME;

  // 3. Handle missing configuration for the scheduled quiz
  if (!quizStartTimeString) {
    // If the start time isn't set, you might want to prevent the scheduled quiz from running
    // to avoid accidental starts. Here, we'll log a warning and let it run for flexibility.
    console.warn("WARNING: QUIZ_START_TIME is not set in the .env file. Defaulting scheduled quiz to 'running'.");
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "running" }, "Server is active (no start time configured for scheduled quiz)."));
  }

  // 4. Compare the current time with the configured start time
  const quizStartTime = new Date(quizStartTimeString);
  const currentTime = new Date();

  if (currentTime >= quizStartTime) {
    // If the current time is at or after the start time, the quiz is live.
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "running" }, "The scheduled quiz is now active."));
  } else {
    // If the current time is before the start time, users must wait.
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "waiting", startTime: quizStartTime.toISOString() }, "The scheduled quiz has not started yet."));
  }
});

export { checkServerStatus };

