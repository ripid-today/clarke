import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Single endpoint to load all earnings + expenses for the Income Statement Table.
// GET /api/entries?startMonth=YYYY-MM&endMonth=YYYY-MM
export async function GET(request: Request) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const startMonth = searchParams.get('startMonth');
  const endMonth = searchParams.get('endMonth');

  if (!startMonth || !/^\d{4}-\d{2}$/.test(startMonth)) {
    return NextResponse.json({ error: 'Invalid startMonth format. Use YYYY-MM' }, { status: 400 });
  }
  if (!endMonth || !/^\d{4}-\d{2}$/.test(endMonth)) {
    return NextResponse.json({ error: 'Invalid endMonth format. Use YYYY-MM' }, { status: 400 });
  }

  const admin = createAdminClient();

  const [earningsResult, expensesResult] = await Promise.all([
    admin
      .from('earnings')
      .select('*')
      .eq('user_id', user.id)
      .gte('month', startMonth)
      .lte('month', endMonth)
      .order('month', { ascending: true })
      .order('created_at', { ascending: true }),
    admin
      .from('expenses')
      .select('*')
      .eq('sender_type', 'user')
      .eq('sender_id', user.id)
      .gte('month', startMonth)
      .lte('month', endMonth)
      .order('month', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);

  if (earningsResult.error) {
    console.error('GET /api/entries earnings error:', {
      context: 'Fetching earnings range for income statement',
      startMonth,
      endMonth,
      error: earningsResult.error.message,
    });
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }

  if (expensesResult.error) {
    console.error('GET /api/entries expenses error:', {
      context: 'Fetching expenses range for income statement',
      startMonth,
      endMonth,
      error: expensesResult.error.message,
    });
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }

  return NextResponse.json({
    earnings: earningsResult.data ?? [],
    expenses: expensesResult.data ?? [],
  });
}
