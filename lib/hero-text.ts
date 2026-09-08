// The admin settings form lets a firm enter multiple hero headings/subheadings
// as separate lines in a single textarea (no backend schema change required).
// This splits that raw string into a clean array the hero can rotate through.
export function parseHeroLines(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
