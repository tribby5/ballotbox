import type { VotingMethodValue } from '$lib/votingMethods';

/**
 * Tabulation engine for Ballot Box.
 *
 * Pure, dependency-free functions that turn anonymous ranked ballots into a
 * winner, a full ranking, and per-method breakdown data the results page can
 * explain. Ballots are arrays of option ids ordered most-preferred first; they
 * may be partial (unranked options are treated as ranked below every ranked
 * option, with no preference among themselves).
 *
 * Tie-breaking is deterministic: wherever a method needs to break a tie, the
 * option appearing earlier in `options` (its sort order) is preferred.
 */

export type EngineOption = { id: string; label: string };
export type EngineBallot = string[];

export type RankingEntry = {
  optionId: string;
  label: string;
  rank: number;
  tied: boolean;
};

export type ChartBar = {
  optionId: string;
  label: string;
  value: number;
  isWinner: boolean;
};

export type ExplainStep = {
  heading: string;
  detail: string;
};

export type PairwiseTable = {
  options: EngineOption[];
  /** matrix[i][j] = ballots ranking options[i] above options[j]. */
  matrix: number[][];
};

export type ResultsComputation = {
  method: VotingMethodValue;
  winnerIds: string[];
  ranking: RankingEntry[];
  chart: { title: string; unit: string; bars: ChartBar[] };
  steps: ExplainStep[];
  pairwise: PairwiseTable | null;
};

// -----------------------------------------------------------------------------
// Shared helpers
// -----------------------------------------------------------------------------

/** Position of each option id on a ballot (0 = first choice); unranked omitted. */
function positionMap(ballot: EngineBallot): Map<string, number> {
  const m = new Map<string, number>();
  ballot.forEach((id, i) => {
    if (!m.has(id)) m.set(id, i);
  });
  return m;
}

/** Does this ballot prefer `a` over `b`? Ranked beats unranked; both unranked = no preference. */
function prefers(pos: Map<string, number>, a: string, b: string): boolean {
  const pa = pos.get(a);
  const pb = pos.get(b);
  if (pa === undefined && pb === undefined) return false;
  if (pa === undefined) return false;
  if (pb === undefined) return true;
  return pa < pb;
}

function buildPairwise(options: EngineOption[], ballots: EngineBallot[]): PairwiseTable {
  const n = options.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const positions = ballots.map(positionMap);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      let count = 0;
      for (const pos of positions) {
        if (prefers(pos, options[i].id, options[j].id)) count++;
      }
      matrix[i][j] = count;
    }
  }
  return { options, matrix };
}

/** Count of head-to-head matchups each option wins outright (strictly more voters prefer it). */
function pairwiseWinBars(
  pairwise: PairwiseTable,
  winnerIds: Set<string>,
): ChartBar[] {
  const { options, matrix } = pairwise;
  return options.map((opt, i) => {
    let wins = 0;
    for (let j = 0; j < options.length; j++) {
      if (i === j) continue;
      if (matrix[i][j] > matrix[j][i]) wins++;
    }
    return { optionId: opt.id, label: opt.label, value: wins, isWinner: winnerIds.has(opt.id) };
  });
}

/**
 * Rank options by a numeric score using standard competition ranking (1,2,2,4).
 * `higherIsBetter` flips the comparison for "lower is better" scores.
 */
function rankByScore(
  options: EngineOption[],
  scores: number[],
  higherIsBetter: boolean,
): { ranking: RankingEntry[]; winnerIds: string[] } {
  const order = options.map((_, i) => i).sort((a, b) => {
    const diff = higherIsBetter ? scores[b] - scores[a] : scores[a] - scores[b];
    return diff !== 0 ? diff : a - b;
  });

  const ranking: RankingEntry[] = [];
  let lastScore: number | null = null;
  let lastRank = 0;
  order.forEach((idx, position) => {
    const score = scores[idx];
    const rank = lastScore !== null && score === lastScore ? lastRank : position + 1;
    lastScore = score;
    lastRank = rank;
    ranking.push({ optionId: options[idx].id, label: options[idx].label, rank, tied: false });
  });

  // Flag ties (a score shared by more than one option).
  const counts = new Map<number, number>();
  scores.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1));
  for (const entry of ranking) {
    const idx = options.findIndex((o) => o.id === entry.optionId);
    entry.tied = (counts.get(scores[idx]) ?? 0) > 1;
  }

  const best = higherIsBetter ? Math.max(...scores) : Math.min(...scores);
  const winnerIds = options.filter((_, i) => scores[i] === best).map((o) => o.id);
  return { ranking, winnerIds };
}

