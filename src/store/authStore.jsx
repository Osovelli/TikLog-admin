import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  adminData: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  showErrorModal: false,

  // Initialize auth state from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem("token")

    if (token) {
      try {
        set({
          token,
          isLoggedIn: true,
        })
      } catch (error) {
        console.error("Failed to parse stored user data:", error)
        localStorage.removeItem("token")
      }
    }
  },

  // Check if current token is still valid
  checkAuthStatus: async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      set({ isLoggedIn: false, user: null, token: null })
      return false
    }

    /* try {
      // Make a request to verify token validity
      // Adjust this endpoint based on your API
      const response = await axiosInstance.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        const user = response.data.data.user
        set({
          user,
          token,
          isLoggedIn: true,
        })
        return true
      } else {
        throw new Error("Token verification failed")
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      // Clear invalid token
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      set({
        user: null,
        token: null,
        isLoggedIn: false,
      })
      return false
    } */
  },

  login: async ({email, password}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/admin', { email, password });
      const token  = response.data?.data?.token;
      const user = response.data?.data?.user
      console.log("LOGIN token", token)
      console.log("LOGIN User", user)
      console.log("LOGIN User", response)
      // Store token in localStorage
      localStorage.setItem('token', token);
      // Update auth state
      set({ user: user, token: token, loading: false, isLoggedIn: true,});
      toast.success("Login successful");
      return { success: true, user, token }
    } catch (error) {
      console.error("Login failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Login failed. Please check your credentials.', showErrorModal: true });
    } finally {
      set({ loading: false });
    }
  },

  getMe: async () => {
		set({ loading: true });

		try {
			const res = await axiosInstance.get(`/admin/me`);
			set({  loading: false,  adminData: res.data.data});
			console.log("single client result",res.data.data)
			//toast.success(res.data.message);
		} catch (error) {
			set({ error: error.response?.data?.message || "Error Fetching Admin", loading: false });
			console.log(error);
			toast.error(error.response.data.message || "An error occurred");
		}
	},


  logout: () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Update auth state
    set({ user: null, token: null, isLoggedIn: false, error: null });
    /* console.log("LOGIN token", token)
    console.log("LOGIN User", user) */
    console.log("User logged out");
    toast.success("Logout successful");
  },
  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useAuthStore;