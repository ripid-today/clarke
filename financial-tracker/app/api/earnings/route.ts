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
      .from('earnings')
      .select('*')
      .eq('user_id', user.id)
      .gte('month', startMonth)
      .lte('month', endMonth)
      .order('month', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('GET /api/earnings (range) error:', {
        context: 'Fetching earnings range',
        startMonth,
        endMonth,
        error: error.message,
      });
      return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
    }
    return NextResponse.json({ earnings: data });
  }

  // Single month query
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }

  const { data, error } = await admin
    .from('earnings')
    .select('*')
    .eq('user_id', user.id)
    .eq('month', month)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('GET /api/earnings error:', {
      context: 'Fetching earnings for user',
      month,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
  }
  return NextResponse.json({ earnings: data });
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

  const { month, amount_vnd, status, name, type, receiver_type, receiver_id } = body as Record<string, unknown>;

  if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }
  if (!amount_vnd || typeof amount_vnd !== 'number' || !Number.isInteger(amount_vnd) || amount_vnd <= 0) {
    return NextResponse.json({ error: 'amount_vnd must be a positive integer' }, { status: 400 });
  }
  if (!status || !['planned', 'actual'].includes(status as string)) {
    return NextResponse.json({ error: 'status must be planned or actual' }, { status: 400 });
  }

  const earningType = typeof type === 'string' ? type : 'regular';
  if (!['regular', 'receivable'].includes(earningType)) {
    return NextResponse.json({ error: 'type must be regular or receivable' }, { status: 400 });
  }

  const earningReceiverType = typeof receiver_type === 'string' ? receiver_type : 'user';
  if (!['user', 'fund'].includes(earningReceiverType)) {
    return NextResponse.json({ error: 'receiver_type must be user or fund' }, { status: 400 });
  }

  const earningReceiverId = earningReceiverType === 'fund'
    ? (typeof receiver_id === 'string' ? receiver_id : null)
    : null;

  if (earningReceiverType === 'fund' && !earningReceiverId) {
    return NextResponse.json({ error: 'receiver_id required when receiver_type is fund' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('earnings')
    .insert({
      user_id: user.id,
      month,
      amount_vnd,
      status,
      name: typeof name === 'string' ? name : '',
      type: earningType,
      receiver_type: earningReceiverType,
      receiver_id: earningReceiverId,
    })
    .select()
    .single();

  if (error) {
    console.error('POST /api/earnings error:', {
      context: 'Creating earning',
      month,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to create earning' }, { status: 500 });
  }
  return NextResponse.json({ earning: data }, { status: 201 });
}
