import { create } from "zustand";
//import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useNotificationStore = create((set) => ({
  notifications: [],
  loading: false,
  error: null,
  showErrorModal: false,


getNotifications: async () => {
    set({ error: null });
    try {
        const res = await axiosInstance.get("/notification/history");
        //console.log('NOTIFICATIONS RESULT: ', res)
        set({ notifications: res.data.data, loading: false });
        //toast.success("Notifications Fetched Successfully")
        return res.data
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }},

})
)

export default useNotificationStore;