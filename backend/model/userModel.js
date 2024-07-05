import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    displayName: String
});


export const User = new mongoose.model("User", userSchema);
