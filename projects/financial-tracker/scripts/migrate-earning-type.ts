/**
 * Migration: Rename earning type 'regular' → 'income'
 *
 * Run once after deploying v2.1 to rename all existing earnings
 * with type='regular' to type='income'.
 *
 * Usage:
 *   npx tsx scripts/migrate-earning-type.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function migrate() {
  console.log("Fetching earnings with type='regular'...");

  const { data, error } = await admin
    .from('earnings')
    .select('id')
    .eq('type', 'regular');

  if (error) {
    console.error('Failed to fetch:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No earnings with type='regular' found. Migration not needed.");
    return;
  }

  console.log(`Found ${data.length} rows to migrate.`);

  // Batch update in chunks of 500
  const batchSize = 500;
  let updated = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const chunk = data.slice(i, i + batchSize);
    const ids = chunk.map(r => r.id as string);

    const { error: updateError } = await admin
      .from('earnings')
      .update({ type: 'income' })
      .in('id', ids);

    if (updateError) {
      console.error(`Batch ${i / batchSize + 1} failed:`, updateError.message);
      process.exit(1);
    }

    updated += chunk.length;
    console.log(`Migrated ${updated}/${data.length} rows...`);
  }

  console.log(`✓ Migration complete. ${updated} earnings updated from 'regular' to 'income'.`);
}

migrate().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
