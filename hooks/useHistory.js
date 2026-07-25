"use client";

import { useQuery } from "@tanstack/react-query";
import { getHistory } from "@/services/history";

export default function useHistory(params) {
  return useQuery({
    queryKey: ["history", params],

    queryFn: async () => {
      const res = await getHistory(params);
      return res.data;
    },

    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}