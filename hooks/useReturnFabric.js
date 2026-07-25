"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { returnFabric } from "@/services/issue";

export default function useReturnFabric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => returnFabric(data),

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

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Return Failed"
      );
    },
  });
}