"use client";

import Link from "next/link";

import useIssues from "@/hooks/useIssues";
import IssueTable from "@/components/issue/IssueTable";

export default function IssuesPage() {
  const { data, isLoading } = useIssues({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Issue List
        </h1>

        <Link
          href="/dashboard/issues/add"
          className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg transition"
        >
          + Issue Fabric
        </Link>

      </div>

      <IssueTable
        issues={data?.data || []}
      />

    </div>
  );
}