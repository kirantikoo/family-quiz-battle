import { Suspense } from "react";
import ResultClient from "./ResultClient";

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultFallback />}>
      <ResultClient />
    </Suspense>
  );
}

function ResultFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07001f] text-white">
      Loading result...
    </main>
  );
}
