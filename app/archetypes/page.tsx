// app/archetypes/page.tsx
'use client';

import { useState } from 'react';

export default function ArchetypesPage() {
  const [domainId, setDomainId] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch('/api/import-archetypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainId,
          rawJson: jsonInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ ${data.message ?? 'Request failed'}`);
      } else {
        const { upsertedCount, domainSlug } = data;
        setStatus(
          `✅ Upserted ${upsertedCount} archetypes (domain: ${domainSlug})`
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
        <h1 className="text-2xl font-semibold">
          Pipeline v0 – Archetype Import
        </h1>

        <p className="text-sm text-gray-600">
          Enter a <code>domainId</code>, then paste a JSON array of archetypes
          or an object with <code>archetypes</code>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Domain ID</label>
            <input
              type="text"
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="domain cuid here"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Archetypes JSON</label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm font-mono"
              rows={16}
              placeholder={`[
  {
    "slug": "vc-curves-motion",
    "title": "Curves, Tangents & Motion in Space",
    "stream": "VC",
    "order": 1,
    "summary": "Parametric curves, tangent vectors, velocity, acceleration.",
    "eloMin": 200,
    "eloMax": 1900
  }
]`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
          >
            {loading ? 'Importing…' : 'Validate & Upsert'}
          </button>
        </form>

        {status && <div className="mt-2 text-sm">{status}</div>}
      </div>
    </main>
  );
}
