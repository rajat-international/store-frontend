"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import useHistoryItem from "@/hooks/useHistoryItem";

export default function HistoryDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useHistoryItem(id);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        History Not Found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Stock History Details
          </h1>

          <p className="text-gray-500">
            Complete Transaction Information
          </p>
        </div>

        <Link
          href="/dashboard/history"
          className="flex items-center gap-2 text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      {/* Details */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Info title="Fabric Code" value={data.fabricCode} />

          <Info title="Transaction Type" value={data.type} />

          <Info title="Quantity" value={data.quantity} />

          <Info title="Old Stock" value={data.oldStock} />

          <Info title="New Stock" value={data.newStock} />

          <Info
            title="Difference"
            value={
              data.type === "ISSUE"
                ? `-${data.quantity}`
                : `+${data.quantity}`
            }
          />

          <Info
            title="Merchant"
            value={data.merchant || "-"}
          />

          <Info
            title="Challan No"
            value={data.challanNo || "-"}
          />

          <Info
            title="Date"
            value={new Date(data.createdAt).toLocaleDateString(
              "en-GB"
            )}
          />

          <Info
            title="Time"
            value={new Date(data.createdAt).toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              }
            )}
          />

        </div>

      </div>

      {/* Description */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-3">
          Description
        </h2>

        <p className="text-gray-600">
          {data.description || "No Description"}
        </p>

      </div>

    </div>
  );
}

function Info({ title, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-lg font-semibold mt-1">
        {value}
      </h3>
    </div>
  );
}