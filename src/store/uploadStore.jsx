import axios from "axios";
import { create } from "zustand";
import axiosInstance from "@/lib/utils/axiosInstance";

// Utility to detect mime type from file name
const getMimeType = (file) => {
  if (file.type) return file.type; // File object has type
  const ext = file.name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg"].includes(ext)) return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "pdf") return "application/pdf";
  return "application/octet-stream";
};

const useUploadStore = create((set, get) => ({
  uploadFile: async (file, folder = "") => {
    try {
      console.log("📤 Starting upload to folder:", folder || "(root)");

      // Get signature WITH folder parameter
      const sigRes = await axiosInstance.get("/signature/get-signature", {
        params: { folder },
      });

      if (!sigRes.data.success) {
        throw new Error(sigRes.data.error || "Signature generation failed");
      }

      const { timestamp, signature, cloudName, apiKey } = sigRes.data;

      if (!timestamp || !signature || !cloudName || !apiKey) {
        throw new Error("Missing Cloudinary parameters in response");
      }

      // Prepare file
      const mimeType = getMimeType(file);
      const fileName = file.name || `upload_${Date.now()}`;
      const resourceType = mimeType.startsWith("image/") ? "image" : "auto";

      // Create FormData
      const formData = new FormData();
      formData.append("file", file); // In React web, append File directly
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      if (folder && folder.trim() !== "") {
        formData.append("folder", folder.trim());
      }

      console.log("🚀 Uploading to Cloudinary with params:", {
        timestamp,
        folder: folder || "none",
        resourceType,
        fileName,
      });

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("✅ Upload successful:", {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        folder: response.data.folder,
      });

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    } catch (error) {
      console.error("❌ Upload failed:", error.message);
      if (error.response) {
        console.error("Cloudinary error:", error.response.data);
      }
      throw new Error(`Upload failed: ${error.message}`);
    }
  },

  uploadFiles: async (files = [], folder = "") => {
    return Promise.all(files.map((file) => get().uploadFile(file, folder)));
  },
}));

export default useUploadStore;