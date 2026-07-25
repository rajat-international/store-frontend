"use client";

export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <input
      type="text"
      placeholder="Search by Code or Construction..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-4 py-2 w-80"
    />
  );
}