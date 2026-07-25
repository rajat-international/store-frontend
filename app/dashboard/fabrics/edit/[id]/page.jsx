"use client";

import { useParams } from "next/navigation";

import useFabric from "@/hooks/useFabric";

import FabricForm from "@/components/fabric/FabricForm";

export default function EditFabricPage() {
  const { id } = useParams();

  const { data, isLoading } = useFabric(id);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!data) {
    return <h2>Fabric Not Found</h2>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Edit Fabric
      </h1>

      <FabricForm
        defaultValues={data}
        isEdit={true}
        fabricId={id}
      />

    </div>
  );
}