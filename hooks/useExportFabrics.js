"use client";

import { useMutation } from "@tanstack/react-query";
import { exportFabrics } from "@/services/fabric";
import { toast } from "sonner";

export default function useExportFabrics() {
  return useMutation({
    mutationFn: exportFabrics,

    onSuccess: (res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = "FabricInventory.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Excel Downloaded Successfully");
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to Export"
      );
    },
  });
}