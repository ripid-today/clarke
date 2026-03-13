'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/expenses', label: 'Expenses' },
  { href: '/funds', label: 'Funds' },
];

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
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-claude-primary font-bold text-lg mr-4 shrink-0">ripid.vn</span>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-[15px] font-medium transition-colors duration-150 whitespace-nowrap',
                pathname.startsWith(href)
                  ? 'bg-cloud-dancer text-claude-primary'
                  : 'text-claude-secondary hover:text-black hover:bg-black/5'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <button
          onClick={handleSignOut}
          className="text-[15px] text-claude-secondary hover:text-black transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary rounded px-2 py-1 shrink-0 ml-2"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
