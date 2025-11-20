import { create } from "zustand";
import { images } from "../assets/assets.js";
import { getProfileDetails } from "../services/authServices.js";
import { io } from "socket.io-client";

const defaultUser = {
  userId: null,
  fullName: "",
  email: "",
  profilePic: images.defaultProfile,
};

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const useAuthStore = create((set, get) => ({
  user: defaultUser,
  isLoggedIn: false,
  appLoading: true,
  socket: null,
  onlineUsers: [],

  setUser: (user) => set({ user }),

  setAppLoading: (status) => set ({ appLoading: status }),

  setLogin: (user) => set({ user, isLoggedIn: true }),
  setLogout: () => set({ user: defaultUser, isLoggedIn: false }),

  checkUserAuth: async () => {
      if (!get().appLoading) return;
      try {
        const res = await getProfileDetails();
        if (res.success && res.data) {
          set ({ user: res.data, isLoggedIn: true });
          get().connectSocket();
        } else {
          set({ user: defaultUser, isLoggedIn: false });
        }
      } catch (error) {
        set({ user: defaultUser, isLoggedIn: false })
        console.error("Error fetching profile details:", error);
      } finally {
        set ({ appLoading: false });
      }
    },

    connectSocket: () => {
      const { user } = get();
      if (!user || get().socket?.connected) return;

      const socket = io(BASE_URL, { withCredentials: true });

      socket.connect();

      set({socket});

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },

    disconnectSocket: () => {
      if (get().socket.connected){
        get().socket.disconnect();
      }
    }, 
}));

export default useAuthStore;
