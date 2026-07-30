"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function IssueTable({ issues = [] }) {
  const [dateFilter, setDateFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [challanFilter, setChallanFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      const matchesDate = dateFilter
        ? new Date(item.createdAt).toLocaleDateString("en-CA") === dateFilter
        : true;

      const matchesName = nameFilter
        ? item.issuedTo?.toLowerCase().includes(nameFilter.toLowerCase())
        : true;

      const matchesChallan = challanFilter
        ? item.challanNo?.toString().toLowerCase().includes(challanFilter.toLowerCase())
        : true;

      return matchesDate && matchesName && matchesChallan;
    });
  }, [issues, dateFilter, nameFilter, challanFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredIssues.length / ITEMS_PER_PAGE));
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // reset to page 1 jab bhi filter change ho
  };

  const clearFilters = () => {
    setDateFilter("");
    setNameFilter("");
    setChallanFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:items-end">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-600">Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={handleFilterChange(setDateFilter)}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          />
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-600">Issued To (Name)</label>
          <input
            type="text"
            placeholder="Search by name"
            value={nameFilter}
            onChange={handleFilterChange(setNameFilter)}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-56"
          />
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-600">Challan No</label>
          <input
            type="text"
            placeholder="Search by challan no"
            value={challanFilter}
            onChange={handleFilterChange(setChallanFilter)}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-48"
          />
        </div>

        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          Clear
        </button>
      </div>

      {!filteredIssues.length ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          No Issues Found
        </div>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto hidden md:block">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Code</th>
                  <th className="p-4 text-left">Challan No</th>
                  <th className="p-4 text-left">Construction</th>
                  <th className="p-4 text-left">Color</th>
                  <th className="p-4 text-left">Issued To</th>
                  <th className="p-4 text-left">Qty</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIssues.map((item, index) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="p-4">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">{item.fabricCode}</td>
                    <td className="p-4">{item.challanNo}</td>
                    <td className="p-4">{item.construction}</td>
                    <td className="p-4">{item.color}</td>
                    <td className="p-4">{item.issuedTo}</td>
                    <td className="p-4">{item.issuedQuantity}</td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <Link
                          href={`/dashboard/issues/${item._id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {paginatedIssues.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow p-4 text-sm space-y-1"
              >
                <div className="flex justify-between text-gray-500 text-xs mb-2">
                  <span>#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Code</span>
                  <span className="font-medium">{item.fabricCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Challan No</span>
                  <span className="font-medium">{item.challanNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Construction</span>
                  <span className="font-medium">{item.construction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Color</span>
                  <span className="font-medium">{item.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Issued To</span>
                  <span className="font-medium">{item.issuedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Qty</span>
                  <span className="font-medium">{item.issuedQuantity}</span>
                </div>
                <Link
                  href={`/dashboard/issues/${item._id}`}
                  className="block text-center bg-blue-500 text-white px-3 py-2 rounded mt-2"
                >
                  View
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl shadow p-4">
            <span className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredIssues.length)} of{" "}
              {filteredIssues.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}