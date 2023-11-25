import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
    intro: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "super_admin"],
        default: ["user"],
    },
});

const User = mongoose.model("User", userSchema);

export default User;