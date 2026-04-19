/** Static copy aligned with Figma education screen (node 3:382). */

export const heroTitle = 'Understanding Voting Methods';

export const heroSubtitle =
  'Different voting systems can produce different outcomes from the same ballots. Learn about ranked-choice voting methods and their properties.';

export const introTitle = 'What is Ranked-Choice Voting?';

export const introParagraphs = [
  `Unlike traditional plurality voting where you pick just one option, ranked-choice voting lets you rank all options from most to least preferred. This captures more information about voter preferences and can lead to outcomes that better reflect the group's true preferences.`,
  'Different methods use these rankings in different ways to determine the winner. Each has its own strengths and satisfies different mathematical properties.',
] as const;

export type MethodSection = {
  title: string;
  lead: string;
  howItWorks: string;
  pros: string;
  cons: string;
};

export const methodSections: MethodSection[] = [
  {
    title: 'Single Vote Plurality',
    lead: `The traditional "first past the post" system. Each voter selects one option, and the option with the most votes wins.`,
    howItWorks: 'Count the first-choice votes. The option with the most first-choice votes wins.',
    pros: 'Simple to understand and implement. Familiar to most voters.',
    cons: `Can elect unpopular winners when votes are split among similar options. Vulnerable to the "spoiler effect."`,
  },
  {
    title: 'Instant Runoff Voting (IRV)',
    lead: 'Also known as the Alternative Vote. This method eliminates the least popular option and redistributes votes until someone has a majority.',
    howItWorks:
      'If no option has a majority of first-choice votes, eliminate the option with the fewest first-choice votes. Those votes transfer to each voter\'s next choice. Repeat until one option has a majority.',
    pros: 'Ensures the winner has majority support. Reduces the spoiler effect.',
    cons: 'Can fail monotonicity (ranking a candidate higher can hurt them). May not elect the Condorcet winner.',
  },
  {
    title: 'Borda Count',
    lead: 'A positional voting system where options receive points based on their position on each ballot.',
    howItWorks:
      'For each ballot, the first choice gets (n-1) points, second choice gets (n-2) points, and so on. The option with the most total points wins.',
    pros: 'Considers all preferences, not just first choices. Often selects consensus candidates.',
    cons: 'Vulnerable to strategic voting. May not elect the Condorcet winner.',
  },
  {
    title: 'Instant Runoff Borda Count',
    lead: 'A hybrid method that combines aspects of IRV and Borda Count.',
    howItWorks:
      'Uses Borda Count scoring but eliminates the lowest-scoring option in each round and recalculates scores until one option has more than half the maximum possible points.',
    pros: 'Combines the consensus-building of Borda with the majority-ensuring of IRV.',
    cons: 'More complex to calculate and explain. Less studied than other methods.',
  },
  {
    title: 'Least Worst Defeat',
    lead: 'A Condorcet method that examines head-to-head matchups between options.',
    howItWorks:
      'Compares each pair of options based on voter rankings. The option whose worst head-to-head defeat is the smallest wins. If an option wins all head-to-head matchups, it wins automatically (Condorcet winner).',
    pros: 'Satisfies the Condorcet criterion. Considers all pairwise preferences.',
    cons: 'Can be complex to calculate and explain to voters.',
  },
  {
    title: 'Ranked Pairs',
    lead: 'A Condorcet method that builds a ranking by considering the strongest pairwise victories first.',
    howItWorks:
      'Compare all pairs of options. Sort pairwise victories by margin of victory. Lock in victories from strongest to weakest, skipping any that would create a cycle. The option at the top of this ranking wins.',
    pros: 'Satisfies the Condorcet criterion and independence of clones. Highly resistant to strategic voting.',
    cons: 'Most complex to calculate. Requires understanding of directed graphs and cycles.',
  },
];

export type CriterionBlock = { title: string; body: string };

export const criteriaBlocks: CriterionBlock[] = [
  {
    title: 'Universality',
    body: 'The method always produces a winner for any set of valid ballots.',
  },
  {
    title: 'Monotonicity',
    body: 'Ranking a candidate higher on your ballot can never hurt them, and ranking them lower can never help them.',
  },
  {
    title: 'Condorcet Criterion',
    body: 'If there is a candidate who would win every head-to-head matchup against all other candidates, that candidate should win.',
  },
  {
    title: 'Independence of Irrelevant Alternatives',
    body: `Adding or removing a losing candidate should not change the winner. This helps prevent the "spoiler effect."`,
  },
];

export type ComparisonRow = {
  method: string;
  universality: boolean;
  monotonicity: boolean;
  condorcet: boolean;
  iia: boolean;
};

/** Check = satisfies / generally yes; X = fails or notable limitation (per Figma). */
export const comparisonRows: ComparisonRow[] = [
  { method: 'Plurality', universality: true, monotonicity: true, condorcet: false, iia: false },
  { method: 'IRV', universality: true, monotonicity: false, condorcet: false, iia: false },
  { method: 'Borda Count', universality: true, monotonicity: true, condorcet: false, iia: false },
  { method: 'IRV-Borda', universality: true, monotonicity: false, condorcet: false, iia: false },
  { method: 'Least Worst Defeat', universality: true, monotonicity: true, condorcet: true, iia: false },
  { method: 'Ranked Pairs', universality: true, monotonicity: true, condorcet: true, iia: false },
];

export const furtherReadingTitle = 'Further Reading';

export const furtherReadingBullets = [
  "Arrow's Impossibility Theorem explains why no voting system can satisfy all desirable properties simultaneously.",
  'The Stanford Encyclopedia of Philosophy has extensive articles on voting theory and social choice.',
  'FairVote.org provides resources on ranked-choice voting implementation and research.',
] as const;
