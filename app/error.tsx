"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-danger/40 bg-danger/10 p-6 shadow-card">
      <h2 className="text-xl font-semibold text-danger">Something went wrong</h2>
      <p className="mt-2 text-sm text-textSecondary">
        {error.message || "An unexpected error occurred while rendering this page."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-4 py-2 text-sm font-semibold text-textPrimary"
      >
        Try again
      </button>
    </div>
  );
}

