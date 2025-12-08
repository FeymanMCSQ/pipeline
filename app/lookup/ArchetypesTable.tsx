// app/lookup/ArchetypesTable.tsx

import type { ArchetypeSummary } from './types';

type Props = {
  archetypes: ArchetypeSummary[];
  onCopy: (id: string) => void;
};

export function ArchetypesTable({ archetypes, onCopy }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Slug</th>
            <th className="border px-2 py-1 text-left">Title</th>
            <th className="border px-2 py-1 text-left">Stream</th>
            <th className="border px-2 py-1 text-left">Domain</th>
            <th className="border px-2 py-1 text-right">Order</th>
            <th className="border px-2 py-1 text-left">ID</th>
            <th className="border px-2 py-1">Copy</th>
          </tr>
        </thead>
        <tbody>
          {archetypes.map((a) => (
            <tr key={a.id}>
              <td className="border px-2 py-1 font-mono">{a.slug}</td>
              <td className="border px-2 py-1">{a.title}</td>
              <td className="border px-2 py-1">{a.stream ?? '—'}</td>
              <td className="border px-2 py-1 text-xs">
                {a.domainSlug ? `${a.domainSlug} (${a.domainTitle})` : '—'}
              </td>
              <td className="border px-2 py-1 text-right">{a.order}</td>
              <td className="border px-2 py-1 font-mono text-xs">{a.id}</td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => onCopy(a.id)}
                  className="px-2 py-1 text-xs border rounded"
                >
                  Copy ID
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
