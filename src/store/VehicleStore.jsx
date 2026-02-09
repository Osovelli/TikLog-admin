import { create } from "zustand";
import axiosInstance from "@/lib/utils/axiosInstance";
import toast from "react-hot-toast";

const useVehicleStore = create((set, get) => ({
    vehiclesData: [], // Array for all vehicles
    singleVehicleData: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,

    // Create vehicle
    createVehicle: async (payload) => {
        set({ isCreating: true, error: null });

        try {
            const res = await axiosInstance.post("/vehicle/admin", payload);
            set({ isCreating: false });
            console.log("Vehicle created successfully", res);
            toast.success(res.data.message || "Vehicle created successfully");
            
            // Refresh vehicles list
            get().getOwnerVehicle();
            
            return res.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error creating vehicle", isCreating: false });
            console.log("VEHICLE ERROR", error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        }
    },

    // Get all owner vehicles
    getOwnerVehicle: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get("/vehicle/admin");
            set({ loading: false, vehiclesData: res.data.data || [] });
            console.log("Owner Vehicle result", res.data.data);
            return res.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching vehicles", loading: false, vehiclesData: [] });
            console.log(error);
            return [];
        }
    },

    // Get single vehicle
    getSingleVehicle: async (id) => {
        set({ loading: true, error: null });

        try {
            const res = await axiosInstance.get(`/vehicle/${id}`);
            set({ loading: false, singleVehicleData: res.data.data });
            console.log("Single Vehicle result", res.data.data);
            return res.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching vehicle", loading: false });
            console.log(error);
            toast.error(error.response?.data?.message || "Error fetching vehicle details");
            return null;
        }
    },

    // Update vehicle
    updateVehicle: async (id, payload) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await axiosInstance.put(`/vehicle/${id}/admin`, payload);
            set({ isUpdating: false });
            console.log("Update Vehicle result", res.data.message);
            toast.success(res.data.message || "Vehicle updated successfully");
            
            // Refresh vehicles list and single vehicle
            get().getOwnerVehicle();
            get().getSingleVehicle(id);
            
            return res.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error updating vehicle", isUpdating: false });
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        }
    },

    // Delete vehicle
    deleteVehicle: async (id) => {
        set({ isDeleting: true, error: null });
        try {
            const res = await axiosInstance.delete(`/vehicle/${id}`);
            set({ isDeleting: false });
            console.log("Deleted Vehicle");
            toast.success(res.data.message || "Vehicle deleted successfully");
            
            // Refresh vehicles list
            get().getOwnerVehicle();
            
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error deleting vehicle", isDeleting: false });
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        }
    },

    deleteVehicleImage: async (publicId) => {
        set({ isDeleting: true, error: null });
        try {
            const res = await axiosInstance.delete(`/vehicle/${publicId}/images/delete`);
            set({ isDeleting: false });
            console.log("Deleted Vehicle Image");
            toast.success(res.data.message || "Vehicle image deleted successfully");
            
            // Refresh vehicles list
            get().getOwnerVehicle();
            
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error deleting vehicle image", isDeleting: false });
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        }
    },

    deleteVehicleLicenseImage: async (publicId) => {
        set({ isDeleting: true, error: null });
        try {
            const res = await axiosInstance.delete(`/vehicle/${publicId}/license/images/delete`);
            set({ isDeleting: false });
            console.log("Deleted Vehicle License Image");
            toast.success(res.data.message || "Vehicle license image deleted successfully");
            // Refresh vehicles list
            get().getOwnerVehicle();
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error deleting vehicle license image", isDeleting: false });
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        } finally {
            set({ isDeleting: false });
        }
    },

    // Set default vehicle
    setDefaultVehicle: async (id) => {
        set({ isUpdating: true, error: null });

        try {
            const res = await axiosInstance.put(`/vehicle/${id}/default`);
            set({ isUpdating: false });
            console.log("Set default Vehicle result", res.data.message);
            toast.success(res.data.message || "Default vehicle set successfully");
            
            // Refresh vehicles list
            get().getOwnerVehicle();
            
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error setting default vehicle", isUpdating: false });
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        }
    },

    // Clear single vehicle data
    clearSingleVehicle: () => {
        set({ singleVehicleData: null });
    }
}));

export default useVehicleStore;