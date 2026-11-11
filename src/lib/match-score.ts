export interface SkillMatchResult {
  skill: string;
  matched: boolean;
  type: "must-have" | "nice-to-have";
}

export interface MatchAnalysis {
  score: number; // 0 to 100
  label: string;
  skills: SkillMatchResult[];
  mustHaveMatched: number;
  mustHaveTotal: number;
  niceToHaveMatched: number;
  niceToHaveTotal: number;
}

/**
 * Calculates a match score between a candidate's skills and a job's requirements.
 * Must-have skills account for 75% of the score.
 * Nice-to-have skills account for 25% of the score.
 */
export function calculateMatchScore(
  candidateSkills: string[] = [],
  mustHaveSkills: string[] = [],
  niceToHaveSkills: string[] = []
): MatchAnalysis {
  const normalizedCandidateSkills = candidateSkills.map((s) =>
    s.trim().toLowerCase()
  );

  const skillResults: SkillMatchResult[] = [];

  let mustHaveMatched = 0;
  for (const skill of mustHaveSkills) {
    const trimmed = skill.trim();
    if (!trimmed) continue;
    const isMatched = normalizedCandidateSkills.some(
      (c) => c === trimmed.toLowerCase() || c.includes(trimmed.toLowerCase()) || trimmed.toLowerCase().includes(c)
    );
    if (isMatched) mustHaveMatched++;
    skillResults.push({
      skill: trimmed,
      matched: isMatched,
      type: "must-have",
    });
  }

  let niceToHaveMatched = 0;
  for (const skill of niceToHaveSkills) {
    const trimmed = skill.trim();
    if (!trimmed) continue;
    const isMatched = normalizedCandidateSkills.some(
      (c) => c === trimmed.toLowerCase() || c.includes(trimmed.toLowerCase()) || trimmed.toLowerCase().includes(c)
    );
    if (isMatched) niceToHaveMatched++;
    skillResults.push({
      skill: trimmed,
      matched: isMatched,
      type: "nice-to-have",
    });
  }

  const mustHaveTotal = mustHaveSkills.filter((s) => s.trim().length > 0).length;
  const niceToHaveTotal = niceToHaveSkills.filter((s) => s.trim().length > 0).length;

  let score = 70; // baseline default if no skills specified on job
  if (mustHaveTotal > 0 && niceToHaveTotal > 0) {
    const mustScore = (mustHaveMatched / mustHaveTotal) * 75;
    const niceScore = (niceToHaveMatched / niceToHaveTotal) * 25;
    score = Math.round(mustScore + niceScore);
  } else if (mustHaveTotal > 0) {
    score = Math.round((mustHaveMatched / mustHaveTotal) * 100);
  } else if (niceToHaveTotal > 0) {
    score = Math.round((niceToHaveMatched / niceToHaveTotal) * 100);
  }

  // Ensure score stays in 0-100
  score = Math.max(0, Math.min(100, score));

  let label = "Fair Match";
  if (score >= 90) label = "Exceptional Match";
  else if (score >= 75) label = "Great Match";
  else if (score >= 50) label = "Good Match";
  else label = "Potential Match";

  return {
    score,
    label,
    skills: skillResults,
    mustHaveMatched,
    mustHaveTotal,
    niceToHaveMatched,
    niceToHaveTotal,
  };
}

