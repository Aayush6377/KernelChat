import { create } from "zustand";

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
}));

export default useChatStore;