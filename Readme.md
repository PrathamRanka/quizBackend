# QUIZ - Portal Backend
Fully functional backend in NODE, EXPRESS & Mongoose



# Quiz - Portal Frontend 
https://github.com/CoderAnmolMittal/quiz_portal


# UTILS 
    Few Files and their Usage
    -ApiError.js 
    Creates structured error objects for cleaner error responses and easier debugging.
    eg: if (!user) throw new ApiError(404, "User not found");

    -ApiResponse.js
    Gives all success responses a consistent structure for frontend and debugging.
    eg: res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"))

    -asyncHandler.js
    Wraps async functions so you don’t have to write try...catch everywhere.
    eg: app.get("/users", asyncHandler(async (req, res) => {
        const users = await User.find();
        res.json(users);
        }));

        If User.find() fails, the error automatically goes to your error handler — no manual try catch needed.


# src/controllers

    registerUser.controller.js	
    Handles signup — hashes password, sets role to "user", and returns JWT tokens.

    loginUser.controller.js	
    Verifies email/password, returns new tokens and user info, and saves refresh token in DB.

    logoutUser.controller.js
    Logs out by deleting refresh token and clearing cookies (for both users and admins).

    generateAccessAndRefreshToken.controller.js	
    Creates new JWT tokens; ensures session continuity when one expires.

    refreshAccessToken.js	
    Refreshes access token silently using refresh token (auto-relogin mechanism).

    user.controller.js	
    Handles user dashboard actions update profile, get quiz list, etc. (auth-protected).

    createQuiz.controller.js	
    Admin-only — add, edit, or delete quiz questions.

    submitQuiz.controller.js	
    Handles quiz submission — auto-checks answers and saves score.

    getQuiz.controller.js	
    Sends quiz questions to user without correct answers (to prevent cheating).

    manageUsers.controller.js	
    Admin-only — manage users, reset quiz attempts, or update roles.