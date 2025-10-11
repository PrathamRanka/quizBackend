# QUIZ - Portal Backend


# UTILS 
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