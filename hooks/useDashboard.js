"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/services/dashboard";

export default function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async () => {
      const res = await getDashboard();
      return res.data.data;
    },

    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}