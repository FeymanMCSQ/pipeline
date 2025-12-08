// app/lookup/LookupPage.tsx
'use client';

import { useState } from 'react';
import {
  type EntityType,
  type SubjectSummary,
  type DomainSummary,
  type ArchetypeSummary,
  type SubjectsResponse,
  type DomainsResponse,
  type ArchetypesResponse,
} from './types';
import { SubjectsTable } from './SubjectsTable';
import { DomainsTable } from './DomainsTable';
import { ArchetypesTable } from './ArchetypesTable';

export function LookupPage() {
  const [entity, setEntity] = useState<EntityType>('archetypes');
  const [query, setQuery] = useState('');
  const [stream, setStream] = useState<string>('');
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [domains, setDomains] = useState<DomainSummary[]>([]);
  const [archetypes, setArchetypes] = useState<ArchetypeSummary[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    setSubjects([]);
    setDomains([]);
    setArchetypes([]);

    try {
      const params = new URLSearchParams();
      if (query.trim().length > 0) {
        params.set('q', query.trim());
      }
      if (entity === 'archetypes' && stream) {
        params.set('stream', stream);
      }

      const res = await fetch(`/api/lookup/${entity}?${params.toString()}`, {
        method: 'GET',
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(
          `❌ ${data && data.message ? data.message : 'Request failed'}`
        );
        return;
      }

      if (entity === 'subjects') {
        const payload = (data as SubjectsResponse).subjects;
        setSubjects(payload);
        setStatus(`✅ Found ${payload.length} subjects`);
      } else if (entity === 'domains') {
        const payload = (data as DomainsResponse).domains;
        setDomains(payload);
        setStatus(`✅ Found ${payload.length} domains`);
      } else {
        const payload = (data as ArchetypesResponse).archetypes;
        setArchetypes(payload);
        setStatus(`✅ Found ${payload.length} archetypes`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setStatus(`❌ Error: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(id: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(id);
        setStatus(`📋 Copied ID: ${id}`);
      } catch {
        setStatus('❌ Failed to copy to clipboard');
      }
    } else {
      setStatus('❌ Clipboard API not available');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-5xl space-y-4">
        <h1 className="text-2xl font-semibold">
          Lookup – Subjects, Domains, Archetypes
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-3 items-end"
        >
          <div className="flex flex-col min-w-[160px]">
            <label className="text-sm font-medium">Entity</label>
            <select
              value={entity}
              onChange={(e) => setEntity(e.target.value as EntityType)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="subjects">Subjects</option>
              <option value="domains">Domains</option>
              <option value="archetypes">Archetypes</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium">Search query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="slug or title fragment"
            />
          </div>

          {entity === 'archetypes' && (
            <div className="flex flex-col">
              <label className="text-sm font-medium">Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">Any</option>
                <option value="VC">VC</option>
                <option value="CA">CA</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {status && <div className="text-sm">{status}</div>}

        <div className="mt-4">
          {entity === 'subjects' && subjects.length > 0 && (
            <SubjectsTable subjects={subjects} onCopy={handleCopy} />
          )}

          {entity === 'domains' && domains.length > 0 && (
            <DomainsTable domains={domains} onCopy={handleCopy} />
          )}

          {entity === 'archetypes' && archetypes.length > 0 && (
            <ArchetypesTable archetypes={archetypes} onCopy={handleCopy} />
          )}
        </div>
      </div>
    </main>
  );
}
