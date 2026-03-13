import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }

  const admin = createAdminClient();
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

  const { month, amount_vnd, status, description } = body as Record<string, unknown>;

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
  const { data, error } = await admin
    .from('earnings')
    .insert({
      user_id: user.id,
      month,
      amount_vnd,
      status,
      description: typeof description === 'string' ? description || null : null,
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
