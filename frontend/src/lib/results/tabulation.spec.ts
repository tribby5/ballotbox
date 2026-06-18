import { describe, it, expect } from 'vitest';
import { tabulate, winnerLabels, type EngineOption, type EngineBallot } from './tabulation';

const opts = (...labels: string[]): EngineOption[] =>
  labels.map((label) => ({ id: label, label }));

/** Expand a compact "ballot:count" spec into individual ballots. */
function ballots(spec: [EngineBallot, number][]): EngineBallot[] {
  const out: EngineBallot[] = [];
  for (const [b, n] of spec) for (let i = 0; i < n; i++) out.push(b);
  return out;
}

describe('plurality', () => {
  it('picks the most first-choice votes', () => {
    const options = opts('A', 'B', 'C');
    const bs = ballots([
      [['A', 'B', 'C'], 4],
      [['B', 'C', 'A'], 3],
      [['C', 'B', 'A'], 2],
    ]);
    const r = tabulate('single_plurality', options, bs)!;
    expect(winnerLabels(r)).toEqual(['A']);
    expect(r.chart.bars.find((b) => b.optionId === 'A')!.value).toBe(4);
  });
});

describe('borda', () => {
  it('rewards broad support over a plurality leader', () => {
    const options = opts('A', 'B', 'C');
    // A leads first choices but B is everyone's strong second/first.
    const bs = ballots([
      [['A', 'B', 'C'], 4],
      [['B', 'A', 'C'], 3],
      [['B', 'C', 'A'], 3],
    ]);
    // Points (n-1=2 / 1 / 0): A = 4*2+3*1+3*0 = 11; B = 4*1+3*2+3*2 = 16; C = 1.
    const r = tabulate('borda', options, bs)!;
    expect(winnerLabels(r)).toEqual(['B']);
    expect(r.chart.bars.find((b) => b.optionId === 'B')!.value).toBe(16);
  });
});

describe('irv', () => {
  it('eliminates the lowest and transfers to find a majority', () => {
    const options = opts('A', 'B', 'C');
    // First choices: A=4, B=3, C=2 (9 total, no majority). C eliminated.
    // C's ballots go to B -> B=5 majority.
    const bs = ballots([
      [['A', 'B', 'C'], 4],
      [['B', 'A', 'C'], 3],
      [['C', 'B', 'A'], 2],
    ]);
    const r = tabulate('irv', options, bs)!;
    expect(winnerLabels(r)).toEqual(['B']);
    expect(r.steps.length).toBeGreaterThanOrEqual(2);
  });

  it('can differ from plurality (non-monotonic family)', () => {
    const options = opts('A', 'B', 'C');
    const bs = ballots([
      [['A', 'B', 'C'], 4],
      [['B', 'C', 'A'], 3],
      [['C', 'B', 'A'], 2],
    ]);
    // Plurality winner is A; IRV: C eliminated, transfers to B => B wins.
    const plurality = tabulate('single_plurality', options, bs)!;
    const irv = tabulate('irv', options, bs)!;
    expect(winnerLabels(plurality)).toEqual(['A']);
    expect(winnerLabels(irv)).toEqual(['B']);
  });
});

describe('condorcet methods', () => {
  // Classic Condorcet winner example: B beats both A and C head-to-head.
  const options = opts('A', 'B', 'C');
  const bs = ballots([
    [['A', 'B', 'C'], 4],
    [['B', 'C', 'A'], 3],
    [['C', 'B', 'A'], 2],
  ]);
  // Head-to-head: B vs A => 5 prefer B (3+2) vs 4 => B. B vs C => 7 vs 2 => B. B is Condorcet winner.

  it('least worst defeat elects the Condorcet winner', () => {
    const r = tabulate('least_worst', options, bs)!;
    expect(winnerLabels(r)).toEqual(['B']);
    expect(r.pairwise).not.toBeNull();
  });

  it('ranked pairs elects the Condorcet winner', () => {
    const r = tabulate('ranked_pairs', options, bs)!;
    expect(winnerLabels(r)).toEqual(['B']);
    expect(r.steps.some((s) => s.heading === 'Lock')).toBe(true);
  });
});

describe('ranked pairs cycle handling', () => {
  it('skips the weakest pair in a Condorcet cycle', () => {
    const options = opts('A', 'B', 'C');
    // Condorcet cycle: A>B (margin large), B>C, C>A (weakest) => C>A skipped, A wins.
    const bs = ballots([
      [['A', 'B', 'C'], 5],
      [['B', 'C', 'A'], 4],
      [['C', 'A', 'B'], 2],
    ]);
    const r = tabulate('ranked_pairs', options, bs)!;
    // A beats B (7-4), B beats C (9-2), C beats A (6-5). Weakest C>A skipped.
    expect(winnerLabels(r)).toEqual(['A']);
    expect(r.steps.some((s) => s.heading === 'Skip')).toBe(true);
  });
});

describe('ir_borda', () => {
  it('produces a winner and eliminates lowest scorers', () => {
    const options = opts('A', 'B', 'C', 'D');
    const bs = ballots([
      [['A', 'B', 'C', 'D'], 3],
      [['B', 'A', 'C', 'D'], 2],
      [['C', 'B', 'A', 'D'], 2],
    ]);
    const r = tabulate('ir_borda', options, bs)!;
    expect(r.winnerIds.length).toBe(1);
    expect(r.ranking).toHaveLength(4);
    // D never appears first and should rank last.
    expect(r.ranking[r.ranking.length - 1].optionId).toBe('D');
  });
});

describe('edge cases', () => {
  it('returns null when there are no ballots', () => {
    expect(tabulate('irv', opts('A', 'B'), [])).toBeNull();
  });

  it('produces a full ranking of every option', () => {
    const options = opts('A', 'B', 'C');
    const bs = ballots([[['A', 'B', 'C'], 1]]);
    const r = tabulate('borda', options, bs)!;
    expect(r.ranking.map((x) => x.optionId).sort()).toEqual(['A', 'B', 'C']);
  });
});
