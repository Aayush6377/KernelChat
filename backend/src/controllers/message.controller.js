import mongoose from "mongoose";
import MESSAGE from "../models/message.model.js";
import createError from "../utils/createError.js";
import CONVERSATION from "../models/conversation.model.js";
import CONTACT from "../models/contact.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

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

    const pipeline = [
      { $match: { $or: [{ senderId: myObjectId }, { receiverId: myObjectId }] } },
      { $sort: { createdAt: -1 } },

      { $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", myObjectId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessageTime: { $first: "$createdAt" },
          lastMessage: { $first: "$$ROOT" }
      }},

      { $sort: { lastMessageTime: -1 } },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "partnerInfo"
        }
      },

      {
        $lookup: {
          from: "contacts",
          let: { partnerId: "$_id" },
          pipeline: [
            { $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner", myObjectId] },
                    { $eq: ["$contact", "$$partnerId"] }
                  ]
                }
            } },
            { $project: { nickname: 1, _id: 0 } }
          ],
          as: "contactInfo"
        }
      },

      { $unwind: { path: "$partnerInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$contactInfo", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          userId: "$partnerInfo._id",
          email: "$partnerInfo.email",
          profilePic: "$partnerInfo.profilePic",
          name: { $ifNull: ["$contactInfo.nickname", "$partnerInfo.fullName"] },
          lastMessageTime: "$lastMessageTime",
          lastMessage: "$lastMessage._id"
        }
      }
    ];

    const chatPartners = await MESSAGE.aggregate(pipeline);
    res.status(200).json({ success: true, data: chatPartners });
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

        const newMessage = new MESSAGE({ senderId, receiverId, text, image: imageUrl, imagePublicId });
        await newMessage.save();

        convo.lastMessage = newMessage._id;
        convo.lastRead.set(senderId.toString(), new Date());
        await convo.save();

        // const io = req.app.get('socketio');
        
        // // We need a way to find the receiver's specific socket
        // // (This is managed in your main socket.io connection logic)
        // const receiverSocketId = getReceiverSocketId(receiverId); // You must implement this helper
        
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("newMessage", newMessage);
        // }

        res.status(201).json({ success: true, data: newMessage });

    } catch (error) {
        next(error);
    }
}