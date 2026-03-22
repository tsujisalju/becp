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
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TooltipPayloadItem {
  payload: AggregatedSkillScore & { score: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const levelCfg = SKILL_LEVELS[d.level];

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm space-y-1 min-w-45">
      <p className="font-semibold">{d.skill.label}</p>
      <p className="text-muted-foreground capitalize">{d.skill.category} skill</p>
      <div className="flex items-center gap-1.5">
        <span className={`size-2 rounded-full ${levelCfg.color}`} />
        <span className={`font-medium ${levelCfg.color}`}>{levelCfg.label}</span>
        <span className="text-muted-foreground">— {Math.round(d.totalScore)} pts</span>
      </div>
      {d.nextLevelThreshold !== null && (
        <p>
          {d.nextLevelThreshold - Math.round(d.totalScore)} pts to next level ({d.progressPercent}%)
        </p>
      )}
      <p className="text-xs text-muted-foreground">
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
  const data = skillScores.slice(0, maxSkills).map((s) => ({
    ...s,
    score: Math.round(s.totalScore),
    name: s.skill.label.length > 14 ? s.skill.label.slice(0, 13) + "..." : s.skill.label,
  }));

  if (data.length === 0) return null;

  const topSkill = data[0];
  const refLineValue = topSkill.nextLevelThreshold ?? undefined;

  return (
    //TODO: Need to use shadcn chart component (frontend/components/ui/chart.tsx)
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={28}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
        {refLineValue && (
          <ReferenceLine
            y={refLineValue}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{ value: "Next level", fontSize: 10, fill: "hsl(var(--muted-foreground))", position: "insideTopRight" }}
          />
        )}
        <Bar
          dataKey="score"
          radius={[4, 4, 0, 0]}
          shape={(props: { x?: number; y?: number; width?: number; height?: number; index?: number }) => {
            const { x = 0, y = 0, width = 0, height = 0, index = 0 } = props;
            const entry = data[index];
            const fill = entry ? SKILL_LEVELS[entry.level].colorHex : "hsl(var(--muted))";
            return <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.85} rx={4} ry={4} />;
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
