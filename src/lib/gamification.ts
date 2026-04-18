import { TRUST_LEVELS, KARMA_POINTS } from "./constants";

export type TrustLevel = keyof typeof TRUST_LEVELS;

export function computeTrustLevel(karma: number): TrustLevel {
  const entries = Object.entries(TRUST_LEVELS) as Array<[TrustLevel, (typeof TRUST_LEVELS)[TrustLevel]]>;
  let current: TrustLevel = "new";
  for (const [key, info] of entries) {
    if (karma >= info.minKarma) current = key;
  }
  return current;
}

/**
 * Reddit hot score 알고리즘 (단순화 버전). 서버 cron 또는 쓰기 트리거에서 호출.
 */
export function hotScore(voteScore: number, createdAtMs: number): number {
  const order = Math.log10(Math.max(Math.abs(voteScore), 1));
  const sign = voteScore > 0 ? 1 : voteScore < 0 ? -1 : 0;
  const seconds = createdAtMs / 1000 - 1_704_067_200; // 2024-01-01
  return Math.round((sign * order + seconds / 45_000) * 1e7) / 1e7;
}

export function karmaDelta(action: keyof typeof KARMA_POINTS): number {
  return KARMA_POINTS[action];
}
