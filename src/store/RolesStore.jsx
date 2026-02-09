import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";
import { get } from "react-hook-form";

const useRoleStore = create((set, get) => ({
  adminRoles: null,
  allAdmins: null,
  selectedAdmin: null,
  permissions: null,
  selectedRole: null,
  loading: false,
  error: null,
  showErrorModal: false,


  createRole: async ({name, permissions}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/admin/roles', { name, permissions });
      console.log("CREATE ROLE RESPONSE", response)
      set({ loading: false});
      toast.success("role created successful");
    } catch (error) {
      console.error("Create Role failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Create Role failed. Please check your credentials.', showErrorModal: true });
    }
  },

  getAllRoles: async () => {
        set({ loading: true });

        try {
            const res = await axiosInstance.get('/admin/roles');
            set({  loading: false,  adminRoles: res.data?.data});
            console.log("All roles", res.data?.data);
            //toast.success(res.data.message);
        } catch (error) {
            set({ error: error.response?.data?.message || "Error Fetching Admin Roles", loading: false });
            //console.log(error);
            //toast.error(error.response.data.message || "An error occurred while fetching roles");
        }
    },

  getRole: async (id) => {
      //set({ loading: true });
      if (!id) {
          set({ loading: false, error: "Role ID is required" });
          toast.error("Role ID is required");
          return;
      }
      try {
          const res = await axiosInstance.get(`/admin/roles/${id}`);
          set({  loading: false,  selectedRole: res.data.data});
          //console.log("SELECTED ROLE", res.data.data)
          //toast.success(res.data.message);
          return res.data.data;
      } catch (error) {
          set({ error: error.response?.data?.message || "Error Fetching Admin Roles", loading: false });
          //console.log(error);
          //toast.error(error.response.data.message || "An error occurred while fetching roles");
      }
  },

  updateRole: async (id, name, permission) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/roles/${id}`, { name, permission });
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

  deleteRole: async ({_id, name, permissions}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/admin/roles/${_id}`, { name, permissions });
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


  createAdmin: async (adminData) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.post('/admin/auth/register', adminData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("CREATE ADMIN RESPONSE", response);
    set({ loading: false });
    toast.success("Admin created successfully");
    
    // Optionally refresh the admin list
    get().getAllAdmins();
    
    return response.data;
  } catch (error) {
    console.error("Create Admin failed", error);
    toast.error(error.response?.data?.message || "An error occurred while creating admin");
    set({ 
      loading: false, 
      error: 'Create Admin failed. Please check your credentials.', 
      showErrorModal: true 
    });
    throw error;
  }
},


/* createAdmin: async (adminData) => {
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

      const response = await axiosInstance.post('/admin/auth/register', formData, {
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

      const response = await axiosInstance.post('/admin/auth/register', adminData, {
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
}, */

getAllAdmins: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get('/admins');
    console.log("GET ALL ADMINS RESPONSE", response);
    set({ loading: false, allAdmins: response.data.data });
    return response.data;
  } catch (error) {
    console.error("Get All Admins failed", error);
    toast.error(error.response?.data?.message || "An error occurred while fetching admins");
    set({ loading: false, error: 'Get All Admins failed. Please try again.', showErrorModal: true });
    throw error; // Re-throw to handle in component if needed
  }
},

getAdmin: async (id) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get(`/admins/${id}`);
    console.log("GET ADMIN RESPONSE", response);
    set({ loading: false, selectedAdmin: response.data.data });
    return response.data;
  } catch (error) {
    console.error("Get Admin failed", error);
    toast.error(error.response?.data?.message || "An error occurred while fetching admin");
    set({ loading: false, error: 'Get Admin failed. Please try again.', showErrorModal: true });
    throw error; // Re-throw to handle in component if needed
  }
},

updateAdmin: async ({ id, firstname, lastname, email, role, permissions, phone, address }) => {
  set({ loading: true, error: null });

  try {
    const adminData = {
      id,
      firstname,
      lastname,
      email,
      role,
      permissions,
      phone,
      address
    };

    const response = await axiosInstance.put('/admins', adminData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("UPDATE ADMIN RESPONSE", response);
    
    // Refresh the admin list after successful update
    await get().getAllAdmins();
    
    set({ loading: false });
    toast.success("Admin updated successfully");
    return response.data;

  } catch (error) {
    console.error("Update Admin failed", error);
    toast.error(error.response?.data?.message || "An error occurred while updating admin");
    set({ 
      loading: false, 
      error: 'Update Admin failed. Please try again.', 
      showErrorModal: true 
    });
    throw error; // Re-throw to handle in component if needed
  }
},

updateAdminImage: async (formData) => {
  set({ loading: true, error: null });

  try {
    const response = await axiosInstance.patch('/admin/update_image', formData);

    console.log("UPDATE ADMIN IMAGE RESPONSE", response);
    
    // Refresh the admin list after successful image update
    await get().getAllAdmins()
    
    set({ loading: false });
    toast.success("Admin image updated successfully");
    return response.data;

  } catch (error) {
    console.error("Update Admin Image failed", error);
    toast.error(error.response?.data?.message || "An error occurred while updating admin image");
    set({ 
      loading: false, 
      error: 'Update Admin Image failed. Please try again.', 
      showErrorModal: true 
    });
    throw error; // Re-throw to handle in component if needed
  }
},

activateAdmin: async ({ _id }) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.patch(`/admin/admin_users/${_id}`);
    console.log("ACTIVATE ADMIN RESPONSE", response);
    set({ loading: false });
    toast.success("Admin activated successfully");
    return response.data;
  } catch (error) {
    console.error("Activate Admin failed", error);
    toast.error(error.response?.data?.message || "An error occurred while activating admin");
    set({ loading: false, error: 'Activate Admin failed. Please try again.', showErrorModal: true });
    throw error; // Re-throw to handle in component if needed
  }
},

deleteAdmin: async ({ id }) => {
  set({ loading: false, error: null });
  try {
    const response = await axiosInstance.delete(`/admins/${id}`);
    console.log("DELETE ADMIN RESPONSE", response);
    //Refresh the admin list after successful deletion
    await get().getAllAdmins()
    set({ loading: false });
    toast.success("Admin deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Delete Admin failed", error);
    toast.error(error.response?.data?.message || "An error occurred while deleting admin");
    set({ loading: false, error: 'Delete Admin failed. Please try again.', showErrorModal: true });
    throw error; // Re-throw to handle in component if needed
  }
},


getPermissions: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get('/admin/permissions');
    console.log("GET PERMISSIONS RESPONSE", response);
    set({ loading: false, permissions: response.data.data });
    return response.data.data;
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