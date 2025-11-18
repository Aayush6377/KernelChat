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
        const res = await api.post(`/api/messages/send/${receiverId}`, { text, image });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}