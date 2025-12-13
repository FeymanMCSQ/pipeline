// 'use client';

// import { useMemo, useState } from 'react';

// type ApiOk = {
//   ok: true;
//   meta: {
//     received: {
//       archetypeId: string;
//       band: string;
//       count: number;
//       type: string;
//     };
//     validated: number;
//     inserted: number;
//   };
//   problems: Array<{
//     promptLatex: string;
//     // keep this loose; you can tighten after you finalize schema fields
//     [key: string]: unknown;
//   }>;
// };

// type ApiErr = {
//   ok: false;
//   stage: 'validation' | 'route' | string;
//   error: string;
// };

// type ApiResp = ApiOk | ApiErr;

// const BAND_PRESETS = [
//   '200_300',
//   '300_400',
//   '400_500',
//   '500_600',
//   '600_700',
//   '700_800',
//   '800_900',
// ];

// export default function GenerateClient() {
//   const [archetypeId, setArchetypeId] = useState('');
//   const [band, setBand] = useState(BAND_PRESETS[0]);
//   const [count, setCount] = useState<number>(10);

//   const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
//   const [resp, setResp] = useState<ApiResp | null>(null);

//   const canSubmit = useMemo(() => {
//     return (
//       archetypeId.trim().length > 0 &&
//       band.trim().length > 0 &&
//       count >= 1 &&
//       count <= 50
//     );
//   }, [archetypeId, band, count]);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!canSubmit || status === 'submitting') return;

//     setStatus('submitting');
//     setResp(null);

//     try {
//       const res = await fetch('/api/generate-problems', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ archetypeId, band, count }),
//       });

//       const data = (await res.json()) as ApiResp;
//       setResp(data);
//     } catch (err) {
//       setResp({
//         ok: false,
//         stage: 'network',
//         error: err instanceof Error ? err.message : 'Network error',
//       });
//     } finally {
//       setStatus('idle');
//     }
//   }

//   return (
//     <div className="rounded-xl border border-white/10 p-4">
//       <form onSubmit={onSubmit} className="space-y-4">
//         <div className="grid gap-3 sm:grid-cols-2">
//           <label className="block">
//             <div className="text-sm opacity-80">Archetype ID</div>
//             <input
//               className="mt-1 w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30"
//               value={archetypeId}
//               onChange={(e) => setArchetypeId(e.target.value)}
//               placeholder="cmabc123..."
//             />
//           </label>

//           <label className="block">
//             <div className="text-sm opacity-80">Band</div>
//             <select
//               className="mt-1 w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30"
//               value={band}
//               onChange={(e) => setBand(e.target.value)}
//             >
//               {BAND_PRESETS.map((b) => (
//                 <option key={b} value={b}>
//                   {b}
//                 </option>
//               ))}
//             </select>
//             <div className="mt-1 text-xs opacity-60">
//               (You can switch this to free-text later if you want arbitrary
//               bands.)
//             </div>
//           </label>
//         </div>

//         <label className="block">
//           <div className="text-sm opacity-80">Count (1–50)</div>
//           <input
//             type="number"
//             min={1}
//             max={50}
//             className="mt-1 w-40 rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30"
//             value={count}
//             onChange={(e) => setCount(Number(e.target.value))}
//           />
//         </label>

//         <button
//           type="submit"
//           disabled={!canSubmit || status === 'submitting'}
//           className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-50"
//         >
//           {status === 'submitting' ? 'Generating…' : 'Generate & Insert'}
//         </button>
//       </form>

//       {/* Response */}
//       <div className="mt-6 space-y-3">
//         {resp?.ok === false && (
//           <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
//             <div className="text-sm font-medium">Error ({resp.stage})</div>
//             <div className="mt-1 text-sm opacity-90">{resp.error}</div>
//           </div>
//         )}

//         {resp?.ok === true && (
//           <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
//             <div className="text-sm font-medium">Success</div>
//             <div className="mt-1 text-sm opacity-90">
//               Validated: {resp.meta.validated} · Inserted: {resp.meta.inserted}
//             </div>
//             <div className="mt-2 text-xs opacity-70">
//               Received: {resp.meta.received.archetypeId} ·{' '}
//               {resp.meta.received.band} · {resp.meta.received.count} ·{' '}
//               {resp.meta.received.type}
//             </div>
//           </div>
//         )}

//         {resp?.ok === true && resp.problems?.length > 0 && (
//           <div className="rounded-lg border border-white/10 p-3">
//             <div className="text-sm font-medium">Preview (first 3 prompts)</div>
//             <ul className="mt-2 space-y-2 text-sm opacity-90">
//               {resp.problems.slice(0, 3).map((p, i) => (
//                 <li key={i} className="rounded-md border border-white/10 p-2">
//                   <div className="text-xs opacity-70">promptLatex</div>
//                   <div className="mt-1 break-words">{p.promptLatex}</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useMemo, useState } from 'react';

type ValidationIssue = {
  path: string;
  message: string;
  code?: string;
};

type ApiOk = {
  ok: true;
  meta: {
    received: {
      archetypeId: string;
      band: string;
      count: number;
      type: string;
    };
    validated: number;
    inserted: number;
  };
  problems: Array<{
    promptLatex: string;
    [key: string]: unknown;
  }>;
};

