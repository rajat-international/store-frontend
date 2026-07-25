"use client";

import useDeleteFabric from "@/hooks/useDeleteFabric";

export default function DeleteButton({ id }) {
  const { mutate, isPending } = useDeleteFabric();

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Delete this fabric?"
    );

    if (!confirmDelete) return;

    mutate(id);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}