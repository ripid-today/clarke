import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('fund_members')
    .select('funds(*)')
    .eq('user_id', user.id);

  if (error) {
    console.error('GET /api/funds error:', {
      context: 'Fetching user funds',
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to fetch funds' }, { status: 500 });
  }

  // Flatten the nested structure
  const funds = (data ?? [])
    .map((row) => (row as { funds: unknown }).funds)
    .filter(Boolean);

  return NextResponse.json({ funds });
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

  const { name } = body as Record<string, unknown>;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Fund name is required' }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: 'Fund name must be 100 characters or less' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: fund, error: fundError } = await admin
    .from('funds')
    .insert({ name: name.trim(), created_by: user.id })
    .select()
    .single();

  if (fundError || !fund) {
    console.error('POST /api/funds error (create fund):', {
      context: 'Creating fund',
      error: fundError?.message,
    });
    return NextResponse.json({ error: 'Failed to create fund' }, { status: 500 });
  }

  const { error: memberError } = await admin
    .from('fund_members')
    .insert({ fund_id: (fund as { id: string }).id, user_id: user.id });

  if (memberError) {
    console.error('POST /api/funds error (add creator as member):', {
      context: 'Adding creator as fund member',
      fundId: (fund as { id: string }).id,
      error: memberError.message,
    });
    return NextResponse.json({ error: 'Failed to initialize fund membership' }, { status: 500 });
  }

  return NextResponse.json({ fund }, { status: 201 });
}
