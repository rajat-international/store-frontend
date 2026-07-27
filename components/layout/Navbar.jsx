"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/utils/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Fabric Inventory</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
}