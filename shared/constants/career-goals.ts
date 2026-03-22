// ─────────────────────────────────────────────────────────────────────────────
// BECP Career Goal → Priority Skill IDs
// Maps each career goal option (as defined in profile-edit-form.tsx) to an
// ordered list of skill IDs the student should prioritise. IDs must match
// the predefined skill list in credential-type-form.tsx.
//
// Ordering within each array is intentional — the first skill is the most
// important for that career and will appear first in the bar chart.
//
// This is a static lookup for Phase 3. Phase 4 will replace or augment this
// with AI-driven recommendations inferred from the student's credential history.
// ─────────────────────────────────────────────────────────────────────────────

export type CareerGoal =
  | 'Software Engineer'
  | 'Frontend Engineer'
  | 'Backend Engineer'
  | 'Full-Stack Engineer'
  | 'DevOps / Cloud Engineer'
  | 'Data Scientist / ML Engineer'
  | 'UX / Product Designer'
  | 'Product Manager'
  | 'Cybersecurity Analyst'
  | 'Blockchain Developer'
  | 'Business Analyst'
  | 'Entrepreneur / Founder'
  | 'Academic Researcher'
  | 'Other'

/**
 * Ordered list of priority skill IDs for each career goal.
 * Skills earlier in the array are considered more important for that career.
 */
export const CAREER_GOAL_SKILLS: Record<CareerGoal, string[]> = {
  'Software Engineer': [
    'fullstack-dev',
    'backend-dev',
    'problem-solving',
    'cloud-devops',
    'critical-thinking',
    'project-management',
  ],
  'Frontend Engineer': [
    'frontend-dev',
    'ui-ux-design',
    'fullstack-dev',
    'content-creation',
    'graphic-design',
    'critical-thinking',
  ],
  'Backend Engineer': [
    'backend-dev',
    'fullstack-dev',
    'cloud-devops',
    'cybersecurity',
    'problem-solving',
    'project-management',
  ],
  'Full-Stack Engineer': [
    'fullstack-dev',
    'frontend-dev',
    'backend-dev',
    'cloud-devops',
    'ui-ux-design',
    'problem-solving',
  ],
  'DevOps / Cloud Engineer': [
    'cloud-devops',
    'cybersecurity',
    'backend-dev',
    'project-management',
    'problem-solving',
    'critical-thinking',
  ],
  'Data Scientist / ML Engineer': [
    'data-analysis',
    'research',
    'backend-dev',
    'critical-thinking',
    'problem-solving',
    'communication',
  ],
  'UX / Product Designer': [
    'ui-ux-design',
    'graphic-design',
    'content-creation',
    'communication',
    'critical-thinking',
    'project-management',
  ],
  'Product Manager': [
    'project-management',
    'communication',
    'critical-thinking',
    'public-speaking',
    'data-analysis',
    'entrepreneurship',
  ],
  'Cybersecurity Analyst': [
    'cybersecurity',
    'backend-dev',
    'cloud-devops',
    'critical-thinking',
    'research',
    'problem-solving',
  ],
  'Blockchain Developer': [
    'blockchain-dev',
    'backend-dev',
    'fullstack-dev',
    'cybersecurity',
    'problem-solving',
    'research',
  ],
  'Business Analyst': [
    'data-analysis',
    'communication',
    'critical-thinking',
    'project-management',
    'research',
    'public-speaking',
  ],
  'Entrepreneur / Founder': [
    'entrepreneurship',
    'project-management',
    'public-speaking',
    'communication',
    'content-creation',
    'mentoring',
  ],
  'Academic Researcher': [
    'research',
    'data-analysis',
    'critical-thinking',
    'communication',
    'public-speaking',
    'sustainability',
  ],
  'Other': [],
}

/**
 * Returns the priority skill IDs for a given career goal string.
 * Returns an empty array if the goal is unrecognised or "Other".
 */
export function getPrioritySkillIds(careerGoal: string | undefined): string[] {
  if (!careerGoal) return []
  return CAREER_GOAL_SKILLS[careerGoal as CareerGoal] ?? []
}
