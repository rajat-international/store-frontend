"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

export default function HistoryTable({
    history = [],
}) {
    if (!history.length) {
        return (
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
                No History Found
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="min-w-full text-sm">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="p-4">#</th>

                        <th className="p-4 text-left">
                            Date
                        </th>

                        <th className="p-4 text-left">
                            Fabric
                        </th>

                        <th className="p-4 text-left">
                            Type
                        </th>

                        <th className="p-4 text-left">
                            Qty
                        </th>

                        <th className="p-4 text-left">
                            Old
                        </th>

                        <th className="p-4 text-left">
                            New
                        </th>
                        <th className="p-4">
                            Difference
                        </th>

                        <th className="p-4 text-left">
                            Merchant
                        </th>


                        <th className="p-4 text-left">
                            Description
                        </th>

                        <th className="p-4 text-center">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {history.map((item, index) => (

                        <tr
                            key={item._id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="p-4">
                                {index + 1}
                            </td>

                            <td className="p-4">

                                {new Date(
                                    item.createdAt
                                ).toLocaleDateString("en-GB")}

                                <br />

                                <span className="text-xs text-gray-500">

                                    {new Date(
                                        item.createdAt
                                    ).toLocaleTimeString("en-IN")}

                                </span>

                            </td>

                            <td className="p-4 font-medium">
                                {item.fabricCode}
                            </td>

                            <td className="p-4">

                                <span
                                    className={`px-2 py-1 rounded text-white text-xs

${item.type === "ADD"
                                            ? "bg-green-600"
                                            : item.type === "UPDATE"
                                                ? "bg-blue-600"
                                                : item.type === "ISSUE"
                                                    ? "bg-red-600"
                                                    : "bg-yellow-500"
                                        }`}
                                >
                                    {item.type}
                                </span>

                            </td>

                            <td className="p-4">
                                {item.quantity}
                            </td>

                            <td className="p-4">
                                {item.oldStock}
                            </td>

                            <td className="p-4">
                                {item.newStock}
                            </td>
                            <td className="p-4">

                                {item.type === "ISSUE" ? (

                                    <span className="text-red-600 font-bold">

                                        -{item.quantity}

                                    </span>

                                ) : (

                                    <span className="text-green-600 font-bold">

                                        +{item.quantity}

                                    </span>

                                )}

                            </td>

                            <td className="p-4">
                                {item.merchant || "-"}
                            </td>

                            <td className="p-4">
                                {item.description || "-"}
                            </td>

                            <td className="p-4">

                                <div className="flex justify-center">

                                    <Link
                                        href={`/dashboard/history/${item._id}`}
                                        className="bg-blue-500 text-white p-2 rounded"
                                    >
                                        <Eye size={16} />
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