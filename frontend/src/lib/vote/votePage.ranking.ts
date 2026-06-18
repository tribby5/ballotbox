export type OptionRow = { id: string; text: string };

export function reorderDragged(
  ordered: OptionRow[],
  fromIndex: number,
  toIndex: number,
): OptionRow[] {
  const next = [...ordered];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function parseRank(s: string): number | null {
  const n = parseInt(s.trim(), 10);
  if (!Number.isFinite(n) || String(n) !== s.trim()) return null;
  return n;
}

export function parseNumericRanks(
  numericRanks: string[],
  options: { id: string }[],
): { error: string } | { orderIds: string[] } {
  const n = options.length;
  const parsed = numericRanks.map(parseRank);
  if (parsed.some((p) => p === null)) {
    return { error: 'Enter a whole number rank for every option.' };
  }
  const ranks = parsed as number[];
  if (ranks.some((r) => r < 1 || r > n)) {
    return { error: `Each rank must be between 1 and ${n}.` };
  }
  if (new Set(ranks).size !== ranks.length) {
    return { error: 'Ranks must be unique.' };
  }
  const orderIds = [...options]
    .map((opt, i) => ({ id: opt.id, r: ranks[i] }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.id);
  return { orderIds };
}
