"use client";

import { useQuery } from "@tanstack/react-query";
import { getIssues } from "@/services/issue";

export default function useIssues(params) {
  return useQuery({
    queryKey: ["issues", params],

    queryFn: async () => {
      const res = await getIssues(params);
      return res.data;
    },

    staleTime: 1000 * 60,
  });
}