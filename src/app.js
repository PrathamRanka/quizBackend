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
// import route from "./"
import signUpRoute from "./routes/signup.routes.js";
import loginRoute from "./routes/login.routes.js";
import logoutRoute from "./routes/logout.routes.js";
// routes declaration
//app.use("/v1....", routeName)
app.use("/owasp-quiz/auth", signUpRoute);
app.use("/owasp-quiz/auth", loginRoute);
app.use("/owasp-quiz/auth", logoutRoute);

export {app}