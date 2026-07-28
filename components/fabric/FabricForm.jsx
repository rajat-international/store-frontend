"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import useUpdateFabric from "@/hooks/useUpdateFabric";
import { zodResolver } from "@hookform/resolvers/zod";

import useAddFabric from "@/hooks/useAddFabric";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({

    fabricCode: z.string().min(2, "Fabric Code is required"),
    width: z.string().optional(),
    category: z.string().min(1, "Select Category"),
    construction: z.string().min(2, "Construction is required"),

    composition: z.array(
        z.object({
            material: z.string().min(1, "Material is required"),

            percentage: z.coerce
                .number()
                .min(1, "Minimum 1%")
                .max(100, "Maximum 100%"),
        })
    ),

    gsm: z.coerce.number().min(1, "GSM is required"),
    color: z.string().min(2, "Color is required"),

    supplier: z.string().min(2, "Supplier is required"),

    quantity: z.coerce.number().min(1, "Quantity is required"),

    price: z.coerce.number().min(0),

    unit: z.enum(["Meter", "Kg"]),

    rackNumber: z.string().min(1, "Rack Number is required"),

    lowStockLimit: z.coerce.number().min(1),
});

export default function FabricForm({
    defaultValues,
    isEdit = false,
    fabricId,
}) {
    const addFabric = useAddFabric();

    const updateFabric = useUpdateFabric();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),

        defaultValues: defaultValues || {
            fabricCode: "",
            category: "",
            construction: "",
            composition: [
                {
                    material: "",
                    percentage: "",
                },
            ],
            gsm: "",
            color: "",
            supplier: "",
            quantity: "",
            price: "",
            width: "",
            unit: "Meter",
            rackNumber: "",
            lowStockLimit: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "composition",
    });

    const onSubmit = (data) => {
        const total = data.composition.reduce(
            (sum, item) => sum + Number(item.percentage),
            0
        );

        if (total !== 100) {
            return alert(
                "Composition total must equal 100%"
            );
        }

        if (isEdit) {
            updateFabric.mutate({
                id: fabricId,
                data,
            });
        } else {
            addFabric.mutate(data);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow p-6"
        >
            <div className="grid md:grid-cols-2 gap-5">

                <div>
                    <label>Fabric Code</label>

                    <Input className="uppercase" {...register("fabricCode")} />

                    <p className="text-red-500 text-sm">
                        {errors.fabricCode?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">
                        Category
                    </label>

                    <select
                        {...register("category")}
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        <option value="">Select Category</option>

                        <option value="Knitted">Knitted</option>
                        <option value="Woven">Woven</option>
                        <option value="Rib">Rib</option>
                        <option value="Interlock">Interlock</option>
                        <option value="French Terry">French Terry</option>
                        <option value="Fleece">Fleece</option>
                        <option value="Lycra">Lycra</option>
                        <option value="Denim">Denim</option>
                        <option value="Others">Others</option>
                    </select>

                    {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.category.message}
                        </p>
                    )}
                </div>
                <div>
                    <label>Construction</label>

                    <Input {...register("construction")} />

                    <p className="text-red-500 text-sm">
                        {errors.construction?.message}
                    </p>
                </div>

                <div className="md:col-span-2">

                    <label className="font-semibold">
                        Composition
                    </label>

                    <div className="space-y-4 mt-3">

                        {fields.map((field, index) => (

                            <div key={field.id}>

                                <div className="flex gap-3">

                                    <div className="w-32">

                                        <Input
                                            type="number"
                                            placeholder="%"
                                            {...register(
                                                `composition.${index}.percentage`
                                            )}
                                        />

                                        <p className="text-red-500 text-xs">
                                            {
                                                errors.composition?.[index]
                                                    ?.percentage?.message
                                            }
                                        </p>

                                    </div>

                                    <div className="flex-1">

                                        <Input
                                            placeholder="Material"
                                            {...register(
                                                `composition.${index}.material`
                                            )}
                                        />

                                        <p className="text-red-500 text-xs">
                                            {
                                                errors.composition?.[index]
                                                    ?.material?.message
                                            }
                                        </p>

                                    </div>

                                    {fields.length > 1 && (

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() =>
                                                remove(index)
                                            }
                                        >
                                            Remove
                                        </Button>

                                    )}

                                </div>

                            </div>

                        ))}

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                                append({
                                    material: "",
                                    percentage: "",
                                })
                            }
                        >
                            + Add Material
                        </Button>

                    </div>

                </div>

                <div>
                    <label>GSM</label>

                    <Input
                        type="number"
                        {...register("gsm")}
                    />

                    <p className="text-red-500 text-sm">
                        {errors.gsm?.message}
                    </p>
                </div>

                <div>
                    <label>Color</label>

                    <Input {...register("color")} />

                    <p className="text-red-500 text-sm">
                        {errors.color?.message}
                    </p>
                </div>

                <div>
                    <label>Supplier</label>

                    <Input {...register("supplier")} />

                    <p className="text-red-500 text-sm">
                        {errors.supplier?.message}
                    </p>
                </div>

                <div>
                    <label>Quantity</label>

                    <Input
                        type="number"
                        {...register("quantity")}
                    />

                    <p className="text-red-500 text-sm">
                        {errors.quantity?.message}
                    </p>
                </div>
                <div>
                    <label className="block mb-2 font-medium">
                        Width
                    </label>

                    <Input
                        type="text"
                        placeholder='Enter Width (e.g. 58")'
                        {...register("width")}
                    />

                    {errors.width && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.width.message}
                        </p>
                    )}
                </div>

                <div>
                    <label>Price</label>

                    <Input
                        type="number"
                        {...register("price")}
                    />

                    <p className="text-red-500 text-sm">
                        {errors.price?.message}
                    </p>
                </div>

                <div>
                    <label>Unit</label>

                    <select
                        {...register("unit")}
                        className="border rounded-md h-10 w-full px-3"
                    >
                        <option value="Meter">
                            Meter
                        </option>

                        <option value="Kg">
                            Kg
                        </option>
                    </select>

                    <p className="text-red-500 text-sm">
                        {errors.unit?.message}
                    </p>
                </div>

                <div>
                    <label>Rack Number</label>

                    <Input
                        {...register("rackNumber")}
                    />

                    <p className="text-red-500 text-sm">
                        {errors.rackNumber?.message}
                    </p>
                </div>

                <div>
                    <label>Low Stock Limit</label>

                    <Input
                        type="number"
                        {...register("lowStockLimit")}
                    />

                    <p className="text-red-500 text-sm">
                        {errors.lowStockLimit?.message}
                    </p>
                </div>

            </div>

            <Button
                type="submit"
                className="mt-6"
                disabled={
                    addFabric.isPending ||
                    updateFabric.isPending
                }
            >
                {
                    addFabric.isPending ||
                        updateFabric.isPending
                        ? "Saving..."
                        : isEdit
                            ? "Update Fabric"
                            : "Add Fabric"
                }
            </Button>
        </form>
    );
}