import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import { audios } from "../assets/assets";

const useChatStore = create((set, get) => ({
    messages: [],
    activeTab: "all",
    selectedUser: null,
    searchTerm: "",
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    toggleSound: () => {
        const newSoundState = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", newSoundState);
        set({ isSoundEnabled: newSoundState });
    },

    setMessages: (messages) => set({ messages }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (user) => set({ selectedUser: user }),
    setSearchTerm: (term) => set({ searchTerm: term }),

    subscribeToMessage: () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const isMessageFromSelectedUser = newMessage.senderId === (selectedUser.userId || selectedUser._id);
            if (!isMessageFromSelectedUser) return;

            const currentMessages = get().messages;
            set({ messages: [ ...currentMessages , newMessage] });

            if (isSoundEnabled){
                audios.notification.currentTime = 0;
                audios.notification.play().catch(err => {
                    console.error("Notification error: ", err);
                });
            }
        });

        socket.on("messageDeleted", (messageId) => {
            set({ messages: get().messages.filter((m) => m._id !== messageId) });
        });

        socket.on("messageUpdated", ({ messageId, newText }) => {
            set({
                messages: get().messages.map((m) => 
                    m._id === messageId ? { ...m, text: newText } : m
                )
            });
        });
    },

    unsubscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messageDeleted"); 
        socket.off("messageUpdated");
    },

    removeMessage: (msgId) => set({ messages: get().messages.filter(m => m._id !== msgId) }),
    updateMessage: (msgId, newText) => set({ messages: get().messages.map(m => m._id === msgId ? { ...m, text: newText } : m) }),
}));

export default useChatStore;