'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isExtensionError = error?.message?.includes('MetaMask') ||
    error?.message?.includes('chrome-extension') ||
    error?.stack?.includes('chrome-extension://');

  if (isExtensionError) {
    reset();
    return null;
  }

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#FAFAFA', padding: '1rem', fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{
            maxWidth: '420px', width: '100%', backgroundColor: '#fff',
            borderRadius: '16px', border: '1px solid #E5E7EB',
            padding: '2.5rem 2rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌺</div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#1F2937' }}>
              Something went wrong
            </h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.5rem', backgroundColor: '#2E7D32', color: '#fff',
                border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
