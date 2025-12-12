// app/generate/page.tsx
import GenerateClient from './GenerateClient';

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Generate & Insert</h1>
      <p className="mt-2 text-sm opacity-80">
        Operator tool: pick an archetype, band, and count. Pipeline will
        generate, validate, and seed.
      </p>

      <div className="mt-6">
        <GenerateClient />
      </div>
    </main>
  );
}
