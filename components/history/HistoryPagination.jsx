"use client";

export default function HistoryPagination({
    page,
    totalPages,
    onPageChange,
}) {

    if (totalPages <= 1) return null;

    return (

        <div className="flex justify-end gap-2 mt-6">

            <button

                disabled={page === 1}

                onClick={() => onPageChange(page - 1)}

                className="border px-4 py-2 rounded"

            >

                Previous

            </button>

            <span className="px-4 py-2">

                {page} / {totalPages}

            </span>

            <button

                disabled={page === totalPages}

                onClick={() => onPageChange(page + 1)}

                className="border px-4 py-2 rounded"

            >

                Next

            </button>

        </div>

    );

}