import { createAuthClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (params.error) {
    redirect('/login?error=' + encodeURIComponent(params.error));
  }

  if (params.code) {
    const supabase = await createAuthClient();
    await supabase.auth.exchangeCodeForSession(params.code);
  }

  redirect('/dashboard');
}
