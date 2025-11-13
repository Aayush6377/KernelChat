import { create } from "zustand";
import { images } from "../assets/assets.js";

const defaultUser = {
  fullName: "",
  email: "",
  profilePic: images.defaultProfile,
};

const useAuthStore = create((set) => ({
  user: defaultUser,
  isLoggedIn: true,
  appLoading: false,


  setUser: (user) => set({ user }),

  setAppLoading: (status) => set({ appLoading: status }),

  setLogin: (user) => set({ user, isLoggedIn: true }),
  setLogout: () => set({ user: defaultUser, isLoggedIn: false }),
}));

export default useAuthStore;
