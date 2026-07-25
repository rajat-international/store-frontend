"use client";

import { useQuery } from "@tanstack/react-query";
import { getHistoryItem } from "@/services/history";

export default function useHistoryItem(id) {
  return useQuery({
    queryKey: ["history", id],

    queryFn: async () => {
      const res = await getHistoryItem(id);
      return res.data.data;
    },

    enabled: !!id,

    staleTime: 1000 * 60,
  });
}