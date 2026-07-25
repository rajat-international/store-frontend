"use client";

import { useState } from "react";

import useHistory from "@/hooks/useHistory";

import HistoryTable from "@/components/history/HistoryTable";
import Pagination from "@/components/common/Pagination";

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const { data, isLoading } = useHistory({
    page,
    limit: 10,
    search,
    type,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Stock History
        </h1>
      </div>

      {/* Search + Filter */}

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Merchant / Challan / Fabric..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-4 py-2 w-80"
        />

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="ADD">ADD</option>
          <option value="UPDATE">UPDATE</option>
          <option value="ISSUE">ISSUE</option>
          <option value="RETURN">RETURN</option>
        </select>
      </div>

      {isLoading && (
        <p className="mb-3 text-sm text-gray-500">
          Loading...
        </p>
      )}

      <HistoryTable history={data?.data || []} />

      <Pagination
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}