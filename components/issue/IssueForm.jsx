"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useFabrics from "@/hooks/useFabrics";
import useIssueFabric from "@/hooks/useIssueFabric";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const itemSchema = z.object({
    fabric: z.string().min(1, "Please select fabric"),
    quantity: z.coerce
        .number({ invalid_type_error: "Quantity is required" })
        .positive("Quantity must be greater than 0"),
});

const schema = z.object({
    challanNo: z.string().trim().min(1, "Challan Number is required"),
    issuedTo: z.string().min(2, "Merchant name is required"),
    description: z.string().optional(),
    items: z.array(itemSchema).min(1, "Add at least one fabric"),
});

export default function IssueForm() {
    const router = useRouter();

    const { data } = useFabrics({ page: 1, limit: 1000 });
    const fabrics = data?.data || [];

    const { mutateAsync, isPending } = useIssueFabric();

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            challanNo: "",
            issuedTo: "",
            description: "",
            items: [{ fabric: "", quantity: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const items = watch("items");

    // Check total requested per fabric against stock (in case the same
    // fabric is picked in more than one row)
    const getStockError = () => {
        const totals = {};
        for (const it of items) {
            if (!it.fabric) continue;
            totals[it.fabric] = (totals[it.fabric] || 0) + Number(it.quantity || 0);
        }
        for (const [fabricId, qty] of Object.entries(totals)) {
            const fabric = fabrics.find((f) => f._id === fabricId);
            if (fabric && qty > fabric.quantity) {
                return `Insufficient stock for ${fabric.fabricCode} (requested ${qty}, available ${fabric.quantity} ${fabric.unit})`;
            }
        }
        return null;
    };

    const onSubmit = async (formData) => {
        const stockError = getStockError();
        if (stockError) {
            alert(stockError);
            return;
        }

        try {
            // Single request — backend now handles all items for this
            // challan in one transaction (see issueFabric controller)
            await mutateAsync({
                challanNo: formData.challanNo,
                issuedTo: formData.issuedTo,
                description: formData.description,
                items: formData.items.map((item) => ({
                    fabric: item.fabric,
                    quantity: Number(item.quantity),
                })),
            });

            reset();
            router.push("/dashboard/issues");
        } catch (err) {
            alert(err?.message || "Failed to issue fabric");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow p-6 space-y-6"
        >
            {/* Merchant */}
            <div>
                <label className="block mb-2 font-medium">Merchant Name</label>
                <Input
                    className="uppercase"
                    placeholder="Enter Merchant Name"
                    {...register("issuedTo")}
                />
                {errors.issuedTo && (
                    <p className="text-red-500 text-sm mt-1">{errors.issuedTo.message}</p>
                )}
            </div>

            {/* Challan No */}
            <div>
                <label className="font-medium block mb-2">Challan No</label>
                <Input placeholder="Enter Challan Number" {...register("challanNo")} />
                {errors.challanNo && (
                    <p className="text-red-500 text-sm mt-1">{errors.challanNo.message}</p>
                )}
            </div>

            {/* Fabric line items */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="font-medium">Fabrics</label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ fabric: "", quantity: "" })}
                    >
                        + Add Fabric
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <FabricRow
                        key={field.id}
                        index={index}
                        fabrics={fabrics}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        errors={errors}
                        onRemove={() => fields.length > 1 && remove(index)}
                        canRemove={fields.length > 1}
                    />
                ))}

                {errors.items?.root && (
                    <p className="text-red-500 text-sm">{errors.items.root.message}</p>
                )}
            </div>

            {/* Description (shared across the challan) */}
            <div>
                <label className="block mb-2 font-medium">Description</label>
                <Input placeholder="Optional" {...register("description")} />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Issuing..." : "Issue Fabric"}
            </Button>
        </form>
    );
}

function FabricRow({ index, fabrics, register, setValue, watch, errors, onRemove, canRemove }) {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    const selectedId = watch(`items.${index}.fabric`);
    const selectedFabric = fabrics.find((f) => f._id === selectedId);

    const filteredFabrics = fabrics.filter((fabric) => {
        const text = search.toLowerCase();
        return (
            fabric.fabricCode?.toLowerCase().includes(text) ||
            fabric.construction?.toLowerCase().includes(text) ||
            fabric.color?.toLowerCase().includes(text) ||
            fabric.rackNumber?.toLowerCase().includes(text) ||
            fabric.composition?.some((item) => item.material.toLowerCase().includes(text))
        );
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const itemErrors = errors.items?.[index];

    return (
        <div className="rounded-xl border p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div ref={wrapperRef} className="relative flex-1">
                    <Input
                        placeholder="Search by Fabric Code / Construction / Color / Rack..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowDropdown(true);
                            setValue(`items.${index}.fabric`, "", { shouldValidate: false });
                        }}
                        onFocus={() => {
                            if (search) setShowDropdown(true);
                        }}
                    />
                    <input type="hidden" {...register(`items.${index}.fabric`)} />

                    {showDropdown && search && (
                        <div className="border rounded-lg mt-2 max-h-72 overflow-y-auto absolute w-full bg-white z-10 shadow-lg">
                            {filteredFabrics.length === 0 ? (
                                <p className="p-4 text-gray-500">No Fabric Found</p>
                            ) : (
                                filteredFabrics.map((fabric) => (
                                    <div
                                        key={fabric._id}
                                        onClick={() => {
                                            setValue(`items.${index}.fabric`, fabric._id, {
                                                shouldValidate: true,
                                            });
                                            setSearch(
                                                `${fabric.fabricCode} | ${fabric.construction} | ${fabric.color}`
                                            );
                                            setShowDropdown(false);
                                        }}
                                        className="cursor-pointer border-b p-3 hover:bg-gray-100"
                                    >
                                        <p className="font-semibold">{fabric.fabricCode}</p>
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
                    {itemErrors?.fabric && (
                        <p className="text-red-500 text-sm mt-1">{itemErrors.fabric.message}</p>
                    )}
                </div>

                {canRemove && (
                    <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
                        Remove
                    </Button>
                )}
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Quantity</label>
                <Input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="e.g. 2.5"
                    {...register(`items.${index}.quantity`)}
                />
                {itemErrors?.quantity && (
                    <p className="text-red-500 text-sm mt-1">{itemErrors.quantity.message}</p>
                )}
                {selectedFabric && (
                    <p className="text-xs text-gray-500 mt-1">
                        Available: {selectedFabric.quantity} {selectedFabric.unit}
                    </p>
                )}
            </div>

            {selectedFabric && (
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
                    <span>GSM: {selectedFabric.gsm}</span>
                    <span>Rack: {selectedFabric.rackNumber}</span>
                </div>
            )}
        </div>
    );
}