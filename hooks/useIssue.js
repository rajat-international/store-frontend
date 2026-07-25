"use client";

import { useQuery } from "@tanstack/react-query";
import { getIssue } from "@/services/issue";

export default function useIssue(id) {
  return useQuery({
    queryKey: ["issue", id],

    queryFn: async () => {
      const res = await getIssue(id);
      return res.data.data;
    },

    enabled: !!id,

    staleTime: 1000 * 60,
  });
}