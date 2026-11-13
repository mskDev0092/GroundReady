"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BADGES, LEVELS, levelFromXp, nextLevel } from "@/data/gamification";
import { SCENARIOS, isUnlocked } from "@/data/scenarios";
import { ACADEMY_QUESTIONS, ACADEMY_TRACKS, overallAccuracy, trackProgress, TRACK_META } from "@/data/academy";
import { paxPathwayProgress } from "@/data/pax";
import type { AcademyStats, ScenarioProgress } from "@/lib/types";
import {
  Award,
  BookOpenText,
  Brain,
  Compass,
  Flame,
  Lock,
  Play,
  Sparkles,
  Star,
  Target,
  Trophy,
} from "lucide-react";

export function DashboardView({
  xp,
  streak,
  badges,
  progress,
  academy,
  newlyUnlocked,
  onClearNew,
  onStart,
  onBrowse,
  onAcademy,
  onPaxPathway,
  onGlossary,
  onTour,
}: {
  xp: number;
  streak: number;
  badges: string[];
  progress: Record<string, ScenarioProgress>;
  academy: AcademyStats;
  newlyUnlocked: string[];
  onClearNew: () => void;
  onStart: (id: string) => void;
  onBrowse: () => void;
  onAcademy: () => void;
  onPaxPathway: () => void;
  onGlossary: () => void;
  onTour: () => void;
}) {
  const level = levelFromXp(xp);
  const next = nextLevel(xp);
  const lvlIdx = LEVELS.findIndex((l) => l.level === level.level);
  const levelSpanEnd = next?.minXp ?? xp;
  const levelSpanStart = level.minXp;
  const pct = next
    ? Math.round(((xp - levelSpanStart) / (levelSpanEnd - levelSpanStart)) * 100)
    : 100;
  const completedCount = useMemo(
    () => Object.values(progress).filter((p) => p.completed).length,
    [progress],
  );
  const academyAccuracy = overallAccuracy(academy);
  const academyTracks = useMemo(
    () =>
      ACADEMY_TRACKS.map((track) => ({
        track,
        meta: TRACK_META[track],
        progress: trackProgress(academy, track),
      })),
    [academy],
  );
  const paxPathway = useMemo(() => paxPathwayProgress(academy), [academy]);
  const nextScenario = SCENARIOS.find(
    (s) => !progress[s.id]?.completed && isUnlocked(s, progress),
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      {newlyUnlocked.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
          <Trophy className="h-6 w-6 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              New badge unlocked!
            </p>
            <p className="truncate text-xs text-amber-700/80 dark:text-amber-400/80">
              {newlyUnlocked
                .map((id) => BADGES.find((b) => b.id === id)?.name)
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={onClearNew}>
            Dismiss
          </Button>
        </div>
      )}

      {xp === 0 && completedCount === 0 && (
        <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            New to the ramp?
          </p>
          <h2 className="mt-0.5 text-base font-bold tracking-tight">
            Start here — you do not need any experience
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Learn the words, drill the rules, then run a shift with the coach beside you. Three
            minutes is enough to begin.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" className="gap-1.5" onClick={onTour}>
              <Sparkles className="h-3.5 w-3.5" /> 60-second tour
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={onAcademy}>
              <Brain className="h-3.5 w-3.5" /> Try 10 questions
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={onGlossary}>
              <BookOpenText className="h-3.5 w-3.5" /> Learn the words
            </Button>
          </div>
        </div>
      )}

      {/* level hero */}
      <div className="rounded-xl border bg-gradient-to-br from-emerald-500/10 via-card to-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Active Duty Status
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Level {level.level} — {level.title}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {next
                ? `${next.minXp - xp} XP to Level ${next.level} — ${next.title} (${pct}% of the way)`
                : "Top of the ladder — the ramp salutes you."}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-emerald-500">{xp}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total XP</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1" aria-hidden>
          {LEVELS.map((l, i) => (
            <span
              key={l.level}
              className={cn(
                "h-1.5 flex-1 rounded-full transition",
                i < lvlIdx ? "bg-emerald-500/70" : i === lvlIdx ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted",
              )}
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
          {LEVELS.map((l, i) => (
            <span key={l.level} className={cn(i === lvlIdx && "font-bold text-emerald-500")}>
              L{i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard icon={<Star className="h-4 w-4 text-amber-500" />} label="Streak" value={`${streak} clean`} />
        <StatCard icon={<Target className="h-4 w-4 text-emerald-500" />} label="Completed" value={`${completedCount}/${SCENARIOS.length}`} />
        <StatCard icon={<Award className="h-4 w-4 text-violet-500" />} label="Badges" value={`${badges.length}/${BADGES.length}`} />
        <StatCard icon={<Brain className="h-4 w-4 text-teal-500" />} label="Drills" value={`${academy.answered.length}/${ACADEMY_QUESTIONS.length}`} />
        <StatCard icon={<Flame className="h-4 w-4 text-red-500" />} label="Career" value={`${Math.round(Object.values(progress).reduce((a, p) => a + p.totalXp, 0))} XP earned`} />
      </div>

      {/* knowledge gym */}
      <div className="rounded-xl border bg-card/60 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Brain className="h-4 w-4 text-emerald-500" /> Knowledge Gym
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {academy.answered.length === 0
                ? "Start with a 10-question drill — every answer teaches the DGR, IGOM, IATA or SAPS rule behind it."
                : `${academy.correct.length} correct from ${academy.answered.length} attempted · ${academyAccuracy}% accuracy · best combo ${academy.bestCombo}.`}
            </p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onAcademy}>
            <Play className="h-3.5 w-3.5" /> Enter the gym
          </Button>
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={onGlossary}>
            <BookOpenText className="h-3.5 w-3.5" /> Words
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {academyTracks.map(({ track, meta, progress: trackStat }) => (
            <div key={track} className="rounded-lg border bg-background/50 px-3 py-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold">
                  <span aria-hidden>{meta.icon}</span> {meta.short}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {trackStat.correct}/{trackStat.total}
                </span>
              </div>
              <Progress value={trackStat.mastery} className="mt-1.5 h-1" />
            </div>
          ))}
        </div>
      </div>

      {/* AHM 1110 passenger pathway */}
      <div className="rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-card to-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Compass className="h-4 w-4 text-sky-500" /> AHM 1110 Passenger Pathway
            </h2>
            <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
              {paxPathway.next
                ? `Next step: ${paxPathway.next.code} — ${paxPathway.next.title}. ${paxPathway.next.tellsTA}`
                : "All 14 modules are at mastery. Replay any step to keep the rules sharp."}
            </p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onPaxPathway}>
            <Play className="h-3.5 w-3.5" /> Open pathway
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Progress value={paxPathway.mastery} className="h-2" />
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {paxPathway.completed}/{paxPathway.modules.length} modules · {paxPathway.mastery}%
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-3">
          {paxPathway.stages.map(({ stage, completed: done, modules: stageModules, mastery }) => (
            <div key={stage} className="rounded-lg border bg-background/50 px-3 py-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold">{stage}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {done}/{stageModules}
                </span>
              </div>
              <Progress value={mastery} className="mt-1.5 h-1" />
            </div>
          ))}
        </div>
      </div>

      {/* badges shelf */}
      <div>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Badge Cabinet
          <span className="font-mono text-[10px] font-normal normal-case tracking-normal">
            {badges.length}/{BADGES.length} earned
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => {
            const owned = badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={cn(
                  "rounded-lg border p-3 transition",
                  owned ? "border-amber-500/40 bg-amber-500/5" : "bg-card/40 opacity-70",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "text-2xl",
                      !owned && "grayscale opacity-40",
                    )}
                    aria-hidden
                  >
                    {b.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight">{b.name}</p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {owned ? b.description : `🔒 ${b.requirement}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* progress list */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Scenario Progress
          </h2>
          <Button size="sm" variant="ghost" className="text-xs" onClick={onBrowse}>
            Browse all
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border">
          {SCENARIOS.map((s, i) => {
            const p = progress[s.id];
            const unlocked = isUnlocked(s, progress);
            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5",
                  i > 0 && "border-t",
                )}
              >
                <Badge variant="outline" className="w-16 shrink-0 justify-center font-mono text-[10px]">
                  M{s.moduleNo}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-[13px] font-medium", !unlocked && "text-muted-foreground")}>
                    {s.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {unlocked
                      ? p
                        ? `Best ${p.bestAccuracy}% · ${p.attempts} attempt${p.attempts > 1 ? "s" : ""} · ${p.totalXp} XP`
                        : "Not attempted"
                      : "Complete the previous module to unlock"}
                  </p>
                </div>
                {p?.completed && p.bestAccuracy >= 90 ? (
                  <Badge className="shrink-0 bg-amber-500/15 text-amber-600 border border-amber-500/30" variant="outline">
                    MASTERED
                  </Badge>
                ) : p?.completed ? (
                  <Badge variant="outline" className="shrink-0">{p.bestAccuracy}%</Badge>
                ) : null}
                {unlocked ? (
                  <Button
                    size="sm"
                    className="h-7 shrink-0 gap-1 text-[11px]"
                    onClick={() => onStart(s.id)}
                  >
                    <Play className="h-3 w-3" />
                    {p?.completed ? "Replay" : "Start"}
                  </Button>
                ) : (
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {nextScenario && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-card to-card p-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Continue training
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold">
              {nextScenario.code} — {nextScenario.title}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
              {nextScenario.minutes} MIN · {nextScenario.xpBase} XP BASE ·{" "}
              {"★".repeat(nextScenario.difficulty)} DIFFICULTY
            </p>
          </div>
          <Button size="lg" className="shrink-0 gap-2" onClick={() => onStart(nextScenario.id)}>
            <Play className="h-4 w-4" /> Start module
          </Button>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-1 font-mono text-lg font-bold">{value}</p>
    </div>
  );
}
