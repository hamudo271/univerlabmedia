/**
 * Slug generator shared by the admin editor (live preview) and the server
 * (canonical, collision-resolved value).
 *
 * Korean titles are kept as Hangul in the slug rather than romanized — modern
 * browsers and Google handle URL-encoded Hangul fine, and it avoids a lossy
 * transliteration dependency. Latin is lowercased; runs of anything that is
 * not a letter/number/Hangul become a single hyphen.
 *
 * Returns "" for input that has no usable characters (all punctuation/emoji);
 * callers should fall back to a random suffix in that case.
 */
export function slugify(input) {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"']/g, "")
    // keep a-z, 0-9, complete Hangul syllables and jamo; everything else → "-"
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
