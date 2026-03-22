"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/dashboard/skill-progress-chart.tsx
// Description      : Recharts bar chart visualising the student's aggregated skill scores.
//                    Each bar is coloured by the skill's current level (Beginner → Expert)
//                    and a reference line marks the next level threshold.
//                    Rendered inside the dashboard overview Skill Progress card.
// First Written on : Thursday, 20-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026
//

import { AggregatedSkillScore } from "@/hooks/useStudentCredentials";
import { SKILL_LEVELS } from "@becp/shared";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, BarProps, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

type ChartEntry = AggregatedSkillScore & {
  score: number;
  name: string;
  skillKey: string;
};

interface TooltipPayloadItem {
  payload: AggregatedSkillScore & { score: number };
}

function SkillTooltipContent({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const levelCfg = SKILL_LEVELS[d.level];

  return (
    <div className="grid min-w-40 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">{d.skill.label}</p>
      <p className="text-muted-foreground capitalize">{d.skill.category} skill</p>
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

interface SkillProgressChartProps {
  skillScores: AggregatedSkillScore[];
  maxSkills?: number;
}

export function SkillProgressChart({ skillScores, maxSkills = 8 }: SkillProgressChartProps) {
  const data: ChartEntry[] = skillScores.slice(0, maxSkills).map((s) => ({
    ...s,
    score: Math.round(s.totalScore),
    name: s.skill.label.length > 14 ? s.skill.label.slice(0, 13) + "..." : s.skill.label,
    skillKey: s.skill.id.replace(/[^a-z0-9-]/gi, "-"),
  }));

  if (data.length === 0) return null;

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((entry) => [
      entry.skillKey,
      {
        label: entry.skill.label,
        color: SKILL_LEVELS[entry.level].color,
      },
    ]),
  );

  const barShape = (props: BarProps) => {
    const { x, y, width, height, index } = props;
    const entry = data[index as number];
    const fill = entry ? `var(--color-${entry.skillKey})` : "hsl(var(--muted))";
    return <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.9} rx={4} ry={4} />;
  };

  const refLineValue = data[0].nextLevelThreshold ?? undefined;

  return (
    <ChartContainer config={chartConfig} className="h-65 w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={28}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <ChartTooltip content={<SkillTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
        {refLineValue && (
          <ReferenceLine
            y={refLineValue}
            stroke="hsl(var(--mutef-foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{
              value: "Next Level",
              fontSize: 10,
              fill: "hsl(--var(--muted-foreground))",
              position: "insideTopRight",
            }}
          />
        )}
        <Bar dataKey="score" shape={barShape} />
      </BarChart>
    </ChartContainer>
  );
}