type ApiErr = {
  ok: false;
  stage: 'validation' | 'route' | 'context' | 'network' | string;
  error: string;
  issues?: ValidationIssue[];
};

type ApiResp = ApiOk | ApiErr;

const BAND_PRESETS = [
  '200_300',
  '300_400',
  '400_500',
  '500_600',
  '600_700',
  '700_800',
  '800_900',
];

type UiStage =
  | 'idle'
  | 'generating'
  | 'validating'
  | 'inserting'
  | 'done'
  | 'error';

export default function GenerateClient() {
  const [archetypeId, setArchetypeId] = useState('');
  const [band, setBand] = useState(BAND_PRESETS[0]);
  const [count, setCount] = useState<number>(10);

  const [uiStage, setUiStage] = useState<UiStage>('idle');
  const [statusText, setStatusText] = useState<string>('');
  const [resp, setResp] = useState<ApiResp | null>(null);

  const canSubmit = useMemo(() => {
    return (
      archetypeId.trim().length > 0 &&
      band.trim().length > 0 &&
      count >= 1 &&
      count <= 50
    );
  }, [archetypeId, band, count]);

  const isBusy =
    uiStage === 'generating' ||
    uiStage === 'validating' ||
    uiStage === 'inserting';

  function setStage(stage: UiStage, text: string) {
    setUiStage(stage);
    setStatusText(text);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isBusy) return;

    setResp(null);
    setStage('generating', 'Generating…');

    try {
      const res = await fetch('/api/generate-problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archetypeId, band, count }),
      });

      setStage('validating', 'Validating…');

      const data = (await res.json()) as ApiResp;

      if (data.ok === false) {
        setStage(
          'error',
          data.stage === 'validation' ? 'Validation failed.' : 'Request failed.'
        );
        setResp(data);
        return;
      }

      setStage('inserting', 'Inserting…');
      setResp(data);

      setStage('done', 'Done.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setStage('error', 'Network error.');
      setResp({ ok: false, stage: 'network', error: msg });
    }
  }

  return (
    <div className="rounded-xl border border-white/10 p-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm opacity-80">Archetype ID</div>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30"
              value={archetypeId}
              onChange={(e) => setArchetypeId(e.target.value)}
              placeholder="cmabc123..."
            />
          </label>

          <label className="block">
            <div className="text-sm opacity-80">Band</div>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30"
              value={band}
              onChange={(e) => setBand(e.target.value)}
            >
              {BAND_PRESETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <div className="mt-1 text-xs opacity-60">
              (Switch to free-text later if you want arbitrary bands.)
            </div>
          </label>
        </div>

        <label className="block">
          <div className="text-sm opacity-80">Count (1–50)</div>
          <input
            type="number"
            min={1}
            max={50}
            className="mt-1 w-40 rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit || isBusy}
          className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-50"
        >
          {isBusy ? 'Working…' : 'Generate & Insert'}
        </button>
      </form>

      {/* Status */}
      {uiStage !== 'idle' && (
        <div className="mt-4 rounded-lg border border-white/10 p-3 text-sm">
          <span className="opacity-70">Status:</span> {statusText}
        </div>
      )}

      {/* Response */}
      <div className="mt-6 space-y-3">
        {resp?.ok === false && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <div className="text-sm font-medium">Error ({resp.stage})</div>
            <div className="mt-1 text-sm opacity-90">{resp.error}</div>

            {resp.stage === 'validation' && resp.issues?.length ? (
              <div className="mt-3">
                <div className="text-xs opacity-70">Validation issues</div>
                <ul className="mt-2 space-y-2 text-sm">
                  {resp.issues.slice(0, 12).map((iss, idx) => (
                    <li
                      key={idx}
                      className="rounded-md border border-white/10 p-2"
                    >
                      <div className="text-xs opacity-70">
                        {iss.path || '(root)'}
                      </div>
                      <div className="mt-1">{iss.message}</div>
                      {iss.code ? (
                        <div className="mt-1 text-xs opacity-60">
                          code: {iss.code}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {resp.issues.length > 12 && (
                  <div className="mt-2 text-xs opacity-60">
                    Showing first 12 of {resp.issues.length}.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {resp?.ok === true && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <div className="text-sm font-medium">Success</div>
            <div className="mt-1 text-sm opacity-90">
              Validated: {resp.meta.validated} · Inserted: {resp.meta.inserted}
              {resp.meta.inserted < resp.meta.validated ? (
                <span className="ml-2 text-xs opacity-70">
                  (Some skipped as duplicates)
                </span>
              ) : null}
            </div>
            <div className="mt-2 text-xs opacity-70">
              Received: {resp.meta.received.archetypeId} ·{' '}
              {resp.meta.received.band} · {resp.meta.received.count} ·{' '}
              {resp.meta.received.type}
            </div>
          </div>
        )}

        {resp?.ok === true && resp.problems?.length > 0 && (
          <div className="rounded-lg border border-white/10 p-3">
            <div className="text-sm font-medium">Preview (first 3 prompts)</div>
            <ul className="mt-2 space-y-2 text-sm opacity-90">
              {resp.problems.slice(0, 3).map((p, i) => (
                <li key={i} className="rounded-md border border-white/10 p-2">
                  <div className="text-xs opacity-70">promptLatex</div>
                  <div className="mt-1 break-words">{p.promptLatex}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
