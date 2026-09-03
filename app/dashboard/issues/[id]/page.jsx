"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import useIssue from "@/hooks/useIssue";

export default function IssueDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useIssue(id);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-8">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow p-8">
        Issue Not Found
      </div>
    );
  }

  const items = data.items || [];

  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.issuedQuantity) || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Issue Details
          </h1>

          <p className="text-gray-500">
            Complete Issue Information
          </p>

        </div>

      </div>

      {/* Challan-level details */}

      <div className="bg-white rounded-xl shadow">

        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">
            Challan Information
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <Info title="Challan No" value={data.challanNo} />

          <Info title="Issued To" value={data.issuedTo} />

          <Info title="Total Fabrics" value={items.length} />

          <Info
            title="Issue Date"
            value={new Date(data.createdAt).toLocaleDateString("en-GB")}
          />

          <Info
            title="Issue Time"
            value={new Date(data.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          />
        </div>

      </div>

      {/* Fabric items */}

      <div className="bg-white rounded-xl shadow">

        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">
            Fabrics Issued
          </h2>
        </div>

        {items.length === 0 ? (
          <p className="p-6 text-gray-500">No fabric items found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Fabric Code</th>
                  <th className="p-4 text-left">Construction</th>
                  <th className="p-4 text-left">Color</th>
                  <th className="p-4 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id || index} className="border-t">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium uppercase">
                      {item.fabricCode}
                    </td>
                    <td className="p-4">{item.construction}</td>
                    <td className="p-4 uppercase">{item.color}</td>
                    <td className="p-4">{item.issuedQuantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-gray-50">
                  <td className="p-4 font-semibold" colSpan={4}>
                    Total
                  </td>
                  <td className="p-4 font-semibold">{totalQuantity}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

      </div>

      {/* Description */}

      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="font-semibold mb-2">
          Description
        </h3>

        <p className="text-gray-600">
          {data.description || "No Description"}
        </p>

      </div>

      {/* Back */}

      <Link
        href="/dashboard/issues"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={18} />
        Back to Issue List
      </Link>

    </div>
  );
}

function Info({ title, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-lg font-semibold mt-1">
        {value ?? "-"}
      </p>
    </div>
  );
}