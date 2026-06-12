// src/app/layout.tsx
import './globals.css';
import Providers from '../components/Providers';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'PooKanakuApp — Flower Ledger Pro',
  description: 'Premium SaaS for flower shop management. Track deliveries, billing, payments and reports.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
