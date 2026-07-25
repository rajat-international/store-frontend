"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFabric } from "@/services/fabric";
import { toast } from "sonner";

export default function useDeleteFabric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFabric,

    onSuccess: (res) => {
      toast.success(res.data.message);

      queryClient.invalidateQueries({
        queryKey: ["fabrics"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Delete Failed"
      );
    },
  });
}