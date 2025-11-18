import mongoose from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

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
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    }
}, { timestamps: true });

messageSchema.pre("validate", function(next) {
    if (!this.text && !this.image) {
        next(new Error("Message must contain either text or an image."));
    } else {
        next();
    }
});

messageSchema.plugin(fieldEncryption, {
    fields: ["text"], 
    secret: process.env.MSG_ENCRYPTION_KEY,
    salt: "a-static-salt-for-this-app",
});

const MESSAGE = mongoose.model("Message", messageSchema);

export default MESSAGE;