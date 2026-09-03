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

  // Flatten: one row per fabric line-item, keeping the parent challan info attached
  const flatRows = useMemo(() => {
    const rows = [];
    for (const issue of filteredIssues) {
      const lines = Array.isArray(issue.items) && issue.items.length > 0
        ? issue.items
        : [{}]; // fallback so old single-fabric issues (if any remain) still render a row

      lines.forEach((line, lineIndex) => {
        rows.push({
          key: `${issue._id}-${lineIndex}`,
          issueId: issue._id,
          createdAt: issue.createdAt,
          challanNo: issue.challanNo,
          issuedTo: issue.issuedTo,
          fabricCode: line.fabricCode,
          construction: line.construction,
          color: line.color,
          issuedQuantity: line.issuedQuantity,
          isFirstLineOfIssue: lineIndex === 0,
          lineCount: lines.length,
        });
      });
    }
    return rows;
  }, [filteredIssues]);

  const totalPages = Math.max(1, Math.ceil(flatRows.length / ITEMS_PER_PAGE));
  const paginatedRows = flatRows.slice(
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

      {!flatRows.length ? (
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
                {(() => {
                  let issueCounter = (currentPage - 1) * ITEMS_PER_PAGE;

                  return paginatedRows.map((row) => {
                    if (row.isFirstLineOfIssue) {
                      issueCounter += 1;
                    }
                    const displaySerial = row.isFirstLineOfIssue ? issueCounter : "";

                    return (
                      <tr key={row.key} className="border-t hover:bg-gray-50">
                        <td className="p-4">{displaySerial}</td>
                        <td className="p-4">
                          {row.isFirstLineOfIssue
                            ? new Date(row.createdAt).toLocaleDateString()
                            : ""}
                        </td>
                        <td className="p-4">{row.fabricCode}</td>
                        <td className="p-4">
                          {row.isFirstLineOfIssue ? row.challanNo : ""}
                        </td>
                        <td className="p-4">{row.construction}</td>
                        <td className="p-4">{row.color}</td>
                        <td className="p-4">
                          {row.isFirstLineOfIssue ? row.issuedTo : ""}
                        </td>
                        <td className="p-4">{row.issuedQuantity}</td>
                        <td className="p-4">
                          {row.isFirstLineOfIssue && (
                            <div className="flex gap-2 justify-center">
                              <Link
                                href={`/dashboard/issues/${row.issueId}`}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                              >
                                View
                              </Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>

          {/* Mobile card view — one card per issue (challan), fabrics listed inside */}
          <div className="md:hidden space-y-3">
            {Object.values(
              paginatedRows.reduce((acc, row) => {
                if (!acc[row.issueId]) {
                  acc[row.issueId] = {
                    issueId: row.issueId,
                    createdAt: row.createdAt,
                    challanNo: row.challanNo,
                    issuedTo: row.issuedTo,
                    lines: [],
                  };
                }
                acc[row.issueId].lines.push(row);
                return acc;
              }, {})
            ).map((group, index) => (
              <div
                key={group.issueId}
                className="bg-white rounded-xl shadow p-4 text-sm space-y-1"
              >
                <div className="flex justify-between text-gray-500 text-xs mb-2">
                  <span>#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
                  <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Challan No</span>
                  <span className="font-medium">{group.challanNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Issued To</span>
                  <span className="font-medium">{group.issuedTo}</span>
                </div>

                <div className="border-t mt-2 pt-2 space-y-2">
                  {group.lines.map((line) => (
                    <div key={line.key} className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        {line.fabricCode} ({line.construction}, {line.color})
                      </span>
                      <span className="font-medium">{line.issuedQuantity}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/dashboard/issues/${group.issueId}`}
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
              {Math.min(currentPage * ITEMS_PER_PAGE, flatRows.length)} of{" "}
              {flatRows.length}
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