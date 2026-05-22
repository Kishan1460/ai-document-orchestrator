export default function SchemaTable({ extractedPairs }) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">2</span>
          Discovered Schema Entities
        </h3>
        <p className="text-xs text-slate-400">Deterministic structured data parsed successfully by model parameters.</p>
      </div>

      <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/60">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-medium">
              <th className="px-4 py-3 font-semibold">Extracted Target Parameter Key</th>
              <th className="px-4 py-3 font-semibold">Identified Structural Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {extractedPairs.map((pair, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-blue-400 font-semibold">{pair.key}</td>
                <td className="px-4 py-3 text-slate-300">{pair.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}