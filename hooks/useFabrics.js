"use client";

import { useQuery } from "@tanstack/react-query";
import { getFabrics } from "@/services/fabric";

export default function useFabrics(params) {
  return useQuery({
    queryKey: [
      "fabrics",
      params.page,
      params.limit,
      params.search,
    ],

    queryFn: async () => {
      const res = await getFabrics(params);
      return res.data;
    },

    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}