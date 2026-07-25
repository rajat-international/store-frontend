"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser } from "@/services/auth";
import { saveUser } from "@/utils/auth";

export default function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      console.log("Sending:", data);

      const res = await loginUser(data);

      console.log("Response:", res.data);

      return res;
    },

    onSuccess: (response) => {
      console.log("SUCCESS");

      saveUser(response.data);

      console.log("TOKEN:", localStorage.getItem("token"));

      toast.success(response.data.message);

      router.push("/dashboard");
    },

    onError: (error) => {
      console.log("ERROR:", error);

      toast.error(error.response?.data?.message || "Login Failed");
    },
  });
}