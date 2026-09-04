'use server';

import { cookies } from 'next/headers';

function setAuthCookies(cookieStore: Awaited<ReturnType<typeof cookies>>, accessToken: string, refreshToken: string) {
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  cookieStore.set('sb-access-token', accessToken, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    secure: true,
  });

  cookieStore.set('supabase-auth-token', accessToken, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    secure: true,
  });

  cookieStore.set('sb-refresh-token', refreshToken, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    secure: true,
  });
}

export async function setSessionCookies(accessToken: string, refreshToken: string): Promise<{ error?: string }> {
  if (!accessToken || !refreshToken) {
    return { error: 'Missing session tokens' };
  }

  const cookieStore = await cookies();
  setAuthCookies(cookieStore, accessToken, refreshToken);
  return {};
}

export async function syncSessionCookies(accessToken: string, refreshToken: string): Promise<void> {
  if (!accessToken || !refreshToken) return;
  const cookieStore = await cookies();
  setAuthCookies(cookieStore, accessToken, refreshToken);
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('sb-access-token');
  cookieStore.delete('supabase-auth-token');
  cookieStore.delete('sb-refresh-token');
}
