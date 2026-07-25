"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Fabrics",
    href: "/dashboard/fabrics",
  },
  {
    name: "Issues",
    href: "/dashboard/issues",
  },
  {
    name: "History",
    href: "/dashboard/history",
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen">

      <div className="text-2xl font-bold p-5 border-b">

        Inventory

      </div>

      <nav className="flex flex-col p-3">

        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`px-4 py-3 rounded-lg mb-2 transition

            ${
              pathname === menu.href
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {menu.name}
          </Link>
        ))}

      </nav>

    </aside>
  );
}