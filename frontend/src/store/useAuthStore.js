import { create } from "zustand";
import { images } from "../assets/assets.js";
import { getProfileDetails } from "../services/authServices.js";

const defaultUser = {
  userId: null,
  fullName: "",
  email: "",
  profilePic: images.defaultProfile,
};

const useAuthStore = create((set, get) => ({
  user: defaultUser,
  isLoggedIn: false,
  appLoading: true,


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
        } else {
          set({ user: defaultUser, isLoggedIn: false });
        }
      } catch (error) {
        set({ user: defaultUser, isLoggedIn: false })
        console.error("Error fetching profile details:", error);
      } finally {
        set ({ appLoading: false });
      }
    }
}));

export default useAuthStore;
