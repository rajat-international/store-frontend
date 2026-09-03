"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { Pencil, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Image from "next/image";

const ZOOM_STEP = 0.5;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function FabricTable({ fabrics = [] }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [zoom, setZoom] = useState(1);

    const closePreview = useCallback(() => {
        setPreviewImage(null);
        setZoom(1);
    }, []);

    // Close on Escape key
    useEffect(() => {
        if (!previewImage) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") closePreview();
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [previewImage, closePreview]);

    // Lock body scroll while modal is open
    useEffect(() => {
        if (previewImage) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [previewImage]);

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
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewImage({
                                                src: fabric.image,
                                                alt: fabric.fabricCode,
                                            });
                                            setZoom(1);
                                        }}
                                        className="cursor-zoom-in"
                                    >
                                        <Image
                                            src={fabric.image}
                                            alt={fabric.fabricCode}
                                            width={100}
                                            height={80}
                                            unoptimized
                                            className="object-cover h-20 w-25 rounded border hover:opacity-80 transition-opacity"
                                        />
                                    </button>
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

            {/* Image preview modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={closePreview}
                >
                    {/* Toolbar */}
                    <div
                        className="absolute top-4 right-4 flex items-center gap-2 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
                            disabled={zoom <= MIN_ZOOM}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Zoom out"
                        >
                            <ZoomOut size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
                            disabled={zoom >= MAX_ZOOM}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Zoom in"
                        >
                            <ZoomIn size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setZoom(1)}
                            disabled={zoom === 1}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Reset zoom"
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={closePreview}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Image */}
                    <div
                        className="relative max-w-full max-h-full overflow-auto flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            unoptimized
                            height={500}
                            width={500}
                            src={previewImage.src}
                            alt={previewImage.alt}
                            style={{
                                transform: `scale(${zoom})`,
                                transition: "transform 0.15s ease-out",
                                cursor: zoom > 1 ? "grab" : "default",
                            }}
                            className="max-w-[90vw] max-h-[85vh] object-contain select-none"
                            draggable={false}
                        />
                    </div>

                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs">
                        {Math.round(zoom * 100)}% — click outside or press Esc to close
                    </p>
                </div>
            )}
        </div>
    );
}