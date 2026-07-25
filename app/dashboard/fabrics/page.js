"use client";

import { useState } from "react";
import Link from "next/link";

import useFabrics from "@/hooks/useFabrics";

import FabricTable from "@/components/fabric/FabricTable";
import SearchBar from "@/components/fabric/SearchBar";
import Pagination from "@/components/common/Pagination";

export default function FabricsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useFabrics({
    page,
    limit: 10,
    search,
  });

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Error loading fabrics</h2>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <Link
          href="/dashboard/fabrics/add"
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Add Fabric
        </Link>
      </div>

      <FabricTable fabrics={data.data} />

      <Pagination
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}