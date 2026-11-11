import { supabase } from './supabase';

/**
 * Fetch every row of a table in the admin's custom drag-and-drop order.
 *
 * Falls back to newest-first when the order column does not exist yet
 * (Postgres error 42703), so pages keep working before the
 * `add_display_order_columns` migration has been run.
 *
 * @param {string} table   e.g. 'videos'
 * @param {string} column  order column, 'display_order' by default
 * @returns {Promise<{ data: Array|null, error: object|null }>}
 */
export async function fetchInOrder(table, column = 'display_order') {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(column, { ascending: true });

  if (!error) return { data: data || [], error: null };

  // Anything other than a missing column is a real failure — surface it.
  if (error.code !== '42703') return { data: [], error };

  const fallback = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false });

  return { data: fallback.data || [], error: fallback.error || null };
}

/**
 * Persist a new drag-and-drop order. Only rows whose position actually
 * changed are written, which keeps the update payload small.
 *
 * @param {string} table    e.g. 'videos'
 * @param {Array}  items    the reordered list of rows
 * @param {string} column   order column, 'display_order' by default
 */
export async function saveOrder(table, items, column = 'display_order') {
  const updates = items
    .map((item, index) => ({ id: item.id, [column]: index + 1 }))
    .filter((update, index) => items[index][column] !== update[column]);

  if (updates.length === 0) return null;

  return Promise.all(
    updates.map((update) =>
      supabase.from(table).update({ [column]: update[column] }).eq('id', update.id)
    )
  );
}
