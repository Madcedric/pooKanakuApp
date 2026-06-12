// src/app/login/layout.tsx
// Auth pages get a minimal layout — no sidebar
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
