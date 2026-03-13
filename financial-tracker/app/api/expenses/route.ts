import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const fundId = searchParams.get('fund_id');

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }

  const admin = createAdminClient();

  if (fundId) {
    // Return all members' expenses for this fund+month (group view)
    // First verify user is a member
    const { data: membership } = await admin
      .from('fund_members')
      .select('user_id')
      .eq('fund_id', fundId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this fund' }, { status: 403 });
    }

    const { data, error } = await admin
      .from('expenses')
      .select('*')
      .eq('fund_id', fundId)
      .eq('month', month)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('GET /api/expenses (fund) error:', {
        context: 'Fetching fund expenses',
        fundId,
        month,
        error: error.message,
      });
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
    return NextResponse.json({ expenses: data });
  }

  // Personal expenses only
  const { data, error } = await admin
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('month', month)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('GET /api/expenses error:', {
      context: 'Fetching personal expenses',
      month,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
  return NextResponse.json({ expenses: data });
}

export async function POST(request: Request) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { month, amount_vnd, status, description, fund_id } = body as Record<string, unknown>;

  if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }
  if (!amount_vnd || typeof amount_vnd !== 'number' || !Number.isInteger(amount_vnd) || amount_vnd <= 0) {
    return NextResponse.json({ error: 'amount_vnd must be a positive integer' }, { status: 400 });
  }
  if (!status || !['planned', 'actual'].includes(status as string)) {
    return NextResponse.json({ error: 'status must be planned or actual' }, { status: 400 });
  }

  const admin = createAdminClient();
  const fundIdStr = typeof fund_id === 'string' ? fund_id : null;

  // If fund_id provided, verify user is a member
  if (fundIdStr) {
    const { data: membership } = await admin
      .from('fund_members')
      .select('user_id')
      .eq('fund_id', fundIdStr)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this fund' }, { status: 403 });
    }
  }

  // Hard-block: sum existing expenses for this user + month + status
  const { data: expensesSum } = await admin
    .from('expenses')
    .select('amount_vnd')
    .eq('user_id', user.id)
    .eq('month', month as string)
    .eq('status', status as string);

  const existingExpenses = (expensesSum ?? []).reduce((sum, e) => sum + (e.amount_vnd as number), 0);

  // Sum earnings for this user + month + status
  const { data: earningsSum } = await admin
    .from('earnings')
    .select('amount_vnd')
    .eq('user_id', user.id)
    .eq('month', month as string)
    .eq('status', status as string);

  const earningsTotal = (earningsSum ?? []).reduce((sum, e) => sum + (e.amount_vnd as number), 0);

  if (existingExpenses + (amount_vnd as number) > earningsTotal) {
    const remaining = earningsTotal - existingExpenses;
    return NextResponse.json(
      {
        error: `Exceeds your ${status} earnings limit`,
        remaining: remaining < 0 ? 0 : remaining,
      },
      { status: 422 }
    );
  }

  const { data, error } = await admin
    .from('expenses')
    .insert({
      user_id: user.id,
      fund_id: fundIdStr,
      month,
      amount_vnd,
      status,
      description: typeof description === 'string' ? description || null : null,
    })
    .select()
    .single();

  if (error) {
    console.error('POST /api/expenses error:', {
      context: 'Creating expense',
      month,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
  return NextResponse.json({ expense: data }, { status: 201 });
}
