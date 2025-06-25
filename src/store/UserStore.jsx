import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useUserStore = create((set) => ({
  userCount: null,
  allUsers: null,
  singleUser: null,
  singleRider: null,
  singleVendor: null,
  allRiders: null,
  allVendors: null,
  userDeliveries: null,
  riderDeliveries: null,
  vendorDeliveries: null,
  loading: false,
  error: null,
  showErrorModal: false,


  getUserCount: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('admin/user_management/count');
      //console.log("GET USER COUNT RESPONSE", response.data);
      set({ loading: false, userCount: response.data }); 
      return response.data;
    } catch (error) {
      console.error("Get User Count failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching user count");
      set({ loading: false, error: 'Get User Count failed. Please try again.', showErrorModal: true }); 
      throw error; // Re-throw to handle in component if needed
    }
  },

  getAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/user_management/all_users');
      //console.log("GET ALL USERS RESPONSE", response.data);
      set({ loading: false, allUsers: response.data });
      //toast.success("All users fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get All Users failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching all users");
      set({ loading: false, error: 'Get All Users failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      //console.log("Fetching user with ID:", id);
      const response = await axiosInstance.get(`/admin/user_management/all_users/${id}`);
      //console.log("GET SINGLE USER RESPONSE", response.data);
      set({ loading: false, singleUser: response.data });
      //toast.success("User fetched successfully");
      return response.data.data;
    } catch (error) {
      console.error("Get Single User failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching the user");
      set({ loading: false, error: 'Get Single User failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/admin/user_management/all_users/${id}`);
      console.log("DELETE USER RESPONSE", response.data);
      set({ loading: false });
      toast.success("User deleted successfully");
      return response.data;
    } catch (error) {
      //console.error("Delete User failed:", error)
      toast.error(error.response?.data?.message || "An error occurred while deleting the user");
      set({ loading: false, error: 'Delete Single User failed.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getAllRiders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/user_management/all_riders');
      //console.log("GET ALL RIDERS RESPONSE", response.data);
      set({ loading: false, allRiders: response.data });
      //toast.success("All riders fetched successfully");
      return response.data;
    } catch (error) {
      //console.error("Get All Riders failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching all riders");
      set({ loading: false, error: 'Get All Riders failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getRiderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/user_management/all_riders/${id}`);
      //console.log("GET SINGLE RIDER RESPONSE", response.data);
      set({ loading: false, singleRider: response.data });
      //toast.success("Rider fetched successfully");
      return response.data.data;
    } catch (error) {
      //console.error("Get Single Rider failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching the rider");
      set({ loading: false, error: 'Get Single Rider failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getAllVendors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/user_management/all_vendors');
      //console.log("GET ALL VENDORS RESPONSE", response.data);
      set({ loading: false, allVendors: response.data });
      //toast.success("All vendors fetched successfully");
      return response.data;
    } catch (error) {
      //console.error("Get All Vendors failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching all vendors");
      set({ loading: false, error: 'Get All Vendors failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },
  
  getVendorById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/user_management/all_vendors/${id}`);
      //console.log("GET SINGLE VENDOR RESPONSE", response.data);
      set({ loading: false, singleVendor: response.data });
      //toast.success("Vendor fetched successfully");
      return response.data.data;
    } catch (error) {
      console.error("Get Single Vendor failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching the vendor");
      set({ loading: false, error: 'Get Single Vendor failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  activateUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/admin/user_management/all_users/${id}/status`, { status: true });
      console.log("ACTIVATE USER RESPONSE", response.data);
      set({ loading: false });
      toast.success("User activated successfully");
      return response.data;
    } catch (error) {
      console.error("Activate User failed", error);
      toast.error(error.response?.data?.message || "An error occurred while activating the user");
      set({ loading: false, error: 'Activate User failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deactivateUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/admin/user_management/all_users/${id}/status`, { status: false });
      console.log("DEACTIVATE USER RESPONSE", response.data);
      set({ loading: false });
      toast.success("User deactivated successfully");
      return response.data;
    } catch (error) {
      console.error("Deactivate User failed", error);
      toast.error(error.response?.data?.message || "An error occurred while deactivating the user");
      set({ loading: false, error: 'Deactivate User failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  activateRider: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/admin/user_management/all_riders/${id}/status`, { status: true });
      console.log("ACTIVATE RIDER RESPONSE", response.data);
      set({ loading: false });
      toast.success("Rider activated successfully");
      return response.data;
    } catch (error) {
      console.error("Activate Rider failed", error);
      toast.error(error.response?.data?.message || "An error occurred while activating the rider");
      set({ loading: false, error: 'Activate Rider failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deactivateRider: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/admin/user_management/all_riders/${id}/status`, { status: false });
      console.log("DEACTIVATE RIDER RESPONSE", response.data);
      set({ loading: false });
      toast.success("Rider deactivated successfully");
      return response.data;
    } catch (error) {
      console.error("Deactivate Rider failed", error);
      toast.error(error.response?.data?.message || "An error occurred while deactivating the Rider");
      set({ loading: false, error: 'Deactivate Rider failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  activateVendor: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/admin/user_management/all_vendors/${id}/status`, { status: true });
      console.log("ACTIVATE VENDOR RESPONSE", response.data);
      set({ loading: false });
      toast.success("vendor activated successfully");
      return response.data;
    } catch (error) {
      console.error("Activate Vendor failed", error);
      toast.error(error.response?.data?.message || "An error occurred while activating the Vendor");
      set({ loading: false, error: 'Activate Vendor failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deactivateVendor: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/admin/user_management/all_vendors/${id}/status`, { status: false });
      console.log("DEACTIVATE VENDOR RESPONSE", response.data);
      set({ loading: false });
      toast.success("Vendor deactivated successfully");
      return response.data;
    } catch (error) {
      console.error("Deactivate Vendor failed", error);
      toast.error(error.response?.data?.message || "An error occurred while deactivating the Vendor");
      set({ loading: false, error: 'Deactivate Vendor failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getUserDeliveriesById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/user_management/all_users/${id}/deliveries`);
      //console.log("GET USER DELIVERIES RESPONSE", response.data);
      set({ loading: false, userDeliveries: response.data });
      //toast.success("User deliveries fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get User Deliveries failed", error)
      //toast.error(error.response?.data?.message || "An error occurred while fetching user deliveries");
      set({ loading: false, error: 'Get User Deliveries failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
  }
},

  getRiderDeliveriesById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/user_management/all_riders/${id}/deliveries`);
      //console.log("GET RIDER DELIVERIES RESPONSE", response.data);
      set({ loading: false, riderDeliveries: response.data });
      //toast.success("Rider deliveries fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get Rider Deliveries failed", error)
      //toast.error(error.response?.data?.message || "An error occurred while fetching rider deliveries");
      set({ loading: false, error: 'Get Rider Deliveries failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
  }
},

  getVendorDeliveriesById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/user_management/all_vendors/${id}/deliveries`);
      //console.log("GET VENDOR DELIVERIES RESPONSE", response.data);
      set({ loading: false, vendorDeliveries: response.data });
      //toast.success("Vendor deliveries fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get Vendor Deliveries failed", error)
      //toast.error(error.response?.data?.message || "An error occurred while fetching vendor deliveries");
      set({ loading: false, error: 'Get Vendor Deliveries failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
  }
},

getRiderRequestsById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/user_management/all_users/${id}/requests`);
      //console.log("GET USER DELIVERIES RESPONSE", response.data);
      set({ loading: false, userDeliveries: response.data });
      //toast.success("User deliveries fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Get User Deliveries failed", error)
      //toast.error(error.response?.data?.message || "An error occurred while fetching user deliveries");
      set({ loading: false, error: 'Get User Deliveries failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
  }
},

getUserWalletById: async (id) => {
  set({ loading: true, error: null });
  try{
    const response = await axiosInstance.get(`/admin/user_management/all_users/${id}/wallet`);
    //console.log("GET USER WALLET RESPONSE", response.data);
    set({ loading: false, userWallet: response.data });
    //toast.success("User wallet fetched successfully");
    return response.data;
  }
  catch(error){
    console.error("Get User Wallet failed", error)
    //toast.error(error.response?.data?.message || "An error occurred while fetching user wallet");
    set({ loading: false, error: 'Get User Wallet failed. Please try again.', showErrorModal: true})
    throw error; // Re-throw to handle in component if needed
  }
},
    
  openErrorModal: (error) => set({ showErrorModal: true, error }),


  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useUserStore;