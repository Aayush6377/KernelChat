import CONTACT from "../models/contact.model.js";
import CONVERSATION from "../models/conversation.model.js";
import MESSAGE  from "../models/message.model.js";

export const addContact = async (req,res,next) => {
    try {
        const { nickname, notes } = req.body;
        const ownerId = req.userId;
        const userToContactId = req.userToContactId;

        const newContact = new CONTACT({ owner: ownerId, contact: userToContactId, nickname, notes });

        await newContact.save();
        res.status(201).json({ success: true, message: "Contact added successfully." });
    } catch (error) {
        next(error);
    }
}