/** Ranking from an explicit order (winner first); no shared ranks. */
function rankFromOrder(options: EngineOption[], orderedIds: string[]): RankingEntry[] {
  const byId = new Map(options.map((o) => [o.id, o] as const));
  return orderedIds.map((id, i) => ({
    optionId: id,
    label: byId.get(id)?.label ?? id,
    rank: i + 1,
    tied: false,
  }));
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

// -----------------------------------------------------------------------------
// Methods
// -----------------------------------------------------------------------------

function tabulatePlurality(options: EngineOption[], ballots: EngineBallot[]): ResultsComputation {
  const counts = options.map((opt) => ballots.filter((b) => b[0] === opt.id).length);
  const { ranking, winnerIds } = rankByScore(options, counts, true);
  const winnerSet = new Set(winnerIds);
  const bars: ChartBar[] = options.map((opt, i) => ({
    optionId: opt.id,
    label: opt.label,
    value: counts[i],
    isWinner: winnerSet.has(opt.id),
  }));
  const top = ranking[0];
  return {
    method: 'single_plurality',
    winnerIds,
    ranking,
    chart: { title: 'First-choice votes', unit: 'votes', bars },
    steps: [
      {
        heading: 'Count first choices',
        detail: `Each ballot's top choice is counted. ${top.label} leads with ${plural(
          counts[options.findIndex((o) => o.id === top.optionId)],
          'first-choice vote',
        )}.`,
      },
    ],
    pairwise: null,
  };
}

function bordaPoints(options: EngineOption[], ballots: EngineBallot[], activeIds?: Set<string>): number[] {
  const active = activeIds ?? new Set(options.map((o) => o.id));
  const n = active.size;
  const points = new Map<string, number>();
  options.forEach((o) => points.set(o.id, 0));
  for (const ballot of ballots) {
    const rankedActive = ballot.filter((id) => active.has(id));
    rankedActive.forEach((id, pos) => {
      points.set(id, (points.get(id) ?? 0) + (n - 1 - pos));
    });
  }
  return options.map((o) => (active.has(o.id) ? (points.get(o.id) ?? 0) : 0));
}

function tabulateBorda(options: EngineOption[], ballots: EngineBallot[]): ResultsComputation {
  const points = bordaPoints(options, ballots);
  const { ranking, winnerIds } = rankByScore(options, points, true);
  const winnerSet = new Set(winnerIds);
  const bars: ChartBar[] = options.map((opt, i) => ({
    optionId: opt.id,
    label: opt.label,
    value: points[i],
    isWinner: winnerSet.has(opt.id),
  }));
  const top = ranking[0];
  return {
    method: 'borda',
    winnerIds,
    ranking,
    chart: { title: 'Borda points', unit: 'points', bars },
    steps: [
      {
        heading: 'Award positional points',
        detail: `With ${options.length} options, each ballot gives its top choice ${
          options.length - 1
        } points down to 0 for last. ${top.label} wins with the most points.`,
      },
    ],
    pairwise: null,
  };
}

function tabulateIrv(options: EngineOption[], ballots: EngineBallot[]): ResultsComputation {
  const active = new Set(options.map((o) => o.id));
  const labelOf = (id: string) => options.find((o) => o.id === id)?.label ?? id;
  const idxOf = (id: string) => options.findIndex((o) => o.id === id);
  const eliminationOrder: string[] = [];
  const steps: ExplainStep[] = [];
  let firstRoundCounts: number[] = options.map(() => 0);
  let winnerId: string | null = null;
  let round = 0;

  while (active.size > 1) {
    round++;
    const counts = new Map<string, number>();
    active.forEach((id) => counts.set(id, 0));
    for (const ballot of ballots) {
      const top = ballot.find((id) => active.has(id));
      if (top) counts.set(top, (counts.get(top) ?? 0) + 1);
    }
    if (round === 1) firstRoundCounts = options.map((o) => counts.get(o.id) ?? 0);

    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    let leader: string | null = null;
    let leaderVotes = -1;
    for (const [id, c] of counts) {
      if (c > leaderVotes) {
        leaderVotes = c;
        leader = id;
      }
    }
    if (leader && total > 0 && leaderVotes * 2 > total) {
      winnerId = leader;
      steps.push({
        heading: `Round ${round}`,
        detail: `${labelOf(leader)} reaches a majority with ${leaderVotes} of ${total} votes.`,
      });
      break;
    }

    // Eliminate the lowest; break ties toward the later sort order.
    let minVotes = Infinity;
    active.forEach((id) => {
      const c = counts.get(id) ?? 0;
      if (c < minVotes) minVotes = c;
    });
    const lowest = [...active].filter((id) => (counts.get(id) ?? 0) === minVotes);
    const eliminated = lowest.sort((a, b) => idxOf(b) - idxOf(a))[0];
    active.delete(eliminated);
    eliminationOrder.push(eliminated);
    steps.push({
      heading: `Round ${round}`,
      detail: `No majority yet. ${labelOf(eliminated)} is eliminated with ${plural(
        minVotes,
        'vote',
      )}; those ballots transfer to their next choice.`,
    });
  }

  if (!winnerId) winnerId = [...active][0] ?? null;
  const orderedIds = winnerId
    ? [winnerId, ...eliminationOrder.slice().reverse()]
    : eliminationOrder.slice().reverse();
  const ranking = rankFromOrder(options, orderedIds);
  const winnerSet = new Set(winnerId ? [winnerId] : []);
  const bars: ChartBar[] = options.map((opt, i) => ({
    optionId: opt.id,
    label: opt.label,
    value: firstRoundCounts[i],
    isWinner: winnerSet.has(opt.id),
  }));

  return {
    method: 'irv',
    winnerIds: winnerId ? [winnerId] : [],
    ranking,
    chart: { title: 'First-choice votes (round 1)', unit: 'votes', bars },
    steps,
    pairwise: null,
  };
}

function tabulateIrBorda(options: EngineOption[], ballots: EngineBallot[]): ResultsComputation {
  const active = new Set(options.map((o) => o.id));
  const labelOf = (id: string) => options.find((o) => o.id === id)?.label ?? id;
  const idxOf = (id: string) => options.findIndex((o) => o.id === id);
  const eliminationOrder: string[] = [];
  const steps: ExplainStep[] = [];
  let round = 0;

  while (active.size > 1) {
    round++;
    const scores = bordaPoints(options, ballots, active);
    let minScore = Infinity;
    active.forEach((id) => {
      const s = scores[idxOf(id)];
      if (s < minScore) minScore = s;
    });
    const lowest = [...active].filter((id) => scores[idxOf(id)] === minScore);
    const eliminated = lowest.sort((a, b) => idxOf(b) - idxOf(a))[0];
    active.delete(eliminated);
    eliminationOrder.push(eliminated);
    steps.push({
      heading: `Round ${round}`,
      detail: `Borda points are recalculated among the ${
        active.size + 1
      } remaining options; ${labelOf(eliminated)} scores lowest (${minScore}) and is eliminated.`,
    });
  }

  const winnerId = [...active][0] ?? null;
  const orderedIds = winnerId
    ? [winnerId, ...eliminationOrder.slice().reverse()]
    : eliminationOrder.slice().reverse();
  const ranking = rankFromOrder(options, orderedIds);
  const fullPoints = bordaPoints(options, ballots);
  const winnerSet = new Set(winnerId ? [winnerId] : []);
  const bars: ChartBar[] = options.map((opt, i) => ({
    optionId: opt.id,
    label: opt.label,
    value: fullPoints[i],
    isWinner: winnerSet.has(opt.id),
  }));

  return {
    method: 'ir_borda',
    winnerIds: winnerId ? [winnerId] : [],
    ranking,
    chart: { title: 'Borda points (all options)', unit: 'points', bars },
    steps,
    pairwise: null,
  };
}

function tabulateLeastWorst(options: EngineOption[], ballots: EngineBallot[]): ResultsComputation {
  const pairwise = buildPairwise(options, ballots);
  const { matrix } = pairwise;
  const n = options.length;

  const worstDefeat = options.map((_, i) => {
    let worst = 0;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      if (matrix[j][i] > matrix[i][j]) worst = Math.max(worst, matrix[j][i]);
    }
    return worst;
  });

  const { ranking, winnerIds } = rankByScore(options, worstDefeat, false);
  const winnerSet = new Set(winnerIds);
  const condorcet = options.find((_, i) => worstDefeat[i] === 0 && winnerSet.has(options[i].id));
  const steps: ExplainStep[] = [
    {
      heading: 'Compare every pair head-to-head',
      detail: 'Each option is matched against every other based on how voters ranked them.',
    },
  ];
  if (condorcet) {
    steps.push({
      heading: 'Condorcet winner',
      detail: `${condorcet.label} beats every other option head-to-head, so it wins outright.`,
    });
  } else {
    const top = ranking[0];
    const idx = options.findIndex((o) => o.id === top.optionId);
    steps.push({
      heading: 'Smallest worst defeat wins',
      detail: `No option beats all others. ${top.label} has the least bad worst-case defeat (${worstDefeat[idx]} votes against), so it wins.`,
    });
  }

  return {
    method: 'least_worst',
    winnerIds,
    ranking,
    chart: { title: 'Head-to-head wins', unit: 'wins', bars: pairwiseWinBars(pairwise, winnerSet) },
    steps,
    pairwise,
  };
}

