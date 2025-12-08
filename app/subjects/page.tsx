// app/subjects/page.tsx
'use client';

import { useState } from 'react';

export default function SubjectsPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch('/api/import-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawJson: jsonInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ ${data.message ?? 'Request failed'}`);
      } else {
        const { subjectsInserted, subjectsUpdated } = data;
        setStatus(
          `✅ Subjects inserted: ${subjectsInserted}, updated: ${subjectsUpdated}`
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
        <h1 className="text-2xl font-semibold">Pipeline v0 – Subject Import</h1>
        <p className="text-sm text-gray-600">
          Paste a JSON array of subjects, or an object with{' '}
          <code>subjects</code>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Subjects JSON</label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm font-mono"
              rows={14}
              placeholder={`[
  {
    "slug": "math",
    "title": "Mathematics",
    "order": 1,
    "summary": "The universal language of patterns, quantities, and change."
  }
]`}
              required
            />
            <p className="text-xs text-gray-500">
              You can paste either:
              <br />• a JSON array of subjects, or
              <br />• an object: &#123; &quot;subjects&quot;: [ ... ] &#125;
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
