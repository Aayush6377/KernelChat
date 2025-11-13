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

export const getContactList = async (req,res,next) => {
    try {
        const userId = req.userId;

        const myContacts = await CONTACT.find({ owner: userId }).populate("contact", "fullName profilePic email");

        let enrichedContacts = [];

        for (const c of myContacts){
            const contactUser = c.contact;
            if (!contactUser) continue;

            const contactUserId = contactUser._id;
            let unseenCount = 0;
            let lastMessageTime = new Date(0);

            const convo = await CONVERSATION.findOne({ participants: { $all: [userId, contactUserId] } }).populate("lastMessage", "createdAt");

            if (convo){
                const myLastRead = convo.lastRead.get(userId.toString()) || new Date(0);

                unseenCount = await MESSAGE.countDocuments({ senderId: contactUserId, receiverId: userId, createdAt: { $gt: myLastRead } });

                if (convo.lastMessage){
                    lastMessageTime = convo.lastMessage.createdAt;
                }
            }

            enrichedContacts.push({ user: contactUser, isFavorite: c.isFavorite, unseenCount, lastMessageTime });
        }

        enrichedContacts.sort((a, b) => {
            if (a.unseenCount > 0 && b.unseenCount === 0) return -1;
            if (b.unseenCount > 0 && a.unseenCount === 0) return 1;

            if (a.unseenCount > 0 && b.unseenCount > 0) {
                if (a.unseenCount !== b.unseenCount) {
                    return b.unseenCount - a.unseenCount;
                }
            }

            if (a.lastMessageTime.getTime() !== b.lastMessageTime.getTime()) {
                return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
            }

            if (a.isFavorite !== b.isFavorite) {
                return b.isFavorite ? -1 : 1;
            }

            return a.user.fullName.localeCompare(b.user.fullName);
        });

        res.status(200).json({ success: true, data: enrichedContacts });
    } catch (error) {
        next(error);
    }
}