function tabulateRankedPairs(options: EngineOption[], ballots: EngineBallot[]): ResultsComputation {
  const pairwise = buildPairwise(options, ballots);
  const { matrix } = pairwise;
  const n = options.length;
  const idxOf = (id: string) => options.findIndex((o) => o.id === id);

  type Pair = { winner: number; loser: number; margin: number };
  const pairs: Pair[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const margin = matrix[i][j] - matrix[j][i];
      if (margin > 0) pairs.push({ winner: i, loser: j, margin });
      else if (margin < 0) pairs.push({ winner: j, loser: i, margin: -margin });
      // margin === 0: tied pair, not locked
    }
  }
  pairs.sort((a, b) => {
    if (b.margin !== a.margin) return b.margin - a.margin;
    if (a.winner !== b.winner) return a.winner - b.winner;
    return a.loser - b.loser;
  });

  const edges: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  const canReach = (from: number, to: number): boolean => {
    const stack = [from];
    const seen = new Set<number>();
    while (stack.length) {
      const node = stack.pop() as number;
      if (node === to) return true;
      if (seen.has(node)) continue;
      seen.add(node);
      edges[node].forEach((next) => stack.push(next));
    }
    return false;
  };

  const steps: ExplainStep[] = [
    {
      heading: 'Rank pairwise victories by margin',
      detail: 'Every head-to-head matchup is sorted from the largest margin of victory to the smallest.',
    },
  ];
  for (const pair of pairs) {
    if (canReach(pair.loser, pair.winner)) {
      steps.push({
        heading: 'Skip',
        detail: `${options[pair.winner].label} over ${options[pair.loser].label} (margin ${pair.margin}) would create a cycle, so it is skipped.`,
      });
    } else {
      edges[pair.winner].add(pair.loser);
      steps.push({
        heading: 'Lock',
        detail: `${options[pair.winner].label} over ${options[pair.loser].label} (margin ${pair.margin}).`,
      });
    }
  }

  // Topological order over locked edges; break ties by sort order.
  const indegree = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) for (const j of edges[i]) indegree[j]++;
  const available: number[] = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) available.push(i);
  const orderIdx: number[] = [];
  const remainingIndegree = [...indegree];
  while (available.length) {
    available.sort((a, b) => a - b);
    const node = available.shift() as number;
    orderIdx.push(node);
    for (const next of edges[node]) {
      remainingIndegree[next]--;
      if (remainingIndegree[next] === 0) available.push(next);
    }
  }
  // Fallback for any unresolved nodes (shouldn't happen with an acyclic lock set).
  for (let i = 0; i < n; i++) if (!orderIdx.includes(i)) orderIdx.push(i);

  const orderedIds = orderIdx.map((i) => options[i].id);
  const ranking = rankFromOrder(options, orderedIds);
  const winnerId = orderedIds[0] ?? null;
  const winnerSet = new Set(winnerId ? [winnerId] : []);
  if (winnerId) {
    steps.push({
      heading: 'Winner',
      detail: `${options[idxOf(winnerId)].label} sits at the top of the locked ranking.`,
    });
  }

  return {
    method: 'ranked_pairs',
    winnerIds: winnerId ? [winnerId] : [],
    ranking,
    chart: { title: 'Head-to-head wins', unit: 'wins', bars: pairwiseWinBars(pairwise, winnerSet) },
    steps,
    pairwise,
  };
}

// -----------------------------------------------------------------------------
// Public entry point
// -----------------------------------------------------------------------------

export function tabulate(
  method: VotingMethodValue,
  options: EngineOption[],
  ballots: EngineBallot[],
): ResultsComputation | null {
  if (options.length === 0 || ballots.length === 0) return null;
  switch (method) {
    case 'single_plurality':
      return tabulatePlurality(options, ballots);
    case 'borda':
      return tabulateBorda(options, ballots);
    case 'irv':
      return tabulateIrv(options, ballots);
    case 'ir_borda':
      return tabulateIrBorda(options, ballots);
    case 'least_worst':
      return tabulateLeastWorst(options, ballots);
    case 'ranked_pairs':
      return tabulateRankedPairs(options, ballots);
    default:
      return null;
  }
}

export function winnerLabels(computation: ResultsComputation | null): string[] {
  if (!computation) return [];
  const byId = new Map(computation.ranking.map((r) => [r.optionId, r.label] as const));
  return computation.winnerIds.map((id) => byId.get(id) ?? id);
}
