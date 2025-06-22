import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useWalletStore = create((set) => ({
  
  loading: false,
  error: null,
  showErrorModal: false,
  wallets: [],
  walletStats: null,
  walletDetails: null,
  transactionOverview: null,

fetchWallets: async () => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get("/admin/wallet_management/all_wallets");
        console.log('WALLETS RESULT: ', res)
        set({ wallets: res.data.data, loading: false });
        toast.success("Wallets Fetched Successfully")
        return res.data
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch wallets", loading: false, showErrorModal: true });
        toast.error("Failed to fetch wallets");
    }
},

fetchWalletStats: async () => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get("/admin/wallet_management/stats");
        console.log('WALLET STAT RESULT: ', res.data.message)
        set({ walletStats: res.data.message, loading: false });
        toast.success("Wallet stats fetched successfully!")
        return res.data.message
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch wallet stats", loading: false, showErrorModal: true });
        toast.error("Failed to fetch wallet stats");
    }
},

fetchWalletById: async (walletId) => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get(`/admin/wallet_management/${walletId}`);
        set({ walletDetails: res.data, loading: false });
        toast.success("Fetched Single Wallet successfully")

    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch wallet details", loading: false, showErrorModal: true });
        toast.error("Failed to fetch wallet details");
    }
},

fetchTransactionOverview: async (payload) => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.post("/admin/wallet_management/transaction_overview", payload);
        console.log('TRANSACTION OVERVIEW RESULT: ', res.data.message)
        set({ transactionOverview: res.data.message, loading: false });
        return res.data.message
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch transaction overview", loading: false, showErrorModal: true });
        toast.error("Failed to fetch transaction overview");
    }
},
})
)

export default useWalletStore;