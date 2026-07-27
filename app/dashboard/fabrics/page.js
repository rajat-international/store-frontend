"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import useExportFabrics from "@/hooks/useExportFabrics";
import useFabrics from "@/hooks/useFabrics";

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
    <div>
      <div className="flex justify-between items-center mb-6">
      <div className="flex gap-3">

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

    <option value="Knitted">Knitted</option>
    <option value="Woven">Woven</option>
    <option value="Rib">Rib</option>
    <option value="Interlock">Interlock</option>
    <option value="French Terry">French Terry</option>
    <option value="Fleece">Fleece</option>
    <option value="Lycra">Lycra</option>
    <option value="Denim">Denim</option>
    <option value="Others">Others</option>
  </select>

</div>

     <div className="flex gap-3">

  <button
    onClick={() => exportExcel()}
    disabled={isPending}
    className="bg-green-600 text-white px-5 py-2 rounded-lg"
  >
    {isPending
      ? "Exporting..."
      : "Export Excel"}
  </button>

  <Link
    href="/dashboard/fabrics/add"
    className="bg-black text-white px-5 py-2 rounded-lg"
  >
    + Add Fabric
  </Link>

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