"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import useExportFabrics from "@/hooks/useExportFabrics";
import useFabrics from "@/hooks/useFabrics";
import { categoryname } from "@/lib/utils";
import FabricTable from "@/components/fabric/FabricTable";
import SearchBar from "@/components/fabric/SearchBar";
import Pagination from "@/components/common/Pagination";

export default function FabricsPage() {
 const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
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
  category,
});
const { mutate: exportExcel, isPending } =
  useExportFabrics();

  if (error) return <h2>Error loading fabrics</h2>;

  return (
    <div className="min-w-0">
      <div className="flex justify-between items-center mb-6">
   <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

  <div className="flex flex-wrap gap-3">
    <SearchBar
      value={search}
      onChange={setSearch}
    />

    <select
      value={category}
      onChange={(e) => {
        setCategory(e.target.value);
        setPage(1);
      }}
      className="border rounded-lg px-4 py-2"
    >
      <option value="">All Categories</option>
        {categoryname.map((cat) => (
        <option key={cat.value} value={cat.value}>
         {cat.label}
        </option>
         ))}
    </select>
  </div>

  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => exportExcel()}
      disabled={isPending}
      className="bg-green-600 text-white px-5 py-2 rounded-lg whitespace-nowrap"
    >
      {isPending ? "Exporting..." : "Export Excel"}
    </button>

    <Link
      href="/dashboard/fabrics/add"
      className="bg-black text-white px-5 py-2 rounded-lg whitespace-nowrap"
    >
      + Add Fabric
    </Link>
  </div>

</div>
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