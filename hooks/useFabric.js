"use client";

import { useQuery } from "@tanstack/react-query";
import { getFabric } from "@/services/fabric";

export default function useFabric(id) {
  return useQuery({
    queryKey: ["fabric", id],

    queryFn: async () => {
      const res = await getFabric(id);
      return res.data.data;
    },

    enabled: !!id,

    staleTime: 1000 * 60 * 5,
  });
}