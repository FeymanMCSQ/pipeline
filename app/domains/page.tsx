// app/domains/page.tsx
'use client';

import { useState } from 'react';

export default function DomainsPage() {
  const [subjectId, setSubjectId] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch('/api/import-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, rawJson: jsonInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ ${data.message ?? 'Request failed'}`);
      } else {
        const { domainsUpserted, subjectSlug } = data;
        setStatus(
          `✅ Domains upserted: ${domainsUpserted} (subject: ${
            subjectSlug ?? 'unknown'
          })`
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setStatus(`❌ Error: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold">Pipeline v0 – Domain Import</h1>
        <p className="text-sm text-gray-600">
          Enter a <code>subjectId</code>, then paste a JSON array of domains, or
          an object with <code>domains</code>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Subject ID</label>
            <input
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="subject cuid here"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Domains JSON</label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm font-mono"
              rows={14}
              placeholder={`[
  {
    "slug": "vector-calculus",
    "title": "Vector Calculus",
    "order": 1,
    "summary": "Differentiation and integration of vector fields in 2D & 3D."
  },
  {
    "slug": "complex-analysis",
    "title": "Complex Analysis",
    "order": 2,
    "summary": "Functions of complex variables and their geometric elegance."
  }
]`}
              required
            />
            <p className="text-xs text-gray-500">
              You can paste either:
              <br />• a JSON array of domains, or
              <br />• an object: &#123; &quot;domains&quot;: [ ... ] &#125;
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
          >
            {loading ? 'Importing…' : 'Validate &amp; Upsert'}
          </button>
        </form>

        {status && <div className="mt-2 text-sm">{status}</div>}
      </div>
    </main>
  );
}
