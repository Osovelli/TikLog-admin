import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  adminData: null,
  loading: false,
  error: null,
  showErrorModal: false,


  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/admin/login', { email, password });
      const token  = response.data?.data?.token;
      const user = response.data?.data?.user
      console.log("LOGIN token", token)
      console.log("LOGIN User", user)
      console.log("LOGIN User", response)
      localStorage.setItem('token', token);
      set({ user: user, token: token, loading: false });
    } catch (error) {
      console.error("Login failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Login failed. Please check your credentials.', showErrorModal: true });
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
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useAuthStore;