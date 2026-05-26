import type { HealthStatus } from "@muqsit/shared-types";

const status: HealthStatus = {
  status: "ok",
  service: "muqsit-web",
  timestamp: new Date().toISOString(),
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Muqsit</h1>
      <p className="text-gray-600">Sprint 1 — monorepo skeleton</p>
      <code className="rounded bg-gray-100 px-3 py-1 text-sm">
        {status.service}: {status.status}
      </code>
    </main>
  );
}
