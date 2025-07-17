import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";
import { useNavigate } from "react-router";


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

  resetEmail: async (phone_number) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/admin/forgot', { phone_number });
      console.log("Reset Email Response", response)
      toast.success(response.data.message);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Reset Email failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Reset Email failed. Please try again.', showErrorModal: true });
      return { success: false, error: error.response.data.message };
    } finally {
      set({ loading: false });
    }
  },


  changePassword: async ({ oldPassword, newPassword, otp }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/change-password', { oldPassword, newPassword, otp });
      console.log("Change Password Response", response)
      toast.success(response.data.message);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error("Change password failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Change password failed. Please try again.', showErrorModal: true });
      return { success: false, error: error.response.data.message };
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async ({ new_password, confirm_password, otp }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/reset-password', { new_password, confirm_password, otp });
      console.log("Reset Password Response", response)
      toast.success(response.data.message);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error("Reset password failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Reset password failed. Please try again.', showErrorModal: true });
      return { success: false, error: error.response.data.message };
    } finally {
      set({ loading: false });
    }
  },

  resendotp: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/admin/resend_otp', { email });
      console.log("Resend OTP Response", response)
      toast.success(response.data.message);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Resend OTP failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Resend OTP failed. Please try again.', showErrorModal: true });
      return { success: false, error: error.response.data.message };
    } finally {
      set({ loading: false });
    }
  },


  getMe: async () => {
		set({ loading: true });

		try {
			const res = await axiosInstance.get("/admin/me");
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