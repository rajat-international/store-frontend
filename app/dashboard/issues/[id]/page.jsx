"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";

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

      {/* Details */}

      <div className="bg-white rounded-xl shadow">

        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">
            Fabric Information
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <Info
            title="Challan No"
            value={data.challanNo}
          />

          <Info title="Fabric Code" value={data.fabricCode} />

          <Info title="Construction" value={data.construction} />

          <Info title="Color" value={data.color} />

          <Info title="Issued To" value={data.issuedTo} />

          <Info title="Issued Quantity" value={data.issuedQuantity} />

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