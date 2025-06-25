import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useDeliveryStore = create((set) => ({
  allOrders: [],
  order: {},
  loading: false,
  error: null,
  showErrorModal: false,

  getAllOrders: async () => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.get('admin/delivery_management/all_deliveries');
        //console.log("GET ALL ORDERS RESPONSE", response.data)
        set({ loading: false, allOrders: response.data });
        //toast.success("All orders fetched successfully");
        return response.data;
    } 
    catch (error) {
        console.error("Get All Orders failed", error);
        set({ loading: false, error: error.message });
        toast.error("Failed to fetch all orders");
        //return null;
        throw error; // Re-throw to handle in component if needed
    }
  },

  getOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.get(`/admin/delivery_management/${id}`);
        //console.log("GET ORDERS BY ID RESPONSE", response.data)
        set({ loading: false, order: response.data})
        //toast.success("Order fetched successfully")
        return response.data;
    } 
    catch (error) {
        console.error("Get Orders By Id failed", error);
        set({ loading: false, error: error.message });
        //toast.error("Failed to fetch order")
        throw error; // Re-throw to handle in component if needed
      }
    },
  

  openErrorModal: (error) => set({ showErrorModal: true, error }),


  closeErrorModal: () => set({ showErrorModal: false, error: null })

}));

export default useDeliveryStore;