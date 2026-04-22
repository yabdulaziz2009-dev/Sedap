// src/components/orders/SkeletonTable.jsx

function SkeletonRow() {
  return (
    <tr>
      {/* 6 колонок — каждая серый блок */}
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full rounded"></div>
        </td>
      ))}
    </tr>
  );
}

export default function SkeletonTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full">

        {/* Шапка тоже скелетон */}
        <thead>
          <tr className="bg-emerald-500">
            {Array.from({ length: 6 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="skeleton h-4 w-24 rounded opacity-40"></div>
              </th>
            ))}
          </tr>
        </thead>

        {/* 6 строк-заглушек */}
        <tbody className="bg-white divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>

      </table>
    </div>
  );
}