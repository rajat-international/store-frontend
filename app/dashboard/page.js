"use client";

import Link from "next/link";
import {
  Layers,
  Package,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

import DashboardCard from "@/components/dashboard/DashboardCard";
import useDashboard from "@/hooks/useDashboard";
import RecentIssues from "@/components/dashboard/RecentIssues";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Error loading dashboard.</h2>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <Link
          href="/dashboard/fabrics/add"
          className="bg-black text-white px-5 py-2 rounded-lg text-sm"
        >
          + Add Fabric
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <Link href="/dashboard/fabrics">
          <DashboardCard
            title="Total Fabrics"
            value={data.totalFabrics}
            icon={<Layers className="text-blue-600" size={24} />}
          />
        </Link>

        <Link href="/dashboard/fabrics">
          <DashboardCard
            title="Current Stock"
            value={data.currentStock}
            icon={<Package className="text-green-600" size={24} />}
          />
        </Link>

        <Link href="/dashboard/issues">
          <DashboardCard
            title="Total Issued"
            value={data.totalIssued}
            icon={<ArrowUpRight className="text-purple-600" size={24} />}
          />
        </Link>

        <Link href="/dashboard/fabrics">
          <DashboardCard
            title="Low Stock"
            value={data.lowStockCount}
            icon={<AlertTriangle className="text-red-600" size={24} />}
            highlight={data.lowStockCount > 0}
          />
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Recent Issues</h2>

          <Link
            href="/dashboard/issues"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        <RecentIssues issues={data.recentIssues} />
      </div>

    </div>
  );
}