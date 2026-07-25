import api from "@/lib/axios";

export const getHistory = (params) =>
  api.get("/history", { params });

export const getHistoryItem = (id) =>
  api.get(`/history/${id}`);