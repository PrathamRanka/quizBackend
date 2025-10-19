// imports
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});

    const app = express()

    const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


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
    import statusRoute from "./routes/status.routes.js";
    import submitRoute from "./routes/submit.routes.js";
    import adminRoutes from "./routes/admin.routes.js";
    import exportDataRoutes from "./routes/exportData.routes.js";

    // routes declaration
    app.use("/owasp-quiz/auth", signUpRoute);
    app.use("/owasp-quiz/auth", loginRoute);
    app.use("/owasp-quiz/", instructionsRoute);
    app.use("/owasp-quiz/", startQuizRoute);
    app.use("/owasp-quiz", statusRoute);
    app.use("/owasp-quiz/", submitRoute);
    app.use("/owasp-quiz/auth", logoutRoute);
    app.use("/owasp-quiz/admin", adminRoutes);
    app.use("/owasp-quiz/admin", exportDataRoutes);

    export {app}