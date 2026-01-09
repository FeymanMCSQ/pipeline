'use client';

import { useState } from 'react';

export default function RatingChangePage() {
  const [userId, setUserId] = useState('');
  const [archetypeId, setArchetypeId] = useState('');
  const [ratingInput, setRatingInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const trimmedUserId = userId.trim();
    const trimmedArchetypeId = archetypeId.trim();
    const trimmedRating = ratingInput.trim();

    if (!trimmedUserId || !trimmedArchetypeId || !trimmedRating) {
      setStatus('❌ All fields are required');
      return;
    }

    const parsedRating = Number(trimmedRating);
    if (!Number.isFinite(parsedRating)) {
      setStatus('❌ rating must be a valid number');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user-archetype/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: trimmedUserId,
          archetypeId: trimmedArchetypeId,
          rating: parsedRating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ ${data.message ?? 'Request failed'}`);
        return;
      }

      setStatus(
        `✅ Updated rating from ${data.oldRating} to ${data.newRating} (userId=${data.userId}, archetypeId=${data.archetypeId})`
      );
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
          Pipeline v0 – User Archetype Rating Override
        </h1>
        <p className="text-sm text-gray-600">
          Enter a <code>userId</code>, an <code>archetypeId</code>, and the new{' '}
          <code>rating</code> to set for that user&apos;s archetype progress.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Enter userId"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Archetype ID</label>
            <input
              type="text"
              value={archetypeId}
              onChange={(e) => setArchetypeId(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Enter archetypeId"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">New Rating</label>
            <input
              type="number"
              value={ratingInput}
              onChange={(e) => setRatingInput(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Enter new rating (e.g. 750)"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
          >
            {loading ? 'Updating…' : 'Update Rating'}
          </button>
        </form>

        {status && <div className="mt-2 text-sm">{status}</div>}
      </div>
    </main>
  );
}
