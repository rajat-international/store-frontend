"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { uppercase, z } from "zod";
import useUpdateFabric from "@/hooks/useUpdateFabric";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { categoryname } from "@/lib/utils";
import useAddFabric from "@/hooks/useAddFabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";

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
    image: z.any().optional(),
});

export default function FabricForm({
    defaultValues,
    isEdit = false,
    fabricId,
}) {
    const addFabric = useAddFabric();
    const updateFabric = useUpdateFabric();
    const [previewImage, setPreviewImage] = useState(
        defaultValues?.image || null
    );

    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),

        defaultValues: defaultValues || {
            fabricCode: "",
            category: "",
            construction: "",
            composition: [{ material: "", percentage: "" }],
            gsm: "",
            color: "",
            supplier: "",
            quantity: "",
            price: "",
            width: "",
            unit: "Meter",
            rackNumber: "",
            lowStockLimit: "",
            image: "",
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
            return alert("Composition total must equal 100%");
        }

        const formData = new FormData();

        // saare simple fields
        formData.append("fabricCode", data.fabricCode);
        formData.append("category", data.category);
        formData.append("construction", data.construction);
        formData.append("color", data.color);
        formData.append("gsm", data.gsm);
        formData.append("width", data.width || "");
        formData.append("supplier", data.supplier);
        formData.append("quantity", data.quantity);
        formData.append("price", data.price);
        formData.append("unit", data.unit);
        formData.append("rackNumber", data.rackNumber);
        formData.append("lowStockLimit", data.lowStockLimit);


        formData.append("composition", JSON.stringify(data.composition));


        if (data.image && data.image.length > 0) {
            formData.append("image", data.image[0]);
        }

        if (isEdit) {
            updateFabric.mutate({ id: fabricId, data: formData });
        } else {
            addFabric.mutate(formData);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setValue("image", null);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Image */}
            <Section title="Fabric Image">
                <div className="flex items-start gap-5">
                    <div className="relative w-28 h-28 shrink-0 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                        {previewImage ? (
                            <>
                                <Image height={80} width={100}
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1 shadow"
                                >
                                    <Trash2 size={14} className="text-red-500" />
                                </button>
                            </>
                        ) : (
                            <ImagePlus className="text-gray-400" size={28} />
                        )}
                    </div>

                    <div className="flex-1">
                        <label
                            htmlFor="fabric-image"
                            className="inline-block cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm font-medium px-4 py-2 rounded-lg"
                        >
                            Choose Image
                        </label>

                        <input
                            id="fabric-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image", {
                                onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const maxSize = 1 * 1024 * 1024; // 1MB

                                        if (file.size > maxSize) {
                                            setError("image", {
                                                type: "manual",
                                                message: "Image size must be less than 1MB",
                                            });
                                            setValue("image", null);
                                            e.target.value = "";
                                            return;
                                        }

                                        setPreviewImage(URL.createObjectURL(file));
                                    }
                                },
                            })}
                        />

                        <p className="text-xs text-gray-400 mt-2">
                            PNG or JPG, up to 5MB
                        </p>

                        <p className="text-red-500 text-sm mt-1">
                            {errors.image?.message}
                        </p>
                    </div>
                </div>
            </Section>

            {/* Basic Information */}
            <Section title="Basic Information">
                <div className="grid md:grid-cols-3 gap-5">
                    <Field label="Fabric Code" error={errors.fabricCode?.message}>
                        <Input className="uppercase" {...register("fabricCode")} />
                    </Field>

                    <Field label="Category" error={errors.category?.message}>
                        <select
                            {...register("category")}
                            className="w-full border rounded-lg px-3 py-2 h-10"
                        >
                            <option value="">Select Category</option>
                            {categoryname.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Construction" error={errors.construction?.message}>
                        <Input {...register("construction")} />
                    </Field>

                    <Field label="Color" error={errors.color?.message}>
                        <Input className="uppercase" {...register("color")} />
                    </Field>

                    <Field label="GSM" error={errors.gsm?.message}>
                        <Input type="number" {...register("gsm")} />
                    </Field>

                    <Field label="Width" error={errors.width?.message}>
                        <Input
                            type="text"
                            placeholder='e.g. 58"'
                            {...register("width")}
                        />
                    </Field>
                </div>
            </Section>

            {/* Composition */}
            <Section title="Composition">
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-start">
                            <div className="w-28">
                                <Input
                                    type="number"
                                    placeholder="%"
                                    {...register(`composition.${index}.percentage`)}
                                />
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.composition?.[index]?.percentage?.message}
                                </p>
                            </div>

                            <div className="flex-1">
                                <Input
                                    placeholder="Material"
                                    {...register(`composition.${index}.material`)}
                                />
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.composition?.[index]?.material?.message}
                                </p>
                            </div>

                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => append({ material: "", percentage: "" })}
                    >
                        + Add Material
                    </Button>
                </div>
            </Section>

            {/* Stock & Pricing */}
            <Section title="Stock & Pricing">
                <div className="grid md:grid-cols-3 gap-5">
                    <Field label="Supplier" error={errors.supplier?.message}>
                        <Input {...register("supplier")} />
                    </Field>

                    <Field label="Quantity" error={errors.quantity?.message}>
                        <Input type="number" {...register("quantity")} />
                    </Field>

                    <Field label="Price" error={errors.price?.message}>
                        <Input type="number" {...register("price")} />
                    </Field>

                    <Field label="Unit" error={errors.unit?.message}>
                        <select
                            {...register("unit")}
                            className="border rounded-lg h-10 w-full px-3"
                        >
                            <option value="Meter">Meter</option>
                            <option value="Kg">Kg</option>
                        </select>
                    </Field>

                    <Field label="Rack Number" error={errors.rackNumber?.message}>
                        <Input className="uppercase" {...register("rackNumber")} />
                    </Field>

                    <Field
                        label="Low Stock Limit"
                        error={errors.lowStockLimit?.message}
                    >
                        <Input type="number" {...register("lowStockLimit")} />
                    </Field>
                </div>
            </Section>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={addFabric.isPending || updateFabric.isPending}
                    className="px-8"
                >
                    {addFabric.isPending || updateFabric.isPending
                        ? "Saving..."
                        : isEdit
                            ? "Update Fabric"
                            : "Add Fabric"}
                </Button>
            </div>
        </form>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-5">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
                {label}
            </label>
            {children}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}