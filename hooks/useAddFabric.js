"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFabric } from "@/services/fabric";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useAddFabric() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: addFabric,

    onSuccess: (res) => {
      toast.success(res.data.message);

      queryClient.invalidateQueries({
        queryKey: ["fabrics"],
      });

      router.push("/dashboard/fabrics");
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    },
  });
}