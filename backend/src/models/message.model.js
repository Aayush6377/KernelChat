import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    image: {
        type: String
    },
    imagePublicId: {
        type: String
    }
}, { timestamps: true });

messageSchema.pre("validate", function(next) {
    if (!this.text && !this.image) {
        next(new Error("Message must contain either text or an image."));
    } else {
        next();
    }
});

const MESSAGE = mongoose.model("Message", messageSchema);

export default MESSAGE;