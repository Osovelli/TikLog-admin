import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useRoleStore = create((set) => ({
  adminRoles: null,
  permissions: null,
  selectedRole: null,
  loading: false,
  error: null,
  showErrorModal: false,


  createRole: async ({name, description}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/roles', { name, description });
      console.log("CREATE ROLE RESPONSE", response)
      set({ loading: false});
      toast.success("role created successful");
    } catch (error) {
      console.error("Crreate Role failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Create Role failed. Please check your credentials.', showErrorModal: true });
    }
  },

  getAllRoles: async () => {
        set({ loading: true });

        try {
            const res = await axiosInstance.get('/roles');
            set({  loading: false,  adminRoles: res.data?.data});
            //console.log("All roles", res.data.data.data)
            //toast.success(res.data.message);
        } catch (error) {
            set({ error: error.response?.data?.message || "Error Fetching Admin Roles", loading: false });
            //console.log(error);
            //toast.error(error.response.data.message || "An error occurred while fetching roles");
        }
    },

  getRole: async ({_id}) => {
      //set({ loading: true });
      if (!_id) {
          set({ loading: false, error: "Role ID is required" });
          toast.error("Role ID is required");
          return;
      }
      try {
          const res = await axiosInstance.get(`/roles/${_id}`);
          set({  loading: false,  selectedRole: res.data.data});
          //console.log("SELECTED ROLE", res.data.data.data)
          //toast.success(res.data.message);
      } catch (error) {
          set({ error: error.response?.data?.message || "Error Fetching Admin Roles", loading: false });
          //console.log(error);
          //toast.error(error.response.data.message || "An error occurred while fetching roles");
      }
  },

  updateRole: async ({_id, name, description}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/roles/${_id}`, { name, description });
      console.log("UPDATE ROLE RESPONSE", response);
      set({ loading: false });
      toast.success("Role updated successfully");
      return response.data;
    } catch (error) {
      console.error("Update Role failed", error);
      toast.error(error.response?.data?.message || "An error occurred while updating role");
      set({
        loading: false,
        error: 'Update Role failed. Please check your credentials.',
        showErrorModal: true
      });
      throw error; // Re-throw to handle in component if needed
    }
  },

  deleteRole: async ({_id}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/roles/${_id}`);
      console.log("DELETE ROLE RESPONSE", response);
      set({ loading: false });
      toast.success("Role deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Delete Role failed", error);
      toast.error(error.response?.data?.message || "An error occurred while deleting role");
      set({
        loading: false,
        error: 'Delete Role failed. Please check your credentials.',
        showErrorModal: true
      });
      throw error; // Re-throw to handle in component if needed
    }
  },


createAdmin: async ({ firstname, lastname, email, password, role, permissions, avatar }) => {
  set({ loading: true, error: null });
  try {
    // If there's an avatar, use FormData for multipart upload
    if (avatar) {
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      
      // Append permissions as individual entries
      permissions.forEach((permissionId, index) => {
        formData.append(`permissions[${index}]`, permissionId);
      });
      
      // Append avatar file
      formData.append('avatar', avatar);

      const response = await axiosInstance.post('/admin/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("CREATE ADMIN RESPONSE", response);
      set({ loading: false });
      toast.success("Admin created successfully");
      return response.data;
    } else {
      // If no avatar, send as JSON
      const adminData = {
        firstname,
        lastname,
        email,
        password,
        role,
        permissions
      };

      const response = await axiosInstance.post('/admin/create', adminData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("CREATE ADMIN RESPONSE", response);
      set({ loading: false });
      toast.success("Admin created successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Create Admin failed", error);
    toast.error(error.response?.data?.message || "An error occurred while creating admin");
    set({ 
      loading: false, 
      error: 'Create Admin failed. Please check your credentials.', 
      showErrorModal: true 
    });
    throw error; // Re-throw to handle in component if needed
  }
},

getPermissions: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get('/admin/permission');
    //console.log("GET PERMISSIONS RESPONSE", response);
    set({ loading: false, permissions: response.data.data });
    return response.data;
  } catch (error) {
    //console.error("Get Permissions failed", error);
    //toast.error(error.response?.data?.message || "An error occurred while fetching permissions");
    set({ loading: false, error: 'Get Permissions failed. Please try again.', showErrorModal: true });
    throw error; // Re-throw to handle in component if needed
  }
},




  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useRoleStore;