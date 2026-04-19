"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-primaryBg p-6 font-body text-textPrimary">
        <div className="mx-auto max-w-xl rounded-xl border border-danger/40 bg-danger/10 p-6 shadow-card">
          <h2 className="text-xl font-semibold text-danger">Application error</h2>
          <p className="mt-2 text-sm text-textSecondary">
            {error.message || "A fatal rendering error occurred."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-4 py-2 text-sm font-semibold text-textPrimary"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

