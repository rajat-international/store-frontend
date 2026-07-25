"use client";

import useHistory from "@/hooks/useHistory";
import HistoryTable from "@/components/history/HistoryTable";

export default function HistoryPage() {
  const { data, isLoading } = useHistory({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Stock History
        </h1>

      </div>

      <HistoryTable
        history={data?.data || []}
      />

    </div>
  );
}