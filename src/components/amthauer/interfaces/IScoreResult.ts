export interface IScoreResult {
  id?: number;
  session: number;
  raw_score: number | null;
  standardized_score: number | null;
  percentile_rank: number | null;
  time_taken_seconds: number | null;
}
