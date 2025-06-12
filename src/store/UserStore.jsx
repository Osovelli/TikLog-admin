import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useUserStore = create((set) => ({
  userCount: null,
  allUsers: null,
  allRiders: null,
  allVendors: null,
  loading: false,
  error: null,
  showErrorModal: false,


  getUserCount: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('admin/user_management/count');
      console.log("GET USER COUNT RESPONSE", response.data);
      set({ loading: false, userCount: response.data }); 
      return response.data;
    } catch (error) {
      console.error("Get User Count failed", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching user count");
      set({ loading: false, error: 'Get User Count failed. Please try again.', showErrorModal: true }); 
      throw error; // Re-throw to handle in component if needed
    }
  },

  getAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/user_management/all_users');
      console.log("GET ALL USERS RESPONSE", response.data);
      set({ loading: false, allUsers: response.data });
      toast.success("All users fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get All Users failed", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching all users");
      set({ loading: false, error: 'Get All Users failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getAllRiders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/user_management/all_riders');
      console.log("GET ALL RIDERS RESPONSE", response.data);
      set({ loading: false, allRiders: response.data });
      toast.success("All riders fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get All Riders failed", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching all riders");
      set({ loading: false, error: 'Get All Riders failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getAllVendors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/user_management/all_vendors');
      console.log("GET ALL VENDORS RESPONSE", response.data);
      set({ loading: false, allVendors: response.data });
      toast.success("All vendors fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get All Vendors failed", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching all vendors");
      set({ loading: false, error: 'Get All Vendors failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },     


  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useUserStore;