import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";
import { get } from "react-hook-form";

const useFAQStore = create((set) => ({
  faqs: null,
  loading: false,
  error: null,
  showErrorModal: false,

  createFAQ: async (faqData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/faq', faqData);
      console.log("CREATE FAQ RESPONSE", response.data);
      set({ loading: false });
      toast.success("FAQ created successfully");
      return response.data;
    } catch (error) {
      console.error("Create FAQ failed", error);
      toast.error(error.response?.data?.message || "An error occurred while creating FAQ");
      set({ loading: false, error: 'Create FAQ failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  getAllFAQs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/faq');
      console.log("GET FAQs RESPONSE", response.data);
      set({ loading: false, faqs: response.data });
      return response.data;
    } catch (error) {
      console.error("Get FAQs failed", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching FAQs");
      set({ loading: false, error: 'Get FAQs failed. Please try again.', showErrorModal: true });
      throw error; // Re-throw to handle in component if needed
    }
  },

  updateFAQ: async (faqId, faqData) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.put(`/faq/${faqId}`, faqData);
    console.log("UPDATE FAQ RESPONSE", response.data);
    set({ loading: false });
    toast.success("FAQ updated successfully");
    return response.data;
  } catch (error) {
    console.error("Update FAQ failed", error);
    toast.error(error.response?.data?.message || "An error occurred while updating FAQ");
    set({ loading: false, error: 'Update FAQ failed. Please try again.', showErrorModal: true });
    throw error; // Re-throw to handle in component if needed
  }
},

deleteFAQ: async (faqId) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.delete(`/faq/${faqId}`);
    console.log("DELETE FAQ RESPONSE", response.data);
    set({ loading: false });
    toast.success("FAQ deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Delete FAQ failed", error);
    toast.error(error.response?.data?.message || "An error occurred while deleting FAQ");
    set({ loading: false, error: 'Delete FAQ failed. Please try again.', showErrorModal: true });
    throw error; // Re-throw to handle in component if needed
  }
},

  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

  

export default useFAQStore;