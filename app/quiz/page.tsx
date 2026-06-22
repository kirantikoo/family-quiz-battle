import { Suspense } from "react";
import QuizClient from "./QuizClient";

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizFallback />}>
      <QuizClient />
    </Suspense>
  );
}

function QuizFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] text-white">
      Loading quiz...
    </main>
  );
}
