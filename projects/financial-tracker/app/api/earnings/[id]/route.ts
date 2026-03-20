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

  const { amount_vnd, status, name, type, receiver_type, receiver_id } = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  if (amount_vnd !== undefined) {
    if (typeof amount_vnd !== 'number' || !Number.isInteger(amount_vnd) || amount_vnd <= 0) {
      return NextResponse.json({ error: 'amount_vnd must be a positive integer' }, { status: 400 });
    }
    updates.amount_vnd = amount_vnd;
  }

  if (status !== undefined) {
    if (!['planned', 'actual'].includes(status as string)) {
      return NextResponse.json({ error: 'status must be planned or actual' }, { status: 400 });
    }
    updates.status = status;
  }

  if (name !== undefined) {
    updates.name = typeof name === 'string' ? name : '';
  }

  if (type !== undefined) {
    if (!['income', 'receivable'].includes(type as string)) {
      return NextResponse.json({ error: 'type must be income or receivable' }, { status: 400 });
    }
    updates.type = type;
  }

  if (receiver_type !== undefined) {
    if (!['user', 'fund'].includes(receiver_type as string)) {
      return NextResponse.json({ error: 'receiver_type must be user or fund' }, { status: 400 });
    }
    updates.receiver_type = receiver_type;
    updates.receiver_id = receiver_type === 'fund'
      ? (typeof receiver_id === 'string' ? receiver_id : null)
      : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('earnings')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('PATCH /api/earnings/[id] error:', {
      context: 'Updating earning',
      id,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to update earning' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Earning not found' }, { status: 404 });
  }

  return NextResponse.json({ earning: data });
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
    .from('earnings')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('DELETE /api/earnings/[id] error:', {
      context: 'Deleting earning',
      id,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to delete earning' }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json({ error: 'Earning not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
