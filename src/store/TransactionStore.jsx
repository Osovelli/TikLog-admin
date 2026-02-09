import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useTransactionStore = create((set) => ({
  
  loading: false,
  error: null,
  showErrorModal: false,
  transactions: [],
  transactionStats: null,
  transactionDetails: null,
  walletDetails: null,
  transactionOverview: null,

fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get("/admin/transaction");
        console.log('ALL TRANSACTION DETAILS: ', res)
        set({ transactions: res.data.data.transactions, loading: false });
        //toast.success("Wallets Fetched Successfully")
        return res.data
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch transactions", loading: false, showErrorModal: true });
        toast.error("Failed to fetch transactions");
        console.error('ERROR FETCHING TRANSACTION DATA: ', error)
    }
},

fetchTransactionStats: async () => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get("/admin/transaction/stats");
        console.log('Transaction STAT RESULT: ', res)
        set({ transactionStats: res.data.data.stats, loading: false });
        //toast.success("Wallet stats fetched successfully!")
        return res.data.data
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch transaction stats", loading: false, showErrorModal: true });
        toast.error("Failed to fetch transaction stats");
        console.error(error)
    }
},

fetchTransactionById: async (transactionId) => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get(`/admin/transaction/${transactionId}`);
        set({ transactionDetails: res.data.data, loading: false });
        return res.data.data
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch transaction details", loading: false, showErrorModal: true });
        toast.error("Failed to fetch transaction details");
    }
},

fetchWalletById: async (walletId) => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get(`/admin/wallet_management/${walletId}`);
        //console.log('SINGLE WALLET RESULT: ', res.data.data)
        set({ walletDetails: res.data.data, loading: false });
        //toast.success("Fetched Single Wallet successfully")
        return res.data.data
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch wallet details", loading: false, showErrorModal: true });
        toast.error("Failed to fetch wallet details");
    }
},

fetchTransactionChartData: async (range = "yearly") => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.get(`/admin/transaction/charts?range=${range}`);
        //console.log('TRANSACTION CHART DATA RESULT: ', res.data)
        set({ transactionOverview: res.data.data, loading: false });
        return res.data.data
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch transaction chart data", loading: false, showErrorModal: true });
        toast.error("Failed to fetch transaction chart data");
    }
},

fetchTransactionOverview: async (payload) => {
    set({ loading: true, error: null });
    try {
        const res = await axiosInstance.post("/admin/wallet_management/transaction_overview", payload);
        console.log('TRANSACTION OVERVIEW RESULT: ', res.data.message)
        set({ transactionOverview: res.data.data, loading: false });
        return res.data.data
    } catch (error) {
        set({ error: error?.response?.data?.message || "Failed to fetch transaction overview", loading: false, showErrorModal: true });
        toast.error("Failed to fetch transaction overview");
    }
},
})
)

export default useTransactionStore;