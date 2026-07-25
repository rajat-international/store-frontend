import api from "@/lib/axios";

export const getIssues = (params) =>
  api.get("/issues", { params });

export const getIssue = (id) =>
  api.get(`/issues/${id}`);

export const issueFabric = (data) =>
  api.post("/issues", data);

export const returnFabric = (data) =>
  api.post("/issues/return", data);