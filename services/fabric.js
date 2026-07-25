import api from "@/lib/axios";

// GET ALL
export const getFabrics = (params) =>
  api.get("/fabrics", { params });

// GET SINGLE
export const getFabric = (id) =>
  api.get(`/fabrics/${id}`);

// ADD
export const addFabric = (data) =>
  api.post("/fabrics", data);

// UPDATE
export const updateFabric = (id, data) =>
  api.put(`/fabrics/${id}`, data);

// DELETE
export const deleteFabric = (id) =>
  api.delete(`/fabrics/${id}`);