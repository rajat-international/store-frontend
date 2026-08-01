"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useFabrics from "@/hooks/useFabrics";
import useIssueFabric from "@/hooks/useIssueFabric";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
    fabric: z.string().min(1, "Please select fabric"),

    challanNo: z
        .string()
        .trim()
        .min(1, "Challan Number is required"),

    issuedTo: z
        .string()
        .min(2, "Merchant name is required"),

    quantity: z.coerce
        .number()
        .min(1, "Quantity must be greater than 0"),

    description: z.string().optional(),
});

export default function IssueForm() {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);
    const router = useRouter();

    const { data } = useFabrics({
        page: 1,
        limit: 1000,
    });

    const fabrics = data?.data || [];

    const filteredFabrics = fabrics.filter((fabric) => {
        const text = search.toLowerCase();

        return (
            fabric.fabricCode?.toLowerCase().includes(text) ||
            fabric.construction?.toLowerCase().includes(text) ||
            fabric.color?.toLowerCase().includes(text) ||
            fabric.rackNumber?.toLowerCase().includes(text) ||
            fabric.composition?.some((item) =>
                item.material.toLowerCase().includes(text)
            )
        );
    });

    const { mutate, isPending } = useIssueFabric();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });
    const selectedId = watch("fabric");

    const selectedFabric = fabrics.find(
        (item) => item._id === selectedId
    );

    // Close dropdown when clicking outside the search box
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onSubmit = (formData) => {
        if (!selectedFabric) return;

        if (
            Number(formData.quantity) >
            selectedFabric.quantity
        ) {
            alert("Insufficient Stock");
            return;
        }

        mutate(
            {
                fabric: selectedFabric._id,
                challanNo: formData.challanNo,
                issuedTo: formData.issuedTo,
                quantity: Number(formData.quantity),
                description: formData.description,
            },
            {
                onSuccess: () => {
                    reset();
                    setSearch("");
                    setShowDropdown(false);
                    router.push("/dashboard/issues");
                },
            }
        );
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow p-6 space-y-6"
        >
            {/* Select Fabric */}

            <div ref={wrapperRef} className="relative">
                <label className="block mb-2 font-medium">
                    Select Fabric
                </label>

                <Input
                    placeholder="Search by Fabric Code / Construction / Color / Rack..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                        // user is typing a new query, so clear any previous selection
                        setValue("fabric", "", { shouldValidate: false });
                    }}
                    onFocus={() => {
                        if (search) setShowDropdown(true);
                    }}
                />

                <input
                    type="hidden"
                    {...register("fabric")}
                />

                {showDropdown && search && (
                    <div className="border rounded-lg mt-2 max-h-72 overflow-y-auto absolute w-full bg-white z-10 shadow-lg">

                        {filteredFabrics.length === 0 ? (
                            <p className="p-4 text-gray-500">
                                No Fabric Found
                            </p>
                        ) : (
                            filteredFabrics.map((fabric) => (
                                <div
                                    key={fabric._id}
                                    onClick={() => {
                                        setValue("fabric", fabric._id, {
                                            shouldValidate: true,
                                        });

                                        setSearch(
                                            `${fabric.fabricCode} | ${fabric.construction} | ${fabric.color}`
                                        );

                                        setShowDropdown(false);
                                    }}
                                    className="cursor-pointer border-b p-3 hover:bg-gray-100"
                                >
                                    <p className="font-semibold">
                                        {fabric.fabricCode}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {fabric.construction} | {fabric.color}
                                    </p>

                                    <p className="text-xs">
                                        Stock : {fabric.quantity} {fabric.unit}
                                    </p>
                                </div>
                            ))
                        )}

                    </div>
                )}

                {errors.fabric && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.fabric.message}
                    </p>
                )}
            </div>

            {/* Fabric Details */}

            {selectedFabric && (
                <div className="rounded-xl border bg-gray-50 p-5">

                    <h2 className="text-xl font-bold mb-5">
                        Fabric Information
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                        <Info
                            title="Fabric Code"
                            value={selectedFabric.fabricCode}
                        />

                        <Info
                            title="Construction"
                            value={selectedFabric.construction}
                        />

                        <Info
                            title="Color"
                            value={selectedFabric.color}
                        />

                        <Info
                            title="GSM"
                            value={selectedFabric.gsm}
                        />

                        <Info
                            title="Rack Number"
                            value={selectedFabric.rackNumber}
                        />

                        <Info
                            title="Current Stock"
                            value={`${selectedFabric.quantity} ${selectedFabric.unit}`}
                        />

                        <div className="md:col-span-2 lg:col-span-3">

                            <p className="text-sm text-gray-500">
                                Composition
                            </p>

                            <p className="font-semibold">
                                {selectedFabric.composition
                                    ?.map(
                                        (item) =>
                                            `${item.percentage}% ${item.material}`
                                    )
                                    .join(", ")}
                            </p>

                        </div>

                    </div>

                </div>
            )}

            {/* Merchant */}

            <div>

                <label className="block mb-2 font-medium">
                    Merchant Name
                </label>
                <Input
                    className="uppercase"
                    placeholder="Enter Merchant Name"
                    {...register("issuedTo")}
                />

                {errors.issuedTo && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.issuedTo.message}
                    </p>
                )}

            </div>

            {/* challan No */}

            <div>
                <label className="font-medium block mb-2">
                    Challan No
                </label>

                <Input
                    placeholder="Enter Challan Number"
                    {...register("challanNo")}
                />

                {errors.challanNo && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.challanNo.message}
                    </p>
                )}
            </div>

            {/* Quantity */}

            <div>

                <label className="block mb-2 font-medium">
                    Issue Quantity
                </label>

                <Input
                    type="number"
                    placeholder="Enter Quantity"
                    {...register("quantity")}
                />

                {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.quantity.message}
                    </p>
                )}

            </div>

            {/* Description */}

            <div>

                <label className="block mb-2 font-medium">
                    Description
                </label>

                <Input
                    placeholder="Optional"
                    {...register("description")}
                />

            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full"
            >
                {isPending
                    ? "Issuing..."
                    : "Issue Fabric"}
            </Button>

        </form>
    );
    function Info({ title, value }) {
        return (
            <div>
                <p className="text-sm text-gray-500">
                    {title}
                </p>

                <p className="font-semibold mt-1">
                    {value}
                </p>
            </div>
        );
    }
}