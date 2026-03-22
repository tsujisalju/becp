"use client";

import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AggregatedSkillScore } from "@/hooks/useStudentCredentials";
import { scoreToLevel, SKILL_LEVELS, SKILL_POOL, SKILL_POOL_BY_ID } from "@becp/shared";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/dashboard/soft-skills-radar-chart.tsx
// Description      : Recharts radar chart showing the student's aggregated soft skill scores.
//                    Soft skills are career-agnostic and always shown regardless of career goal.
//                    The radar polygon is normalised against the Expert threshold (700 pts)
//                    so the scale is consistent across all students.
//                    Built with the shadcn ChartContainer for consistent theming.
// First Written on : Sunday, 22-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026

const RADAR_FULL_MARK = SKILL_LEVELS.expert.min;

const ALL_SOFT_SKILLS = SKILL_POOL.filter((s) => s.category === "soft");

function zeroSoftScore(skillId: string): AggregatedSkillScore | null {
  const skill = SKILL_POOL_BY_ID.get(skillId);
  if (!skill) return null;
  return {
    skill,
    totalScore: 0,
    credentialCount: 0,
    level: scoreToLevel(0),
    nextLevelThreshold: SKILL_LEVELS.intermediate.min,
    progressPercent: 0,
  };
}

type RadarEntry = {
  skill: string;
  score: number;
  fullMark: number;
  raw: AggregatedSkillScore;
};

interface TooltipPayloadItem {
  payload: RadarEntry;
}

function SoftSkillTooltipContent({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload.raw;
  const levelCfg = SKILL_LEVELS[d.level];

  return (
    <div className="grid min-w-36 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">{d.skill.label}</p>
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-xs" style={{ backgroundColor: levelCfg.color }} />
        <span className="font-medium">{levelCfg.label}</span>
        <span className="text-muted-foreground font-mono tabular-nums">{Math.round(d.totalScore)} pts</span>
      </div>
      {d.nextLevelThreshold !== null && (
        <p className="text-muted-foreground">
          {d.nextLevelThreshold - Math.round(d.totalScore)} pts to next level
          <span className="ml-1 opacity-70">({d.progressPercent}%)</span>
        </p>
      )}
      <p className="text-muted-foreground">
        From {d.credentialCount} credential{d.credentialCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

interface SoftSkillsRadarChartProps {
  skillScores: AggregatedSkillScore[];
}

export function SoftSkillsRadarChart({ skillScores }: SoftSkillsRadarChartProps) {
  const earnedById = new Map(skillScores.map((s) => [s.skill.id, s]));

  const mergedScores: AggregatedSkillScore[] = ALL_SOFT_SKILLS.map((skill) => {
    return earnedById.get(skill.id) ?? zeroSoftScore(skill.id)!;
  });

  const data: RadarEntry[] = mergedScores.map((s) => ({
    skill: s.skill.label.length > 16 ? s.skill.label.slice(0, 15) + "..." : s.skill.label,
    score: Math.min(Math.round(s.totalScore), RADAR_FULL_MARK),
    fullMark: RADAR_FULL_MARK,
    raw: s,
  }));

  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "var(--text-emerald-400, #34d399)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-65 w-full">
      <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, RADAR_FULL_MARK]} />
        <ChartTooltip content={<SoftSkillTooltipContent />} />
        <Radar
          dataKey="score"
          stroke="hsl(var(--bg-chart-1, 160 84% 39%))"
          fill="hsl(var(--bg-chart-1, 160 84% 39%))"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  );
}
