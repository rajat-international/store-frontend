"use client";

import { useParams } from "next/navigation";

import Link from "next/link";

import useFabric from "@/hooks/useFabric";

export default function FabricDetailsPage() {
  const { id } = useParams();

  const { data: fabric, isLoading } = useFabric(id);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!fabric) {
    return <h2>Fabric Not Found</h2>;
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Fabric Details
        </h1>

        <div className="flex gap-3">

          <Link
            href={`/dashboard/fabrics/edit/${fabric._id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
          >
            Edit
          </Link>

          <Link
            href={`/dashboard/issues/add?fabric=${fabric._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Issue Fabric
          </Link>

        </div>

      </div>

      {/* Image */}

      <div className="bg-white rounded-xl shadow p-6">

        {fabric.image ? (
          <img
            src={fabric.image}
            alt={fabric.fabricCode}
            className="w-full max-w-xs h-56 object-cover rounded-lg border mx-auto"
          />
        ) : (
          <div className="w-full max-w-xs h-56 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg border mx-auto">
            No Image
          </div>
        )}

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Fabric Information */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Fabric Information
          </h2>

          <Info title="Fabric Code" value={fabric.fabricCode} />
          <Info title="Category" value={fabric.category} />
          <Info title="Construction" value={fabric.construction} />
          <Info title="Width" value={fabric.width} />
          <Info title="GSM" value={fabric.gsm} />
          <Info title="Color" value={fabric.color} />
          <Info title="Supplier" value={fabric.supplier} />
          <Info title="Rack Number" value={fabric.rackNumber} />
          <Info title="Price" value={`₹ ${fabric.price}`} />

        </div>

        {/* Stock */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">

            Stock Information

          </h2>

          <Info
            title="Current Stock"
            value={`${fabric.quantity} ${fabric.unit}`}
          />

          <Info
            title="Low Stock Limit"
            value={`${fabric.lowStockLimit} ${fabric.unit}`}
          />

          <div className="mt-6">

            {fabric.quantity <= fabric.lowStockLimit ? (

              <span className="bg-red-500 text-white px-4 py-2 rounded-lg">

                Low Stock

              </span>

            ) : (

              <span className="bg-green-600 text-white px-4 py-2 rounded-lg">

                In Stock

              </span>

            )}

          </div>

        </div>

      </div>

      {/* Composition */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">

          Composition

        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {fabric.composition.map((item, index) => (

            <div
              key={index}
              className="border rounded-lg p-4"
            >

              <h3 className="font-semibold">

                {item.material}

              </h3>

              <p className="text-gray-500">

                {item.percentage} %

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="flex justify-between border-b py-3">

      <span className="font-medium text-gray-500">

        {title}

      </span>

      <span className="font-semibold">

        {value}

      </span>

    </div>
  );
}