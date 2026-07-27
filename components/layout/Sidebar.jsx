"use client";

import Image from "next/image";
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
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-36 bg-white  border-r min-h-screen">

      <div className="text-2xl font-bold py-2 flex justify-center border-b">

        <Image className="h-16 w-auto" alt="logo" height={60} width={200} src="/assets/logo.png"/>

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