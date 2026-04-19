export const VOTING_METHODS = [
  { value: 'ranked_pairs', label: 'Ranked Pairs' },
  { value: 'irv', label: 'Instant Runoff Voting (IRV)' },
  { value: 'single_plurality', label: 'Single Vote Plurality' },
  { value: 'borda', label: 'Borda Count' },
  { value: 'ir_borda', label: 'Instant Runoff Borda Count' },
  { value: 'least_worst', label: 'Least Worst Defeat' },
] as const;

export type VotingMethodValue = (typeof VOTING_METHODS)[number]['value'];
