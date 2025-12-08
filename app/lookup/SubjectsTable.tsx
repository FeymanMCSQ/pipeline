// app/lookup/SubjectsTable.tsx

import type { SubjectSummary } from './types';

type Props = {
  subjects: SubjectSummary[];
  onCopy: (id: string) => void;
};

export function SubjectsTable({ subjects, onCopy }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Slug</th>
            <th className="border px-2 py-1 text-left">Title</th>
            <th className="border px-2 py-1 text-right">Order</th>
            <th className="border px-2 py-1 text-left">Summary</th>
            <th className="border px-2 py-1 text-left">ID</th>
            <th className="border px-2 py-1">Copy</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s.id}>
              <td className="border px-2 py-1 font-mono">{s.slug}</td>
              <td className="border px-2 py-1">{s.title}</td>
              <td className="border px-2 py-1 text-right">{s.order}</td>
              <td className="border px-2 py-1 text-xs">{s.summary ?? '—'}</td>
              <td className="border px-2 py-1 font-mono text-xs">{s.id}</td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => onCopy(s.id)}
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
