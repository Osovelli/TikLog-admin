import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useVehicleStore = create((set) => ({  
  loading: false,
  error: null,
  showErrorModal: false,
  vehicles: [],
  vehicle: null,

fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get("/admin/vehicle_management/all_vehicles");
        //console.log('VEHICLES RESULT: ', res)
        set({ vehicles: res.data?.data || [], loading: false });
        //toast.success("Vehicles fetched successfully");
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
    set({ loading: true, error: null })
    try {
      const formData = new FormData()

      // Append basic vehicle data
      formData.append("vehicle_type", vehicleData.vehicle_type)
      formData.append("plate_number", vehicleData.plate_number)
      formData.append("color", vehicleData.color)
      formData.append("make", vehicleData.make)
      formData.append("model", vehicleData.model)
      formData.append("year", vehicleData.year)
      formData.append("rider_id", vehicleData.rider_id)

      // Append dates if provided
      if (vehicleData.issue_date) {
        formData.append("issue_date", vehicleData.issue_date)
      }
      if (vehicleData.expiry_date) {
        formData.append("expiry_date", vehicleData.expiry_date)
      }

      // Append vehicle images
      if (vehicleData.vehicle_images && vehicleData.vehicle_images.length > 0) {
        vehicleData.vehicle_images.forEach((image) => {
          formData.append("vehicle_images", image)
        })
      }

      // Append license images
      if (vehicleData.front_image) {
        formData.append("front_image", vehicleData.front_image)
      }
      if (vehicleData.back_image) {
        formData.append("back_image", vehicleData.back_image)
      }

      const res = await axiosInstance.post("/rider/vehicle/rider_vehicle", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success("Vehicle created successfully")
      set({ loading: false })
      return res.data.data
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to create vehicle",
        showErrorModal: true,
        loading: false,
      })
      console.error("Error creating vehicle:", error)
      toast.error(error?.response?.data?.message || "Failed to create vehicle")
      throw error
    }
  },

  getRiderByPhone: async (phone) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.post("/rider/phone_number", {
        phone_number: phone,
      })
      console.log("GET RIDER BY PHONE RESPONSE", res.data)
      set({ loading: false })
      return res.data.data // Return the rider data
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to fetch rider by phone",
        showErrorModal: true,
        loading: false,
      })
      console.error("Error fetching rider by phone:", error)
      toast.error(error?.response?.data?.message || "Failed to fetch rider by phone")
      return null // Return null instead of throwing
    }
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.put(`/rider/vehicle/${vehicleId}`, vehicleData)
      toast.success("Vehicle updated successfully")
      set({ loading: false })
      return res.data.data
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to update vehicle",
        showErrorModal: true,
        loading: false,
      })
      console.error("Error updating vehicle:", error)
      toast.error(error?.response?.data?.message || "Failed to update vehicle")
      throw error
    }
  },

  deleteVehicle: async (vehicleId) => {
    set({ loading: true, error: null })
    try {
      await axiosInstance.delete(`/rider/vehicle/${vehicleId}`)
      toast.success("Vehicle deleted successfully")
      set({ loading: false })
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to delete vehicle",
        showErrorModal: true,
        loading: false,
      })
      console.error("Error deleting vehicle:", error)
      toast.error(error?.response?.data?.message || "Failed to delete vehicle")
      throw error
    }
  },

    getRiderVehicle: async (riderId) => {
      set({ loading: true, error: null });
      try {
        const response = await axiosInstance.get(
          `/admin/vehicle_management/all_vehicles?rider=${riderId}`
        );
        console.log("GET RIDER VEHICLE BY RIDER ID RESPONSE", response.data);
        set({ loading: false });
        return response.data.data;
      } catch (error) {
        set({
          loading: false,
          error: error?.response?.data?.message || "Failed to fetch rider vehicle by rider ID",
        });
        console.error("Error fetching rider vehicle by rider ID:", error);
      } finally {
        set({ loading: false });
      }
    },

/* createVehicle: async (vehicleData) => {
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

getRiderByPhone: async (phone) => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get(`/rider/${phone}`);
        console.log("GET RIDER BY PHONE RESPONSE", res.data);
        set({ loading: false });
        return res.data.data; // Return the rider data
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to fetch rider by phone",
            showErrorModal: true,
            loading: false,
        });
        console.error('Error fetching rider by phone:', error),
        toast.error(error?.response?.data?.message || "Failed to fetch rider by phone");
    }} */
})
)

export default useVehicleStore;