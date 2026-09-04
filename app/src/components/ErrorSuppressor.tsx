'use client';

import { useEffect } from 'react';

const EXTENSION_ERROR_PATTERNS = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'Failed to connect to MetaMask',
  'MetaMask',
];

function shouldSuppressError(message: string, source?: string): boolean {
  if (source && EXTENSION_ERROR_PATTERNS.some(p => source.includes(p))) return true;
  if (EXTENSION_ERROR_PATTERNS.some(p => message.includes(p))) return true;
  return false;
}

export default function ErrorSuppressor() {
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (shouldSuppressError(event.message, event.filename)) {
        event.preventDefault();
        return false;
      }
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = reason?.message || String(reason);
      const src = reason?.stack || '';
      if (shouldSuppressError(msg, src)) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler, true);

    return () => {
      window.removeEventListener('error', errorHandler, true);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler, true);
    };
  }, []);

  return null;
}
