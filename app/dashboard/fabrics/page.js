"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import useFabrics from "@/hooks/useFabrics";

import FabricTable from "@/components/fabric/FabricTable";
import SearchBar from "@/components/fabric/SearchBar";
import Pagination from "@/components/common/Pagination";

export default function FabricsPage() {
 const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);

const { data, isLoading, error } = useFabrics({
  page,
  limit: 10,
  search: debouncedSearch,
});


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
{isLoading && (
  <p className="mb-2 text-sm text-gray-500">
    Searching...
  </p>
)}
    <FabricTable fabrics={data?.data || []} />

<Pagination
  page={page}
  totalPages={data?.totalPages || 1}
  onPageChange={setPage}
/>
    </div>
  );
}