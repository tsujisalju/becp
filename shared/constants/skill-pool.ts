// ─────────────────────────────────────────────────────────────────────────────
// BECP Predefined Skill Pool
// Single source of truth for all skill tags available on the platform.
// Used by the credential type form (organizer) and the skill dashboard (student).
// ─────────────────────────────────────────────────────────────────────────────

import { SkillCategory, SkillTag } from '../types/credential'

export const SKILL_POOL: (SkillTag & { category: SkillCategory })[] = [
  // Technical
  { id: 'fullstack-dev',  label: 'Full-Stack Development',    category: 'technical',   weight: 8 },
  { id: 'frontend-dev',   label: 'Frontend Development',      category: 'technical',   weight: 7 },
  { id: 'backend-dev',    label: 'Backend Development',       category: 'technical',   weight: 7 },
  { id: 'blockchain-dev', label: 'Blockchain Development',    category: 'technical',   weight: 9 },
  { id: 'data-analysis',  label: 'Data Analysis',             category: 'technical',   weight: 7 },
  { id: 'cybersecurity',  label: 'Cybersecurity',             category: 'technical',   weight: 8 },
  { id: 'cloud-devops',   label: 'Cloud & DevOps',            category: 'technical',   weight: 7 },
  { id: 'ui-ux-design',   label: 'UI/UX Design',              category: 'technical',   weight: 6 },
  // Soft
  { id: 'teamwork',         label: 'Teamwork & Collaboration', category: 'soft',       weight: 7 },
  { id: 'communication',    label: 'Communication',            category: 'soft',       weight: 6 },
  { id: 'problem-solving',  label: 'Problem Solving',          category: 'soft',       weight: 8 },
  { id: 'time-management',  label: 'Time Management',          category: 'soft',       weight: 6 },
  { id: 'adaptability',     label: 'Adaptability',             category: 'soft',       weight: 5 },
  { id: 'critical-thinking',label: 'Critical Thinking',        category: 'soft',       weight: 7 },
  // Leadership
  { id: 'project-management', label: 'Project Management', category: 'leadership',    weight: 8 },
  { id: 'public-speaking',    label: 'Public Speaking',    category: 'leadership',    weight: 7 },
  { id: 'mentoring',          label: 'Mentoring',          category: 'leadership',    weight: 7 },
  { id: 'event-management',   label: 'Event Management',   category: 'leadership',    weight: 6 },
  // Creative
  { id: 'content-creation', label: 'Content Creation', category: 'creative',          weight: 6 },
  { id: 'graphic-design',   label: 'Graphic Design',   category: 'creative',          weight: 6 },
  // Domain
  { id: 'entrepreneurship', label: 'Entrepreneurship',         category: 'domain',    weight: 8 },
  { id: 'research',         label: 'Research & Documentation', category: 'domain',    weight: 7 },
  { id: 'sustainability',   label: 'Sustainability',           category: 'domain',    weight: 6 },
]

/** Fast O(1) lookup by skill ID */
export const SKILL_POOL_BY_ID: Map<string, (typeof SKILL_POOL)[number]> = new Map(
  SKILL_POOL.map((s) => [s.id, s])
)
