import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useVehicleStore = create((set) => ({  
  loading: false,
  error: null,
  showErrorModal: false,
  vehicles: [],

fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get("/admin/vehicle_management/all_vehicles");
        console.log('VEHICLES RESULT: ', res)
        set({ vehicles: res.data?.data || [], loading: false });
        toast.success("Vehicles fetched successfully");
        return res.data.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to fetch vehicles",
            showErrorModal: true,
            loading: false,
        });
        console.error('Error fetching vehicles:', error),
        toast.error(error?.response?.data?.message || "Failed to fetch vehicles");
    }
},

createVehicle: async (vehicleData) => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.post(
            "/rider/vehicle/rider_vehicle",
            vehicleData
        );
        toast.success("Vehicle created successfully");
        set({ loading: false });
        return res.data.data; // Return the created vehicle data
        // Optionally, refetch vehicles or update state
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to create vehicle",
            showErrorModal: true,
            loading: false,
        });
        console.error('Error creating vehicle:', error),
        toast.error(error?.response?.data?.message || "Failed to create vehicle");
    }
},

})
)

export default useVehicleStore;