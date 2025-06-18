import { create } from "zustand"
import { toast } from "react-hot-toast"
import axiosInstance from "@/lib/utils/axiosInstance"

const useContentStore = create((set, get) => ({
  content: {},
  loading: false,
  error: null,
  showErrorModal: false,

  createContent: async (name, description) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.post("/content/create", {
        name,
        description,
      })
      console.log("CREATE CONTENT RESPONSE", response.data)

      // Update content in store
      const currentContent = get().content
      set({
        loading: false,
        content: {
          ...currentContent,
          [name]: response.data.data,
        },
      })

      toast.success("Content created successfully")
      return response.data.data
    } catch (error) {
      console.error("Create content failed", error)
      toast.error(error.response?.data?.message || "An error occurred while creating content")
      set({ loading: false, error: "Create content failed. Please try again.", showErrorModal: true })
      throw error
    }
  },

  // Get individual content by fetching all and filtering by name
  getContent: async (name) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get("/content/all")
      console.log("GET ALL CONTENT RESPONSE", response.data)

      // Transform array to object keyed by name
      const contentObj = {}
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.data.forEach((item) => {
          contentObj[item.name] = item
        })
      }

      // Update store with all content
      set({ loading: false, content: contentObj })

      // Return the specific content requested
      const requestedContent = contentObj[name] || null
      console.log(`Content for ${name}:`, requestedContent)
      return requestedContent
    } catch (error) {
      console.error("Get content failed", error)
      toast.error(error.response?.data?.message || "An error occurred while fetching content")
      set({ loading: false, error: "Get content failed. Please try again.", showErrorModal: true })
      throw error
    }
  },

  getAllContent: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get("/content/all")
      console.log("GET ALL CONTENT RESPONSE", response.data)

      // Transform array to object keyed by name
      const contentObj = {}
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.data.forEach((item) => {
          contentObj[item.name] = item
        })
      }

      set({ loading: false, content: contentObj })
      return response.data.data
    } catch (error) {
      console.error("Get all content failed", error)
      toast.error(error.response?.data?.message || "An error occurred while fetching content")
      set({ loading: false, error: "Get all content failed. Please try again.", showErrorModal: true })
      throw error
    }
  },

  // Update content by name (not ID)
  updateContent: async (name, description) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.put(`/content/update/${name}`, {
        name,
        description,
      })
      console.log("UPDATE CONTENT RESPONSE", response.data)

      // Update content in store
      const currentContent = get().content
      set({
        loading: false,
        content: {
          ...currentContent,
          [name]: response.data.data,
        },
      })

      toast.success("Content updated successfully")
      return response.data.data
    } catch (error) {
      console.error("Update content failed", error)
      toast.error(error.response?.data?.message || "An error occurred while updating content")
      set({ loading: false, error: "Update content failed. Please try again.", showErrorModal: true })
      throw error
    }
  },

  // Smart save method that determines whether to create or update
  saveContent: async (name, description) => {
    const currentContent = get().content[name]

    if (currentContent) {
      console.log("Content exists, updating:", name)
      return await get().updateContent(name, description)
    } else {
      console.log("Content doesn't exist, creating:", name)
      return await get().createContent(name, description)
    }
  },

  // Delete content by name (not ID)
  deleteContent: async (name) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.delete(`/content/delete/${name}`)
      console.log("DELETE CONTENT RESPONSE", response.data)

      // Remove content from store
      const currentContent = get().content
      const updatedContent = { ...currentContent }
      delete updatedContent[name]

      set({ loading: false, content: updatedContent })
      toast.success("Content deleted successfully")
      return response.data
    } catch (error) {
      console.error("Delete content failed", error)
      toast.error(error.response?.data?.message || "An error occurred while deleting content")
      set({ loading: false, error: "Delete content failed. Please try again.", showErrorModal: true })
      throw error
    }
  },

  // Helper method to get content by name from store
  getContentByName: (name) => {
    const state = get()
    return state.content[name] || null
  },

  // Check if content exists (useful for components)
  contentExists: (name) => {
    const state = get()
    return !!state.content[name]
  },

  // Clear error and close modal
  closeErrorModal: () => set({ showErrorModal: false, error: null }),

  // Clear all content (useful for logout or reset)
  clearContent: () => set({ content: {}, error: null }),
}))

export default useContentStore
