/**
 * Merge a CMS row over its shipped defaults.
 *
 * content_entries rows are whole-page JSON blobs written by the admin, and
 * they used to replace `defaults[key]` outright. That means any field added to
 * shared/content-defaults.js after a page was first saved never appears —
 * the stored blob simply has no such key. Filling the gaps from defaults keeps
 * newly shipped fields working without hand-editing every row.
 *
 * Stored values always win. Arrays are replaced wholesale rather than merged
 * element-wise, so removing an item in the admin stays removed.
 */
const isPlainObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

export function mergeContent(defaultValue, storedValue) {
  if (storedValue === undefined) return defaultValue;
  if (!isPlainObject(defaultValue) || !isPlainObject(storedValue)) {
    return storedValue;
  }
  const out = { ...defaultValue };
  for (const [k, v] of Object.entries(storedValue)) {
    out[k] = mergeContent(defaultValue[k], v);
  }
  return out;
}
