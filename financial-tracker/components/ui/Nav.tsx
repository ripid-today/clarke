'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Settings } from 'lucide-react';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/auth');

  if (isAuthPage) return null;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <nav className="bg-white border-b border-claude-secondary/20 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-end h-14 gap-3">
        <Link
          href="/settings"
          aria-label="Settings"
          className="text-claude-secondary hover:text-claude-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary rounded p-1"
        >
          <Settings className="w-5 h-5" />
        </Link>
        <button
          onClick={handleSignOut}
          className="text-[15px] text-claude-secondary hover:text-black transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary rounded px-2 py-1"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
