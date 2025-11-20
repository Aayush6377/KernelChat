import api from "./axios";

export const getChatList = async ({ search, listType = "all" }) => {
    try {
        const res = await api.get("/api/messages/chats/list", {
            params: { search, listType }
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getMessagesByUserId = async (userToChatId) => {
    try {
        const res = await api.get(`/api/messages/chat/${userToChatId}`);
        return res.data;
    } catch (error) {
        console.log(error);
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
        console.log(error);
        throw error;
    }
}

export const deleteMessage = async (messageId) => {
    try {
        const res = await api.delete(`/api/messages/delete/${messageId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const editMessage = async (messageId, newText) => {
    try {
        const res = await api.put(`/api/messages/edit/${messageId}`, { newText });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}