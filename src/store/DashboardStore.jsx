import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useDashboardStore = create((set) => ({
  userDashboardData: null,
  dashboardUserGrowthDetails: null,
  dashboardMonthlyData: null,
  dashboardUserAnalytics: null,
  loading: false,
  error: null,
  showErrorModal: false,

  getUserDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('admin/analytics/dashboard');
        console.log("GET USER DASHBOARD DATA RESPONSE", response.data);
        set({ loading: false, userDashboardData: response.data });
        //toast.success("User dashboard data fetched successfully");
        return response.data;
    } catch (error) {
        console.error("Get User Dashboard Data failed", error);
        set({ loading: false, error: error.message });
        toast.error("Failed to fetch user dashboard data");
        //return null;
        throw error; // Re-throw to handle in component if needed
    }
  },

  getDashboardUserDetails: async () => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.get('/admin/analytics/detailed');
        console.log("GET DASHBOARD USER DETAILS RESPONSE", response.data);
        set({ loading: false, dashboardUserDetails: response.data });
        //toast.success("Dashboard user details fetched successfully");
        return response.data;
    } catch (error) {
        console.error("Get Dashboard User Details failed", error);
        set({ loading: false, error: error.message });
        toast.error("Failed to fetch dashboard user details");
        //return null;
        throw error; // Re-throw to handle in component if needed
    }
  },

  getDashboardMonthlyData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/analytics/monthly');
        console.log("GET DASHBOARD MONTHLY DATA RESPONSE", response.data);
        set({ loading: false, dashboardMonthlyData: response.data });
        //toast.success("Dashboard monthly data fetched successfully");
        return response.data;
    } catch (error) {
        console.error("Get Dashboard Monthly Data failed", error);
        set({ loading: false, error: error.message });
        toast.error("Failed to fetch dashboard monthly data");
        //return null;
        throw error; // Re-throw to handle in component if needed
    }
  },

  getDashboardUserAnalytics: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/analytics/users');
        console.log("GET DASHBOARD USER ANALYTICS RESPONSE", response.data);
        set({ loading: false, dashboardUserAnalytics: response.data });
        //toast.success("Dashboard user analytics fetched successfully");
        return response.data;
    } catch (error) {
        console.error("Get Dashboard User Analytics failed", error);
        set({ loading: false, error: error.message });
        toast.error("Failed to fetch dashboard user analytics");
        //return null;
        throw error; // Re-throw to handle in component if needed
    }
  },

  getDashboardUserGrowth: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('admin/analytics/growth');
        console.log("GET DASHBOARD USER GROWTH RESPONSE", response.data);
        set({ loading: false, dashboardUserGrowthDetails: response.data });
        //toast.success("Dashboard user growth fetched successfully");
        return response.data;
    } catch (error) {
        console.error("Get Dashboard User Growth failed", error);
        set({ loading: false, error: error.message });
        toast.error("Failed to fetch dashboard user growth");
        //return null;
        throw error; // Re-throw to handle in component if needed
    }
  },




  openErrorModal: (error) => set({ showErrorModal: true, error }),


  closeErrorModal: () => set({ showErrorModal: false, error: null })

}));

export default useDashboardStore