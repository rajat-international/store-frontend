export default function RecentIssues({ issues }) {
    return (
        <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">
            <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">
                    Recent Issues
                </h2>
            </div>

            <table className="w-full">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Fabric</th>
                        <th className="text-left p-4">Construction</th>
                        <th className="text-left p-4">Color</th>
                        <th className="text-left p-4">Merchant</th>
                        <th className="text-left p-4">Qty</th>
                    </tr>
                </thead>

                <tbody>
                    {issues.map((item) => (
                        <tr key={item._id} className="border-t">
                           <td className="p-4">
  {new Date(item.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>
                            <td className="p-4">{item.fabricCode}</td>
                            <td className="p-4">{item.construction}</td>
                            <td className="p-4">{item.color}</td>
                            <td className="p-4">{item.issuedTo}</td>
                            <td className="p-4">{item.issuedQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}