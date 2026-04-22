const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

export default SkeletonRow;
