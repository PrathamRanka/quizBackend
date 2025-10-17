# OWASP Quiz Platform - Comprehensive

# Documentation

This document provides a complete overview of the OWASP Quiz Platform's backend,
including the API for frontend consumption and a detailed breakdown of the internal
architecture.

**Base URL** : /owasp-quiz

## Part 1: API Reference for Frontend

This section details every API endpoint, its purpose, required data, and expected responses. It
is primarily intended for frontend developers consuming the API.

### Authentication

#### 1. User Signup

```
● Endpoint : /auth/signup

● Method : POST

● Description : Registers a new user in the system.

● Protected : No

● Request Body :
{
"fullName": "Jane Doe",
"email": "jane.doe@example.com",
"password": "strongpassword123",
"rollNumber": "CB.EN.U4CSE20123",
"phoneNumber": "1234567890"
}
```
```
● Success Response (201) :
{
"statusCode": 201,
"data": {
"user": { "id": "...", "fullName": "...", "email": "...", "role": "..." },
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
},
"message": "User registered successfully"
}
```

#### 2. User Login

```
● Endpoint : /auth/login

● Method : POST

● Description : Authenticates a user and returns an access token.

● Protected : No

● Request Body :
{
"identifier": "jane.doe@example.com", // Can be email OR rollNumber
"password": "strongpassword123"
}
```

```
● Success Response (200) : Sets a refreshToken in an HTTP-only cookie and returns user
data and an access token.
{
"statusCode": 200,
"data": {
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": { "id": "...", "email": "...", "fullName": "...", "role": "..." }
},
"message": "Logged in successfully"
}
```
#### 3. User Logout

```
● Endpoint : /auth/logout

● Method : POST

● Description : Logs the user out by clearing their refresh token.

● Protected : No (but requires a refreshToken cookie).

● Success Response (200) :
{ "statusCode": 200, "message": "Logged out successfully" }
```
### Quiz Flow

#### 1. View Quiz Instructions

```
● Endpoint : /instructions

● Method : POST

● Description : Creates a quiz session for the user and marks that they have seen the
instructions. This must be called before starting the quiz.

● Protected : Yes (Requires Bearer Token)

● Request Body : {"quizId": "60d0fe4f5311236168a109cb"}

● Success Response (200) :
{
```

```
"statusCode": 200,
"data": { "sessionId": "60d1021f5311236168a109cc" },
"message": "Instructions viewed successfully"
}
```
#### 2. Start a Quiz

```
● Endpoint : /quizzes/:quizId/start

● Method : POST

● Description : Fetches the questions for a specific quiz.

● Protected : Yes (Requires Bearer Token)

● URL Parameter : quizId (The _id of the quiz).

● Success Response (200) : Returns the session ID and an array of questions. isCorrect
field is removed from options for security.
{
"statusCode": 200,
"data": {
"sessionId": "...",
"questions": [
{ "_id": "...", "questionText": "...", "marks": 5, "options": [...] }
]
},
"message": "Quiz started successfully"
}
```
#### 3. Submit a Quiz

```
● Endpoint : /sessions/:sessionId/submit

● Method : POST

● Description : Submits the user's answers, calculates the score on the server, and ends
the quiz session.

● Protected : Yes (Requires Bearer Token)

● URL Parameter : sessionId (The _id of the user's session).

● Request Body :
{
"answers": [
{ "questionId": "...", "selectedOption": "..." }
]
}
```

```
● Success Response (200) :
{
"statusCode": 200,
```

```
"data": {
"sessionId": "...",
"score": 5,
"results": [
{ "questionId": "...", "selectedOption": "...", "isCorrect": true, "correctAnswer": "..." }
]
},
"message": "Quiz submitted successfully"
}

```
## Part 2: Backend Architecture Deep Dive

This section is for developers who want to understand the internal workings of the API,
including the database structure and controller logic.

### 1. Database Schemas (Models)

The database is structured around four core models that manage users, quizzes, questions,
and user attempts.

#### user.model.js

```
● Purpose : Represents an individual user account.

● Key Fields :
○ fullName, email, rollNumber, phoneNumber: Store user's personal and contact
information. email and rollNumber are unique identifiers.
○ password: Stores the hashed password using bcrypt.
○ role: An enum that can be either "user" or "admin", allowing for role-based access
control.
○ refreshToken: Stores the JWT refresh token for persistent login sessions.

● Methods :
○ isPasswordCorrect(): Compares a given password with the stored hash.
○ generateAccessToken(), generateRefreshToken(): Creates signed JWTs for
authentication.
```
#### quiz.model.js

