import toast from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";
import { create } from "zustand";

const useRiderStore = create((set, get) => ({
    ridersData: [], // Array for all riders
    singleRiderData: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,

    // Create rider
    createVendorRider: async (payload) => {
        set({ isCreating: true, error: null });
        try {
            const res = await axiosInstance.post("/admin/rider", payload);
            set({ isCreating: false });
            console.log("Rider created successfully", res);
            toast.success(res.data.message || "Rider created successfully");
            // Refresh riders list
            get().getRiders();
            return res.data.data;
        }
        catch (error) {
            set({ error: error.response?.data?.message || "Error creating rider", isCreating: false });
            console.log("RIDER ERROR", error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        } finally {
            set({ isCreating: false });
        }
    },

    // Get all vendor riders
    getRiders: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get("/admin/rider");
            set({ ridersData: res.data.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching riders", loading: false });
        } finally {
            set({ loading: false });
        }
    },

    // Get single rider
    getSingleRider: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/admin/rider/${id}`);
            set({ loading: false, singleRiderData: res.data.data });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching rider", loading: false });
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },

    updateRiderDetails: async (id, payload) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await axiosInstance.put(`/admin/rider/${id}`, payload);
            set({ isUpdating: false });
            console.log("Rider updated successfully", res);
            toast.success(res.data.message || "Rider updated successfully");
            // Refresh riders list
            get().getRiders();
            return res.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error updating rider", isUpdating: false });
            console.log("RIDER UPDATE ERROR", error);
            toast.error(error.response?.data?.message || "An error occurred");
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    // Delete rider
    deleteRider: async (id) => {
        set({ isDeleting: true, error: null });
        try {
            const res = await axiosInstance.delete(`/admin/rider/${id}`);
            set({ isDeleting: false });
            console.log("Rider deleted successfully", res);
            toast.success(res.data.message || "Rider deleted successfully");
            // Refresh riders list
            get().getRiders();
        } catch (error) {
            set({ error: error.response?.data?.message || "Error deleting rider", isDeleting: false });
            console.log("RIDER DELETE ERROR", error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isDeleting: false });
        }
    },

    updateRiderStatus: async (id, status) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await axiosInstance.put(`/admin/rider/${id}/status`, { status });
            set({ isUpdating: false });
            console.log("Rider status updated successfully", res);
            toast.success(res.data.message || "Rider status updated successfully");
            // Refresh riders list
            get().getRiders();
        } catch (error) {
            set({ error: error.response?.data?.message || "Error updating rider status", isUpdating: false });
            console.log("RIDER STATUS UPDATE ERROR", error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isUpdating: false });
        }
    }

}));

export default useRiderStore;