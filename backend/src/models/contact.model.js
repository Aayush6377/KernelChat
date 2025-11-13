import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    nickname: {
        type: String,
        trim: true,
        default: null
    },

    notes: {
        type: String,
        trim: true,
        default: null
    },

    isFavorite: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

contactSchema.pre("validate", function(next){
    if (this.owner.equals(this.contact)) {
        next(new Error("A user cannot add themselves as a contact."));
    } else {
        next();
    }
});

contactSchema.index({ owner: 1, contact: 1 }, { unique: true });

const CONTACT = mongoose.model("Contact", contactSchema);

export default CONTACT;