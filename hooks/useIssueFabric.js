"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { issueFabric } from "@/services/issue";
import { toast } from "sonner";

export default function useIssueFabric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issueFabric,

    onSuccess: (res) => {
      toast.success(res.data.message);

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fabrics"],
      });

      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });

      queryClient.invalidateQueries({
        queryKey: ["history"],
      });
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Issue Failed"
      );
    },
  });
}