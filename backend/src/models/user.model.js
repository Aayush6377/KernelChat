import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    authProvider: {
        type: String,
        enum: ["google", "local"],
        required: true,
        default: "local"
    },
    password: {
        type: String,
        required: function(){ return this.authProvider === "local" } 
    },
    googleAuthId:{
        type: String,
        required: function(){ return this.authProvider === "google" }
    },
    profilePic: {
        type: String,
        default: null
    },
    profilePic_public_id: { 
        type: String,
        default: null
    }
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const USER = mongoose.model("User",UserSchema);

export default USER;