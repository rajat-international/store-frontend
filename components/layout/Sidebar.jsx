"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  PackageMinus,
  History,
} from "lucide-react";

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Fabrics", href: "/dashboard/fabrics", icon: Shirt },
  { name: "Issues", href: "/dashboard/issues", icon: PackageMinus },
  { name: "History", href: "/dashboard/history", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 bg-white sticky top-0 h-screen border-r flex flex-col">
      <div className="py-3 flex justify-center border-b">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={200}
          height={80}
          className="w-32"
        />
      </div>

      <nav className="flex flex-col items-center gap-2 p-2 flex-1 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              title={menu.name}
              className={`group relative flex flex-col items-center justify-center w-full py-3 rounded-lg transition
                ${isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] mt-1 leading-none">{menu.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}