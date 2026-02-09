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
  riderAddress: null,
  riderWallet: null,
  riderVehicle: null,
  vendorVehicles: null,
  vendorDeliveries: null,
  vendorAddress: null,
  vendorWallet: null,
  singleWallet: null,
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
      const response = await axiosInstance.get('/admin/customer?page=1&limit=10&status=activated');
      //console.log("GET ALL USERS RESPONSE", response.data.data.customers);
      set({ loading: false, allUsers: response?.data?.data?.customers });
      //toast.success("All users fetched successfully");
      return response.data;
    } catch (error) {
      //console.error("Get All Users failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching all users");
      set({ loading: false, error: 'Get All Users failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      //console.log("Fetching user with ID:", id);
      const response = await axiosInstance.get(`/admin/customer/${id}`);
      console.log("GET SINGLE USER RESPONSE", response.data);
      set({ loading: false, singleUser: response.data });
      //toast.success("User fetched successfully");
      return response.data.data;
    } catch (error) {
      //console.error("Get Single User failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching the user");
      set({ loading: false, error: 'Get Single User failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/customer/${id}`, userData);
      //console.log("UPDATE USER RESPONSE", response.data);
      set({ loading: false });
      toast.success("User updated successfully");
      return response.data;
    } catch (error) {
      //console.error("Update User failed", error);
      toast.error(error.response?.data?.message || "An error occurred while updating the user");
      set({ loading: false, error: 'Update User failed. Please check your credentials.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },


  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/admin/customer/${id}`);
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
      const response = await axiosInstance.get('/admin/rider');
      console.log("GET ALL RIDERS RESPONSE", response.data);
      set({ loading: false, allRiders: response.data?.data?.riders });
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
      const response = await axiosInstance.get(`/admin/rider/${id}`);
      console.log("GET SINGLE RIDER RESPONSE", response.data);
      set({ loading: false, singleRider: response.data.data });
      //toast.success("Rider fetched successfully");
      return response.data.data;
    } catch (error) {
      //console.error("Get Single Rider failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching the rider");
      set({ loading: false, error: 'Get Single Rider failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  updateRider: async (id, riderData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/rider/${id}`, riderData);
      console.log("UPDATE RIDER RESPONSE", response.data);
      set({ loading: false, singleRider: response.data.data });
      toast.success("Rider updated successfully");
      return response.data;
    } catch (error) {
      console.error("Update Rider failed", error);
      toast.error(error.response?.data?.message || "An error occurred while updating the rider");
      set({ loading: false, error: 'Update Rider failed. Please check your credentials.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deleteRider: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/admin/rider/${id}`);
      console.log("DELETE RIDER RESPONSE", response.data);
      set({ loading: false });
      toast.success("Rider deleted successfully");
      return response.data;
    } catch (error) {
      //console.error("Delete Rider failed:", error)
      toast.error(error.response?.data?.message || "An error occurred while deleting the rider");
      set({ loading: false, error: 'Delete Single Rider failed.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getRiderAddressById: async (id) => {
    set({ loading: true, error: null });
    //console.log("Fetching user address for user", id)
    try{
      const response = await axiosInstance.get(`/admin/rider/${id}/addresses`);
      set({ loading: false, riderAddress: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: 'Get Rider Address failed. Please try again.', showErrorModal: true });
      throw error;
    }
  },

  getRiderWalletById: async (id) => {
    set({ loading: true, error: null });

    try{
      const response = await axiosInstance.get(`/admin/rider/${id}/wallet`);
      console.log("GET RIDER WALLET RESPONSE", response.data);
      set({ loading: false, riderWallet: response?.data?.wallet });
      return response.data;
    } catch(error){
      console.error("Get Rider Wallet failed", error)
      set({ loading: false, error: 'Get Rider Wallet failed. Please try again.', showErrorModal: true })
      throw error; // Re-throw to handle in component if needed
    } finally {
      set({ loading: false });
    }
  },

  getRiderVehicleById: async (id) => {
    set({ loading: true, error: null });
    try{
      const response = await axiosInstance.get(`/admin/rider/${id}/vehicles`);
      console.log("GET RIDER VEHICLE RESPONSE", response.data);
      set({ loading: false, riderVehicle: response.data });
      return response.data.data;
    }
    catch(error){
      console.error("Get Rider Vehicle failed", error)
      set({ loading: false, error: 'Get Rider Vehicle failed. Please try again.', showErrorModal: true })
      throw error; // Re-throw to handle in component if needed
    }
  },

  getRiderIdentity: async (id) => {
    set({ loading: true, error: null });
    try{
      const response = await axiosInstance.get(`/admin/rider/${id}/identities`);
      console.log("GET RIDER IDENTITY RESPONSE", response.data);
      set({ loading: false, riderIdentity: response.data });
      return response.data;
    } catch (error) {
      set({ loading: false, error: 'Get Rider ID Info failed. Please try again.', showErrorModal: true });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getRiderIdentityDetails: async (identityId) => {
    set({ loading: true, error: null });
    try{
      const response = await axiosInstance.get(`/admin/rider/identities/${identityId}`);
      set({ loading: false, riderIdentityDetails: response.data });
      return response.data;
    } catch (error) {
      set({ loading: false, error: 'Get Rider Identity By ID failed. Please try again.', showErrorModal: true });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getAllVendors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/vendor');
      //console.log("GET ALL VENDORS RESPONSE", response.data?.data);
      set({ loading: false, allVendors: response.data?.data?.vendors });
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
      const response = await axiosInstance.get(`/admin/vendor/${id}`);
      //console.log("GET SINGLE VENDOR RESPONSE", response.data);
      set({ loading: false, singleVendor: response.data.data  });
      //toast.success("Vendor fetched successfully");
      return response.data.data;
    } catch (error) {
      console.error("Get Single Vendor failed", error);
      //toast.error(error.response?.data?.message || "An error occurred while fetching the vendor");
      set({ loading: false, error: 'Get Single Vendor failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  updateVendor: async (id, vendorData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/vendor/${id}`, vendorData);
      set({ loading: false, updatedVendor: response.data.data });
      toast.success("Vendor updated successfully");
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: 'Update Vendor failed. Please try again.', showErrorModal: true });
      throw error;
    }
  },

  deleteVendor: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/admin/vendor/${id}`);
      set({ loading: false, deletedVendor: response.data.data });
      toast.success("Vendor deleted successfully");
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: 'Delete Vendor failed. Please try again.', showErrorModal: true });
      throw error;
    }
  },

  getVendorAddressById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/vendor/${id}/address`);
      set({ loading: false, vendorAddress: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: 'Get Vendor Address failed. Please try again.', showErrorModal: true });
      throw error;
    }
  },

  getVendorWalletById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/vendor/${id}/wallet`);
      console.log("GET VENDOR WALLET RESPONSE", response.data);
      set({ loading: false, vendorWallet: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: 'Get Vendor Wallet failed. Please try again.', showErrorModal: true });
      throw error;
    }
  },

  activateUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/customer/${id}/activate`);
      //console.log("ACTIVATE USER RESPONSE", response.data);
      set({ loading: false });
      toast.success("User activated successfully");
      return response.data;
    } catch (error) {
      //console.error("Activate User failed", error);
      toast.error(error.response?.data?.message || "An error occurred while activating the user");
      set({ loading: false, error: 'Activate User failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deactivateUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/customer/${id}/deactivate`);
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
      const response = await axiosInstance.put(`/admin/rider/${id}/activate`);
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
      const response = await axiosInstance.put(`/admin/rider/${id}/deactivate`);
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
      const response = await axiosInstance.put(`/admin/vendor/${id}/activate`);
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
      const response = await axiosInstance.put(`/admin/vendor/${id}/deactivate`);
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
      const response = await axiosInstance.get(`/admin/customer/${id}/deliveries`);
      console.log("GET USER DELIVERIES RESPONSE", response.data);
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

  getsingleUserDeliveriesById: async (customerId, deliveryId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/customer/${customerId}/deliveries/${deliveryId}`);
      console.log("GET SINGLE USER DELIVERIES RESPONSE", response.data);
      set({ loading: false, singleUserDeliveries: response.data });
      return response.data;
    } catch (error) {
      console.error("Get Single User Deliveries failed", error)
      set({ loading: false, error: 'Get Single User Deliveries failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
  }
},

  getRiderDeliveriesById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/rider/${id}/deliveries`);
      console.log("GET RIDER DELIVERIES RESPONSE", response.data);
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

  getsingleRiderDeliveriesById: async (riderId, deliveryId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/rider/${riderId}/deliveries/${deliveryId}`);
      console.log("GET SINGLE RIDER DELIVERIES RESPONSE", response.data);
      set({ loading: false, singleRiderDeliveries: response.data });
      return response.data;
    } catch (error) {
      console.error("Get Single Rider Deliveries failed", error)
      set({ loading: false, error: 'Get Single Rider Deliveries failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
  }
},

  getVendorDeliveriesById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/vendor/${id}/deliveries`);
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

  getSingleVendorDeliveriesById: async (vendorId, deliveryId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/vendor/${vendorId}/deliveries/${deliveryId}`);
      console.log("GET SINGLE VENDOR DELIVERIES RESPONSE", response.data);
      set({ loading: false, singleVendorDeliveries: response.data });
      return response.data;
    } catch (error) {
      console.error("Get Single Vendor Deliveries failed", error)
      set({ loading: false, error: 'Get Single Vendor Deliveries failed. Please try again.', showErrorModal: true})
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
    const response = await axiosInstance.get(`/admin/customer/${id}/wallet`);
    console.log("GET USER WALLET RESPONSE", response.data);
    set({ loading: false, userWallet: response?.data?.data.wallets });
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

getSingleWallet: async({id}) => {
  set({ loading: true, error: null });
  try{
    const response = await axiosInstance.get(`/admin/user_management/wallet/${id}`);

    console.log("GET SINGLE WALLET RESPONSE", response.data);
    set({ loading: false, singleWallet: response.data });
    return response.data;
  }
  catch(error){
    console.error("Get Single Wallet failed", error)
    set({ loading: false, error: 'Get Single Wallet failed. Please try again.', showErrorModal: true})
    throw error; // Re-throw to handle in component if needed
  }
},

getVendorVehicleById: async(id) => {
  set({ loading: true, error: null });
  //console.log("Fetching user address for user", id)
    try{
      const response = await axiosInstance.get(`/admin/vendor/${id}/vehicles`);
      //console.log("GET Vendor vehicle", response.data);
      set({ loading: false, vendorVehicles: response.data.data });
      //toast.success("User address fetched successfully");
      return response.data;
    }
    catch(error){
      console.error("Get vendor vehicles", error)
      set({ loading: false, error: 'Get User Address failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
    }
  },

  getVendorRiderById: async(id) => {
    set({ loading: true, error: null });
    //console.log("Fetching user address for user", id)
    try{
      const response = await axiosInstance.get(`/admin/vendor/${id}/riders`);
      console.log("GET Vendor riders", response.data);
      set({ loading: false, vendorRiders: response.data });
      //toast.success("User address fetched successfully");
      return response.data;
    }
    catch(error){
      console.error("Get vendor riders", error)
      set({ loading: false, error: 'Get Vendor Riders failed. Please try again.', showErrorModal: true})
      throw error; // Re-throw to handle in component if needed
    }
  },

  openErrorModal: (error) => set({ showErrorModal: true, error }),


  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useUserStore;