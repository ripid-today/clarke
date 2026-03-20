import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { amount_vnd, status, name, receiver_type, receiver_id } = body as Record<string, unknown>;

  // Validate inputs
  if (amount_vnd !== undefined) {
    if (typeof amount_vnd !== 'number' || !Number.isInteger(amount_vnd) || amount_vnd <= 0) {
      return NextResponse.json({ error: 'amount_vnd must be a positive integer' }, { status: 400 });
    }
  }
  if (status !== undefined) {
    if (!['planned', 'actual'].includes(status as string)) {
      return NextResponse.json({ error: 'status must be planned or actual' }, { status: 400 });
    }
  }

  const admin = createAdminClient();

  // Fetch current expense (verify ownership via user_id)
  const { data: current } = await admin
    .from('expenses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!current) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  const newAmount = typeof amount_vnd === 'number' ? amount_vnd : (current.amount_vnd as number);
  const newStatus = typeof status === 'string' ? status : (current.status as string);
  const currentSenderType = current.sender_type as string;

  // Hard-block: only apply when sender is the user themselves
  if (currentSenderType === 'user') {
    const { data: expensesSum } = await admin
      .from('expenses')
      .select('amount_vnd')
      .eq('sender_type', 'user')
      .eq('sender_id', user.id)
      .eq('month', current.month as string)
      .eq('status', newStatus)
      .neq('id', id);

    const otherExpenses = (expensesSum ?? []).reduce((sum, e) => sum + (e.amount_vnd as number), 0);

    const { data: earningsSum } = await admin
      .from('earnings')
      .select('amount_vnd')
      .eq('user_id', user.id)
      .eq('month', current.month as string)
      .eq('status', newStatus);

    const earningsTotal = (earningsSum ?? []).reduce((sum, e) => sum + (e.amount_vnd as number), 0);

    if (otherExpenses + newAmount > earningsTotal) {
      const remaining = earningsTotal - otherExpenses;
      return NextResponse.json(
        {
          error: `Exceeds your ${newStatus} earnings limit`,
          remaining: remaining < 0 ? 0 : remaining,
        },
        { status: 422 }
      );
    }
  }

  const updates: Record<string, unknown> = {};
  if (amount_vnd !== undefined) updates.amount_vnd = amount_vnd;
  if (status !== undefined) updates.status = status;
  if (name !== undefined) {
    updates.name = typeof name === 'string' ? name : '';
  }
  if (receiver_type !== undefined) {
    if (!['fund', 'none'].includes(receiver_type as string)) {
      return NextResponse.json({ error: 'receiver_type must be fund or none' }, { status: 400 });
    }
    updates.receiver_type = receiver_type;
    updates.receiver_id = receiver_type === 'fund'
      ? (typeof receiver_id === 'string' ? receiver_id : null)
      : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const { data, error } = await admin
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('PATCH /api/expenses/[id] error:', {
      context: 'Updating expense',
      id,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }

  return NextResponse.json({ expense: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const admin = createAdminClient();
  const { error, count } = await admin
    .from('expenses')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('DELETE /api/expenses/[id] error:', {
      context: 'Deleting expense',
      id,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
