// app/lookup/DomainsTable.tsx

import type { DomainSummary } from './types';

type Props = {
  domains: DomainSummary[];
  onCopy: (id: string) => void;
};

export function DomainsTable({ domains, onCopy }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Slug</th>
            <th className="border px-2 py-1 text-left">Title</th>
            <th className="border px-2 py-1 text-right">Order</th>
            <th className="border px-2 py-1 text-left">Subject</th>
            <th className="border px-2 py-1 text-left">Summary</th>
            <th className="border px-2 py-1 text-left">ID</th>
            <th className="border px-2 py-1">Copy</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((d) => (
            <tr key={d.id}>
              <td className="border px-2 py-1 font-mono">{d.slug}</td>
              <td className="border px-2 py-1">{d.title}</td>
              <td className="border px-2 py-1 text-right">{d.order}</td>
              <td className="border px-2 py-1 text-xs">
                {d.subjectSlug ? `${d.subjectSlug} (${d.subjectTitle})` : '—'}
              </td>
              <td className="border px-2 py-1 text-xs">{d.summary ?? '—'}</td>
              <td className="border px-2 py-1 font-mono text-xs">{d.id}</td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => onCopy(d.id)}
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
