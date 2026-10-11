// Per-date outfit/reminder variant persistence (spec "Content variation").
// A date's variants are rolled once, stored in localStorage, and reused on every return.
const KEY_PREFIX = 'variants:';
const VARIANT_COUNT = 3;

const randomVariant = () => 1 + Math.floor(Math.random() * VARIANT_COUNT);

/**
 * Return { outfitVariant, reminderVariants } for a date, creating and storing any that are missing.
 * `storage` is injectable (defaults to localStorage) so tests don't touch real data.
 * Outfit and each reminder wording are rolled independently.
 */
export function resolveVariants(date, reminders, storage = globalThis.localStorage) {
  const key = KEY_PREFIX + date;
  const saved = read(storage, key);
  let changed = false;

  if (!saved.outfitVariant) {
    saved.outfitVariant = randomVariant();
    changed = true;
  }
  // A reminder can become active later (forecast updates), so roll only the missing ones.
  saved.reminderVariants ??= {};
  for (const reminder of reminders) {
    if (!saved.reminderVariants[reminder]) {
      saved.reminderVariants[reminder] = randomVariant();
      changed = true;
    }
  }
  if (changed) write(storage, key, saved);

  const reminderVariants = {};
  for (const reminder of reminders) reminderVariants[reminder] = saved.reminderVariants[reminder];
  return { outfitVariant: saved.outfitVariant, reminderVariants };
}

// localStorage can throw (private mode, blocked, corrupt JSON); fall back to unsaved variants.
function read(storage, key) {
  try {
    const parsed = JSON.parse(storage.getItem(key));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: variants still hold for this session, just not after a reload.
  }
}
