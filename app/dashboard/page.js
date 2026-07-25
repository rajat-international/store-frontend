"use client";

import DashboardCard from "@/components/dashboard/DashboardCard";
import useDashboard from "@/hooks/useDashboard";
import RecentIssues from "@/components/dashboard/RecentIssues";
export default function DashboardPage() {

  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading)
    return <h2>Loading...</h2>;

  if (error)
    return <h2>Error loading dashboard.</h2>;

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">

        Dashboard

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <DashboardCard
          title="Total Fabrics"
          value={data.totalFabrics}
        />

        <DashboardCard
          title="Current Stock"
          value={data.currentStock}
        />

        <DashboardCard
          title="Total Issued"
          value={data.totalIssued}
        />

        <DashboardCard
          title="Low Stock"
          value={data.lowStockCount}
        />

      </div><RecentIssues issues={data.recentIssues} />

    </div>
  );
}