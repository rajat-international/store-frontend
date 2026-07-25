"use client";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex justify-end gap-3 mt-6">

      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="border px-4 py-2 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="flex items-center">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="border px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}