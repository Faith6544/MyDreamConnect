/**
 * Shared helper for the local admin / seed scripts.
 *
 * SECURITY: these scripts bypass Row Level Security, so they need the
 * Supabase `service_role` key. That key MUST NOT live in the repository.
 * Provide it through the environment instead:
 *
 *   node --env-file=.env.local seed-ai.js
 *
 * or in PowerShell:
 *
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "eyJ..."
 *
 * The key is available in Supabase Dashboard > Project Settings > API Keys.
 *
 * NOTE: a leaked service_role key bypasses every Row Level Security policy,
 * i.e. full read/write access to the whole database. If a key was ever
 * committed to git it must be ROTATED, not just removed from the file.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

/**
 * Minimal .env loader so the scripts work without adding a dependency.
 * Real environment variables always win over file values.
 */
function loadEnvFile(fileName) {
  const fullPath = path.resolve(__dirname, '..', fileName);
  if (!fs.existsSync(fullPath)) return;

  for (const rawLine of fs.readFileSync(fullPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf('=');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://kzdqbqnyytgovlngfvwr.supabase.co';

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '\n❌ SUPABASE_SERVICE_ROLE_KEY is not set.\n' +
      '   These scripts bypass Row Level Security, so they require the service_role key.\n' +
      '   Add it to .env.local (git-ignored):\n\n' +
      '       SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n\n' +
      '   Or export it for this shell:\n' +
      '       $env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"\n\n' +
      '   Find the key in Supabase Dashboard > Project Settings > API Keys.\n'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabase, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY };
