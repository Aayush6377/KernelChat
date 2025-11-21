import mongoose from "mongoose";
import CONTACT from "../models/contact.model.js";
import CONVERSATION from "../models/conversation.model.js";
import MESSAGE  from "../models/message.model.js";
import createError from "../utils/createError.js";
import USER from "../models/user.model.js";

export const addContactByEmail = async (req,res,next) => {
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

export const addContactById = async (req,res,next) => {
    try {
        const { userToAddId } = req.body;
        const ownerId = req.userId;

        if (!userToAddId || !mongoose.isValidObjectId(userToAddId)){
            throw createError(400, "Invalid User ID");
        }

        const check = await USER.findById(userToAddId);

        if (!check){
            throw createError(404, "User Not Found");
        }

        const contact = await CONTACT.findOne({ owner: ownerId, contact: userToAddId });
        
        if (contact){
            throw createError(400,"This person is already in your contacts");
        }

        const newContact = new CONTACT({ owner: ownerId, contact: userToAddId });

        await newContact.save();
        res.status(201).json({ success: true, message: "Contact added successfully." });
    } catch (error) {
        next(error);
    }
}

export const toggleFavorite = async (req,res,next) => {
    try {
        const { userToAddId } = req.params;
        const ownerId = req.userId;

        if (!userToAddId || !mongoose.isValidObjectId(userToAddId)){
            throw createError(400, "Invalid User ID");
        }

        const check = await USER.findById(userToAddId);

        if (!check){
            throw createError(404, "User Not Found");
        }

        const contact = await CONTACT.findOne({ owner: ownerId, contact: userToAddId });
        
        if (!contact){
            throw createError(404,"Contact Not Found");
        }

        contact.isFavorite = !contact.isFavorite;
        await contact.save();

        res.status(200).json({ 
            success: true, 
            isFavorite: contact.isFavorite, 
            message: contact.isFavorite ? "Added to favorites" : "Removed from favorites" 
        });
    } catch (error) {
        next(error);
    }
}

export const toggleBlock = async (req,res,next) => {
    try {
        const { userToAddId } = req.params;
        const ownerId = req.userId;

        if (!userToAddId || !mongoose.isValidObjectId(userToAddId)){
            throw createError(400, "Invalid User ID");
        }

        const check = await USER.findById(userToAddId);

        if (!check){
            throw createError(404, "User Not Found");
        }

        const contact = await CONTACT.findOne({ owner: ownerId, contact: userToAddId });
        
        if (!contact){
            throw createError(404,"Contact Not Found");
        }

        contact.isBlocked = !contact.isBlocked;
        await contact.save();

        res.status(200).json({ 
            success: true, 
            isBlocked: contact.isBlocked,
            message: contact.isBlocked ? "Contact blocked" : "Contact unblocked" 
        });
    } catch (error) {
        next(error);
    }
}

export const getContactDetails = async (req,res,next) => {
    try {
        const { contactId } = req.params;
        const ownerId = req.userId;

        const contact = await CONTACT.findOne({ owner: ownerId, contact: contactId });
        
        if (!contact){
            throw createError(404,"Contact Not Found");
        }

        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
}

export const updateContactDetails = async (req,res,next) => {
    try {
        const { contactId } = req.params;
        const { nickname, notes } = req.body;
        const ownerId = req.userId;

        const contact = await CONTACT.findOne({ owner: ownerId, contact: contactId });
        if (!contact) throw createError(404, "Contact not found");

        if (nickname !== undefined) contact.nickname = nickname;
        if (notes !== undefined) contact.notes = notes;

        await contact.save();
        res.status(200).json({ success: true, data: contact, message: "Contact updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const deleteContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const ownerId = req.userId;

        const contact = await CONTACT.findOneAndDelete({ owner: ownerId, contact: contactId });
        if (!contact) throw createError(404, "Contact not found");

        res.status(200).json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
        next(error);
    }
};