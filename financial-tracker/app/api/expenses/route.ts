import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const startMonth = searchParams.get('startMonth');
  const endMonth = searchParams.get('endMonth');

  const admin = createAdminClient();

  // Range query: startMonth + endMonth
  if (startMonth || endMonth) {
    if (!startMonth || !/^\d{4}-\d{2}$/.test(startMonth)) {
      return NextResponse.json({ error: 'Invalid startMonth format. Use YYYY-MM' }, { status: 400 });
    }
    if (!endMonth || !/^\d{4}-\d{2}$/.test(endMonth)) {
      return NextResponse.json({ error: 'Invalid endMonth format. Use YYYY-MM' }, { status: 400 });
    }

    const { data, error } = await admin
      .from('expenses')
      .select('*')
      .eq('sender_type', 'user')
      .eq('sender_id', user.id)
      .gte('month', startMonth)
      .lte('month', endMonth)
      .order('month', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('GET /api/expenses (range) error:', {
        context: 'Fetching expenses range',
        startMonth,
        endMonth,
        error: error.message,
      });
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
    return NextResponse.json({ expenses: data });
  }

  // Single month query
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }

  const { data, error } = await admin
    .from('expenses')
    .select('*')
    .eq('sender_type', 'user')
    .eq('sender_id', user.id)
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

  const { month, amount_vnd, status, name, sender_type, sender_id, receiver_type, receiver_id } = body as Record<string, unknown>;

  if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }
  if (!amount_vnd || typeof amount_vnd !== 'number' || !Number.isInteger(amount_vnd) || amount_vnd <= 0) {
    return NextResponse.json({ error: 'amount_vnd must be a positive integer' }, { status: 400 });
  }
  if (!status || !['planned', 'actual'].includes(status as string)) {
    return NextResponse.json({ error: 'status must be planned or actual' }, { status: 400 });
  }

  const expSenderType = typeof sender_type === 'string' ? sender_type : 'user';
  if (!['user', 'fund'].includes(expSenderType)) {
    return NextResponse.json({ error: 'sender_type must be user or fund' }, { status: 400 });
  }

  // sender_id: for user sender, use the authenticated user's id
  const expSenderId = expSenderType === 'user'
    ? user.id
    : (typeof sender_id === 'string' ? sender_id : null);

  if (expSenderType === 'fund' && !expSenderId) {
    return NextResponse.json({ error: 'sender_id required when sender_type is fund' }, { status: 400 });
  }

  const expReceiverType = typeof receiver_type === 'string' ? receiver_type : 'none';
  if (!['fund', 'none'].includes(expReceiverType)) {
    return NextResponse.json({ error: 'receiver_type must be fund or none' }, { status: 400 });
  }

  const expReceiverId = expReceiverType === 'fund'
    ? (typeof receiver_id === 'string' ? receiver_id : null)
    : null;

  if (expReceiverType === 'fund' && !expReceiverId) {
    return NextResponse.json({ error: 'receiver_id required when receiver_type is fund' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Hard-block: only apply when sender is the user themselves
  if (expSenderType === 'user') {
    const { data: expensesSum } = await admin
      .from('expenses')
      .select('amount_vnd')
      .eq('sender_type', 'user')
      .eq('sender_id', user.id)
      .eq('month', month as string)
      .eq('status', status as string);

    const existingExpenses = (expensesSum ?? []).reduce((sum, e) => sum + (e.amount_vnd as number), 0);

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
          error: `Exceeds your ${status as string} earnings limit`,
          remaining: remaining < 0 ? 0 : remaining,
        },
        { status: 422 }
      );
    }
  }

  const { data, error } = await admin
    .from('expenses')
    .insert({
      user_id: user.id,
      month,
      amount_vnd,
      status,
      name: typeof name === 'string' ? name : '',
      sender_type: expSenderType,
      sender_id: expSenderId,
      receiver_type: expReceiverType,
      receiver_id: expReceiverId,
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
