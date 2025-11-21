import api from "./axios";

export const getChatList = async ({ search, listType = "all" }) => {
    try {
        const res = await api.get("/api/messages/chats/list", {
            params: { search, listType }
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getMessagesByUserId = async (userToChatId) => {
    try {
        const res = await api.get(`/api/messages/chat/${userToChatId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const sendMessage = async (receiverId, text, image) => {
    try {
        const formData = new FormData();

        if (text){
            formData.append("text", text);
        }

        if (image){
            formData.append("image", image);
        }

        const res = await api.post(`/api/messages/send/${receiverId}`, formData);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteMessage = async (messageId) => {
    try {
        const res = await api.delete(`/api/messages/delete/${messageId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const editMessage = async (messageId, newText) => {
    try {
        const res = await api.put(`/api/messages/edit/${messageId}`, { newText });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const addContactByEmail = async ({ email, nickname, notes }) => {
    try {
        const res = await api.post("/api/contacts/add/email", { email, nickname, notes });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const addContactById = async (userToAddId) => {
    try {
        const res = await api.post("/api/contacts/add/id", { userToAddId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const toggleFavorite = async (userToAddId) => {
    try {
        const res = await api.put(`/api/contacts/favorite/${userToAddId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const toggleBlock = async (userToAddId) => {
    try {
        const res = await api.put(`/api/contacts/block/${userToAddId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getContactInfo = async (userId) => {
    try {
        const res = await api.get(`/api/contacts/${userId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateContactInfo = async ({ userId, nickname, notes }) => {
    try {
        const res = await api.put(`/api/contacts/update/${userId}`, { nickname, notes });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const removeContact = async (userId) => {
    try {
        const res = await api.delete(`/api/contacts/delete/${userId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateProfile = async ({ fullName, profilePic }) => {
    try {
        const formData = new FormData();

        if (fullName) formData.append("fullName", fullName);
        if (profilePic) formData.append("profilePic", profilePic);

        const res = await api.patch("/api/auth/profile/update", formData);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const changePassword = async ({ password, confirm }) => {
    try {
        const res = await api.put("/api/auth/profile/password", { password, confirm });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteMyAccount = async () => {
    try {
        const res = await api.delete("/api/auth/profile/delete");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}