```
● Purpose : Represents a single quiz. It acts as a container for a set of questions.

● Key Fields :
○ title: The display name of the quiz.
○ durationSec: The total time allowed for the quiz in seconds.
○ shuffleQuestions: A boolean to determine if the question order should be randomized
for each user.
```
#### questions.model.js


```
● Purpose : Represents a single question within a quiz.

● Key Fields :
○ quizId: A reference (ObjectId) to the Quiz this question belongs to.
○ questionText: The main text of the question.
○ options: An array of objects, where each object contains optionText and a boolean
isCorrect.
○ marks: The number of points this question is worth.
```
#### attempted.model.js (Session Schema)

```
● Purpose : Represents a user's attempt at a quiz, tracking the entire state of a session.

● Key Fields :
○ userId, quizId: References to the user and the quiz.
○ answers: An array where user's answers are embedded.
○ score: The final score, calculated securely on the server.
○ status: An enum tracking the session's state ("in_progress", "submitted",
"disqualified").
○ hasViewedInstructions: A boolean flag to gate access to the quiz.

● Timestamps : The createdAt field automatically serves as the startedAt time.
```
### 2. Controllers

Controllers contain the core business logic.

```
● signUpUser.controller.js : Handles new user registration, validation, password hashing,
and token generation.

● loginUser.controller.js : Manages user login, password verification, and token
generation.

● logoutUser.controller.js : Handles user logout by clearing the refresh token.

● instruction.controller.js : Finds or creates a Session and sets the hasViewedInstructions
flag.

● quiz.controller.js (startQuiz) : Verifies the session, fetches questions, and strips correct
answers before sending them to the client.

● submitQuiz.controller.js : Handles the final submission and performs secure, server-side
scoring by comparing user answers against the correct answers fetched directly from the
database.
```
## Part 3: Setup and Usage Guide

This section provides instructions for setting up and running the backend server locally.

### 1. Environment Setup (.env file)

Before running the application, you must create a .env file in the root directory of the project.
Copy the following content into it:
```
PORT=8000
MONGODB_URI=mongodb+srv://your-db
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your-token-secret
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
```
```
Note : For production, replace CORS_ORIGIN=* with your frontend's domain.
```
### 2. How to Use This Backend

**Step 1: Install Dependencies**

```npm install```

**Step 2: Start the Server**

```npm run dev```

**Step 3: Test Endpoints with an API Client**
The typical user workflow is outlined in Part 1. Remember to include the accessToken as a
Bearer Token in the Authorization header for all protected routes.

## Part 4: Frontend Responsibilities

This backend provides the data and logic, but the frontend is responsible for the user
experience. Here is a list of tasks the frontend team needs to implement:

### 1. Quiz Timer Management

The backend provides the durationSec for a quiz, but it does **not** enforce the time limit. The
frontend must:

```
● Start a countdown timer as soon as the quiz begins.

● Display the remaining time to the user.

● Automatically trigger the submit quiz functionality when the timer reaches zero.
```
### 2. Question and Answer Handling

```
● State Management : Maintain the user's selected answers for each question in the
client-side state.

● Question Navigation : Implement UI for navigating between questions (e.g., "Next,"
```

```
"Previous" buttons).
● Data Formatting : On submission, format the user's answers into the JSON structure
required by the /sessions/:sessionId/submit endpoint.
```
### 3. UI/UX Considerations

```
● Conditional Rendering : Display different UI components based on the user's progress
(e.g., show instructions screen, then the question view, then the results screen).

● Loading and Disabled States : Show loading indicators during API calls and disable
buttons (like "Submit") to prevent duplicate requests.

● Result Display : After submission, use the response data to create a detailed results page
showing the user's score, which questions they got right or wrong, and the correct
answers.
```
### 4. Error Handling and User Feedback

```
● Implement a global error handler to catch API errors.

● Provide clear, user-friendly feedback for both success and error scenarios (e.g., "Invalid
password," "Quiz submitted successfully").
```
## Part 5: License

This project is licensed under the MIT License.

MIT License
