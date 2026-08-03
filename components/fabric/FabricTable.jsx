"use client";

import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { Pencil, Eye } from "lucide-react";
import Image from "next/image";

export default function FabricTable({ fabrics = [] }) {
    if (!fabrics.length) {
        return (
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
                No Fabrics Found
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm min-w-275">
                <thead className="bg-gray-100">
                    <tr>

                        <th className="p-4 text-left">#</th>
                        <th className="p-4 text-left">image</th>
                        <th className="p-4 text-left">Code</th>
                        <th className="p-4 text-left">category</th>

                        <th className="p-4 text-left">Construction</th>

                        <th className="p-4 text-left">Composition</th>

                        <th className="p-4 text-left">GSM</th>

                        <th className="p-4 text-left">Color</th>


                        <th className="p-4 text-left">Stock</th>

                        <th className="p-4 text-left">Unit</th>
                        <th className="p-4 text-left">Width</th>


                        <th className="p-4 text-left">Rack</th>

                        <th className="p-4 text-center">Action</th>

                    </tr>

                </thead>

                <tbody>

                    {fabrics.map((fabric, index) => (

                        <tr
                            key={fabric._id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="p-4">{index + 1}</td>
                            <td className="p-4">
                                {fabric.image ? (
                                    <Image
                                        src={fabric.image}
                                        alt={fabric.fabricCode}
                                        width={100}
                                        height={80}
                                        unoptimized
                                        className="object-cover h-20 w-25 rounded border"
                                    />
                                ) : (
                                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded border">
                                        No Img
                                    </div>
                                )}
                            </td>

                            <td className="p-4 font-medium uppercase whitespace-nowrap">
                                {fabric.fabricCode}
                            </td>
                            <td className="p-4 font-medium">
                                {fabric.category}
                            </td>

                            <td className="p-4">
                                {fabric.construction}
                            </td>

                            <td className="p-4">
                                <ul className="list-disc list-inside">
                                    {fabric.composition?.map((item, index) => (
                                        <li className="whitespace-nowrap" key={index}>
                                            {item.percentage}% {item.material}
                                        </li>
                                    ))}
                                </ul>
                            </td>

                            <td className="p-4">{fabric.gsm}</td>

                            <td className="p-4 uppercase">{fabric.color}</td>


                            <td className="p-4">

                                <span
                                    className={`px-2 py-1 rounded text-white ${fabric.quantity <= fabric.lowStockLimit
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                        }`}
                                >
                                    {fabric.quantity}
                                </span>

                            </td>

                            <td className="p-4">
                                {fabric.unit}
                            </td>
                            <td className="p-4">
                                {fabric.width}
                            </td>

                           

                            <td className="p-4 uppercase">
                                {fabric.rackNumber}
                            </td>

                            <td className="p-4">

                                <div className="flex gap-2 justify-center">

                                    <Link
                                        href={`/dashboard/fabrics/${fabric._id}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/dashboard/fabrics/edit/${fabric._id}`}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                    >
                                        <Pencil size={18} />
                                    </Link>

                                    <DeleteButton id={fabric._id} />

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}