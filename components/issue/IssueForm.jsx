"use client";

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
    issuedTo: z.string().min(2, "Merchant name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
    description: z.string().optional(),
});

export default function IssueForm() {
    const router = useRouter();

    const { data } = useFabrics({
        page: 1,
        limit: 1000,
    });

    const fabrics = data?.data || [];

    const { mutate, isPending } = useIssueFabric();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const selectedId = watch("fabric");

    const selectedFabric = fabrics.find(
        (item) => item._id === selectedId
    );

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
                issuedTo: formData.issuedTo,
                quantity: Number(formData.quantity),
                description: formData.description,
            },
            {
                onSuccess: () => {
                    reset();
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

            <div>
                <label className="block mb-2 font-medium">
                    Select Fabric
                </label>

                <select
                    {...register("fabric")}
                    className="w-full border rounded-lg px-3 py-2"
                >
                    <option value="">
                        Select Fabric
                    </option>

                    {fabrics.map((fabric) => (
                        <option
                            key={fabric._id}
                            value={fabric._id}
                        >
                            {fabric.fabricCode} | {fabric.color} | Stock :
                            {fabric.quantity} {fabric.unit}
                        </option>
                    ))}
                </select>

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