import mongoose from "mongoose";
import MESSAGE from "../models/message.model.js";
import createError from "../utils/createError.js";
import CONVERSATION from "../models/conversation.model.js";
import CONTACT from "../models/contact.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessagesByUserId = async (req,res,next) => {
    try {
        const myId = req.userId;
        const { userToChatId } = req.params;

        if (!mongoose.isValidObjectId(userToChatId)){
            throw createError(400, "Invalid receiver ID");
        }

        const messages = await MESSAGE.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: -1 });

        const convo = await CONVERSATION.findOne({ participants: { $all: [myId, userToChatId] } });

        if (convo){
            convo.lastRead.set(myId.toString(), new Date());
            await convo.save();
        }

        res.status(200).json({ success: true, data: messages.reverse() });
    } catch (error) {
        next(error);
    }
}

export const getChatPartners = async (req, res, next) => {
  try {
    const myId = req.userId;
    const myObjectId = new mongoose.Types.ObjectId(myId);
    const { search, listType = "all" } = req.query;

    const pipeline = [
      { $match: { participants: myObjectId } },
      {
        $addFields: {
          partnerId: {
            $first: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: { $ne: ["$$participant", myObjectId] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "partnerId",
          foreignField: "_id",
          as: "partnerInfo",
        },
      },
      { $unwind: "$partnerInfo" },
      {
        $lookup: {
          from: "contacts",
          let: { partnerId: "$partnerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner", myObjectId] },
                    { $eq: ["$contact", "$$partnerId"] },
                  ],
                },
              },
            },
            { $project: { nickname: 1, isFavorite: 1, isBlocked: 1, _id: 0 } },
          ],
          as: "contactInfo",
        },
      },
      { $unwind: { path: "$contactInfo", preserveNullAndEmptyArrays: true } },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "partnerInfo.fullName": { $regex: search, $options: "i" } },
                  { "partnerInfo.email": { $regex: search, $options: "i" } },
                  { "contactInfo.nickname": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      ...(listType === "contacts"
        ? [{ $match: { contactInfo: { $ne: null } } }]
        : []),
      ...(listType === "favorites"
        ? [{ $match: { "contactInfo.isFavorite": true } }]
        : []),
      {
        $addFields: {
          myLastReadEntry: {
            $first: {
              $filter: {
                input: { $objectToArray: "$lastRead" },
                as: "readEntry",
                cond: { $eq: ["$$readEntry.k", myId] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          myLastReadTime: { $ifNull: ["$myLastReadEntry.v", new Date(0)] },
        },
      },
      {
        $lookup: {
          from: "messages",
          let: {
            conversationId: "$_id",
            myLastReadTime: "$myLastReadTime",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$conversationId", "$$conversationId"] },
                    { $eq: ["$receiverId", myObjectId] },
                    { $gt: ["$createdAt", "$$myLastReadTime"] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "unseenMessages",
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageDoc",
        },
      },
      {
        $unwind: { path: "$lastMessageDoc", preserveNullAndEmptyArrays: true },
      },
      { $sort: { "lastMessageDoc.createdAt": -1 } },
      {
        $project: {
          _id: 0,
          userId: "$partnerInfo._id",
          profilePic: "$partnerInfo.profilePic",
          name: {
            $ifNull: [
              "$contactInfo.nickname",
              "$partnerInfo.fullName",
              "$partnerInfo.email",
            ],
          },
          lastMessageId: "$lastMessage",
          unseenMessages: {
            $ifNull: [{ $first: "$unseenMessages.count" }, 0],
          },
          isContact: { $cond: { if: "$contactInfo", then: true, else: false } },
          isFavorite: { $ifNull: ["$contactInfo.isFavorite", false] },
          isBlocked: { $ifNull: ["$contactInfo.isBlocked", false] },
        },
      },
    ];

    let chatPartners = await CONVERSATION.aggregate(pipeline);

    const lastMessageIds = chatPartners
      .map((partner) => partner.lastMessageId)
      .filter((id) => id);

    if (lastMessageIds.length > 0) {
      const messages = await MESSAGE.find({ _id: { $in: lastMessageIds } });
      const messageMap = new Map(
        messages.map((msg) => [msg._id.toString(), msg])
      );
      chatPartners.forEach((partner) => {
        if (partner.lastMessageId) {
          const decryptedMessage = messageMap.get(
            partner.lastMessageId.toString()
          );
          partner.lastMessage = {
            text: decryptedMessage?.text,
            image: decryptedMessage?.image,
            senderId: decryptedMessage?.senderId,
            createdAt: decryptedMessage?.createdAt,
          };
        } else {
          partner.lastMessage = null;
        }
        delete partner.lastMessageId;
      });
    }

    let nonChatPartners = [];
    
    if (listType === "contacts" || listType === "favorites") {
      const chatPartnerIds = chatPartners.map((p) => p.userId);

      const contactFilter = {
        owner: myObjectId,
        contact: { $nin: chatPartnerIds },
      };

      if (listType === "favorites") {
        contactFilter.isFavorite = true;
      }

      let nonChatContacts = await CONTACT.find(contactFilter).populate({
        path: "contact", 
        select: "fullName email profilePic", 
      });

      if (search) {
        const searchRegex = new RegExp(search, "i");
        nonChatContacts = nonChatContacts.filter((doc) => {
          const user = doc.contact;
          if (!user) return false;
          return (
            searchRegex.test(user.fullName) ||
            searchRegex.test(user.email) ||
            (doc.nickname && searchRegex.test(doc.nickname))
          );
        });
      }

      nonChatPartners = nonChatContacts.map((doc) => {
        const user = doc.contact;
        return {
          userId: user._id,
          profilePic: user.profilePic,
          name: doc.nickname || user.fullName || user.email,
          lastMessage: null, 
          unseenMessages: 0,
          isContact: true, 
          isFavorite: doc.isFavorite,
        };
      });
    }
    const finalData = [...chatPartners, ...nonChatPartners];

    res.status(200).json({ success: true, data: finalData });
    
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req,res,next) => {
    try {
        const { receiverId } = req.params;
        const { text = null } = req.body;
        const senderId = req.userId;

        if (!mongoose.isValidObjectId(receiverId)){
            throw createError(400, "Invalid receiver ID");
        }

        if (senderId.toString() === receiverId) {
            throw createError(400, "You cannot chat with yourself");
        }

        const blockCheck = await CONTACT.findOne({ owner: receiverId, contact: senderId, isBlocked: true });

        if (blockCheck) {
            throw createError(403, "You cannot send a message to this user.");
        }

        let convo = await CONVERSATION.findOne({ participants: { $all: [senderId, receiverId] } });

        if (!convo){
            convo = new CONVERSATION({ participants: [senderId, receiverId], lastRead: {} });
        }

        let [ imageUrl, imagePublicId ] = [ null, null ];

        if (req.file){
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, { folder: "KernelChat/Messages", resource_type: "image" });

            imageUrl = uploadResponse.secure_url;
            imagePublicId = uploadResponse.public_id;

            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });
        }

        const newMessage = new MESSAGE({ senderId, receiverId, text, image: imageUrl, imagePublicId, conversationId: convo._id });
        await newMessage.save();

        convo.lastMessage = newMessage._id;
        convo.lastRead.set(senderId.toString(), new Date());
        await convo.save();

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId){
          io.to(receiverSocketId).emit("newMessage", {...newMessage._doc, text});
        }

        res.status(201).json({ success: true, data: {...newMessage._doc, text} });

    } catch (error) {
        next(error);
    }
}

export const deleteMessage = async (req,res,next) => {
  try {
    const { messageId } = req.params;
    const myId = req.userId;

    const message = await MESSAGE.findById(messageId);
    if (!message){
      throw createError(404, "Message Not Found");
    }

    if (message.senderId.toString() !== myId){
      throw createError(403, "Unauthorized User");
    }

    if (message.imagePublicId){
      const isUsedElsewhere = await MESSAGE.exists({ imagePublicId: message.imagePublicId, _id: { $ne: messageId } });

      if (!isUsedElsewhere){
        cloudinary.uploader.destroy(message.imagePublicId);
      }
    }

    await MESSAGE.findByIdAndDelete(messageId);

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    
    if (receiverSocketId){
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }

    res.status(200).json({ success: true, message: "Message Deleted",messageId });
  } catch (error) {
    next(error);
  }
}

export const editMessage = async (req,res,next) => {
  try {
    const { messageId } = req.params;
    const { newText } = req.body;
    const myId = req.userId;

    const message = await MESSAGE.findById(messageId);
    if (!message){
      throw createError(404, "Message Not Found");
    }

    if (message.senderId.toString() !== myId){
      throw createError(403, "Unauthorized User");
    }

    message.text = newText;
    message.isEdited = true;
    await message.save();

    const receiverSocketId = getReceiverSocketId(message.receiverId);

    if (receiverSocketId){
      io.to(receiverSocketId).emit("messageUpdated", { messageId, newText });
    }

    res.status(200).json({ success: true, message: "Message updated", data: message });
  } catch (error) {
    next(error);
  }
}

export const forwardMessage = async (req,res,next) => {
  try {
    const { messageId, receiverIds } = req.body;
    const senderId = req.userId;

    const originalMessage = await MESSAGE.findById(messageId);
    if (!originalMessage) return res.status(404).json({ message: "Message not found" });

    const newMessages = [];

    for (const receiverId of receiverIds){
      let convo = await CONVERSATION.findOne({ participants: { $all: [senderId, receiverId] } });
      if (!convo){
        convo = new CONVERSATION({ participants: [senderId, receiverId], lastRead: {} });
      }

      const newMessage = new MESSAGE({ senderId, receiverId, text: originalMessage.text, image: originalMessage.image, imagePublicId: originalMessage.imagePublicId, conversationId: convo._id });
      await newMessage.save();
      newMessages.push(newMessage);

      convo.lastMessage = newMessage._id;
      convo.lastRead.set(senderId.toString(), new Date());
      await convo.save();

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", { ...newMessage._doc, text: originalMessage.text });
      }
    }

    res.status(200).json({ success: true, message: "Message forwarded" });

  } catch (error) {
    next(error);
  }
}