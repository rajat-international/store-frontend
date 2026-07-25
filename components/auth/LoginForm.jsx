"use client";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import useLogin from "@/hooks/useLogin";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Invalid Email"),

  password: z.string().min(6, "Minimum 6 characters"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">

      <CardHeader>

        <CardTitle className="text-center text-2xl">

          Fabric Inventory

        </CardTitle>

      </CardHeader>

      <CardContent>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          <div>

            <Input
              placeholder="Email"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}

          </div>

          <div className="relative">

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

          </div>

          <Button
           type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>

        </form>

      </CardContent>

    </Card>
  );
}