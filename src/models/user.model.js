import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({}, {timestamps: true})



// write ahsh function here


// export schema
export const User = mongoose.model("User", userSchema)