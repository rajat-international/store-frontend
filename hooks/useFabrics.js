"use client";

import { useQuery } from "@tanstack/react-query";
import { getFabrics } from "@/services/fabric";

export default function useFabrics(params) {
  return useQuery({
    queryKey: ["fabrics", params],

    queryFn: async () => {
      const res = await getFabrics(params);

      console.log("✅ Fabrics API Response:", res.data);

      return res.data;
    },

    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // Cache 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}