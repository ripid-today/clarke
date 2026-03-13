import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: fundId } = await params;
  const admin = createAdminClient();

  // Verify requesting user is a member of this fund
  const { data: membership } = await admin
    .from('fund_members')
    .select('user_id')
    .eq('fund_id', fundId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this fund' }, { status: 403 });
  }

  // Fetch members with profile info
  const { data, error } = await admin
    .from('fund_members')
    .select('user_id, added_at, profiles(email, display_name)')
    .eq('fund_id', fundId);

  if (error) {
    console.error('GET /api/funds/[id]/members error:', {
      context: 'Fetching fund members',
      fundId,
      error: error.message,
    });
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }

  const members = (data ?? []).map((row) => {
    const profile = (row.profiles as unknown) as { email: string; display_name: string } | null;
    return {
      fund_id: fundId,
      user_id: row.user_id,
      display_name: profile?.display_name ?? '',
      email: profile?.email ?? '',
      added_at: row.added_at,
    };
  });

  return NextResponse.json({ members });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: fundId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email } = body as Record<string, unknown>;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify requesting user is the fund creator
  const { data: fund } = await admin
    .from('funds')
    .select('created_by')
    .eq('id', fundId)
    .maybeSingle();

  if (!fund) {
    return NextResponse.json({ error: 'Fund not found' }, { status: 404 });
  }

  if ((fund as { created_by: string }).created_by !== user.id) {
    return NextResponse.json({ error: 'Only the fund creator can add members' }, { status: 403 });
  }

  // Look up user by email in profiles table
  const { data: profile } = await admin
    .from('profiles')
    .select('id, display_name, email')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: 'No account found with that email address' },
      { status: 404 }
    );
  }

  const profileData = profile as { id: string; display_name: string; email: string };

  // Check not already a member
  const { data: existing } = await admin
    .from('fund_members')
    .select('user_id')
    .eq('fund_id', fundId)
    .eq('user_id', profileData.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'User is already a member of this fund' }, { status: 400 });
  }

  // Insert fund_members row
  const { error: insertError } = await admin
    .from('fund_members')
    .insert({ fund_id: fundId, user_id: profileData.id });

  if (insertError) {
    console.error('POST /api/funds/[id]/members error:', {
      context: 'Adding fund member',
      fundId,
      error: insertError.message,
    });
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      member: {
        user_id: profileData.id,
        display_name: profileData.display_name,
        email: profileData.email,
      },
    },
    { status: 201 }
  );
}
