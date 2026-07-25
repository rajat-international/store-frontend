"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFabric } from "@/services/fabric";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useUpdateFabric() {
  const router = useRouter();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateFabric(id, data),

    onSuccess: () => {
      toast.success("Fabric Updated");

      queryClient.invalidateQueries({
        queryKey: ["fabrics"],
      });

      router.push("/dashboard/fabrics");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Update Failed"
      );
    },
  });
}