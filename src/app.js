// imports
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

    // routes import

    import signUpRoute from "./routes/signup.routes.js";
    import loginRoute from "./routes/login.routes.js";
    import instructionsRoute  from "./routes/instructions.routes.js";
    import startQuizRoute from "./routes/startQuiz.route.js";
    import logoutRoute from "./routes/logout.routes.js";
    // import saveAnswerRoute from "./routes/saveAnswer.routes.js";
    import submitRoute from "./routes/submit.routes.js";
    import adminRoutes from "./routes/admin.routes.js";

    // routes declaration

    app.use("/owasp-quiz/auth", signUpRoute);
    app.use("/owasp-quiz/auth", loginRoute);
    app.use("/owasp-quiz/", instructionsRoute);
    app.use("/owasp-quiz/", startQuizRoute);
    // app.use("/owasp-quiz/", saveAnswerRoute);
    app.use("/owasp-quiz/", submitRoute);
    app.use("/owasp-quiz/auth", logoutRoute);
    app.use("/owasp-quiz/admin", adminRoutes);

    export {app}