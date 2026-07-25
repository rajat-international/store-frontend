    "use client";

import Link from "next/link";

export default function IssueTable({ issues = [] }) {

  if (!issues.length) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        No Issues Found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">

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

          {issues.map((item, index) => (

            <tr
              key={item._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4">
                {index + 1}
              </td>

              <td className="p-4">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              <td className="p-4">
                {item.fabricCode}
              </td>
              <td>{item.challanNo}</td>
              <td className="p-4">
                {item.construction}
              </td>

              <td className="p-4">
                {item.color}
              </td>

              <td className="p-4">
                {item.issuedTo}
              </td>

              <td className="p-4">
                {item.issuedQuantity}
              </td>

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
  );
}