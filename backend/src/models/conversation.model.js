import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],

    lastRead: {
        type: Map,
        of: Date,
        default: {}
    },

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, { timestamps: true });

const CONVERSATION = mongoose.model("Conversation", conversationSchema);

export default CONVERSATION;