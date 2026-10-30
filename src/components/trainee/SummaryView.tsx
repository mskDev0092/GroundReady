"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChecklistWidget } from "./ChecklistWidget";
import { cn } from "@/lib/utils";
import type { Scenario, ScenarioResult } from "@/lib/types";
import { badgeById } from "@/data/gamification";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Home,
  RotateCcw,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

function AccuracyRing({ pct }: { pct: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setShown((s) => {
        const nextVal = s + 2;
        if (nextVal >= pct) {
          clearInterval(iv);
          return pct;
        }
        return nextVal;
      });
    }, 16);
    return () => clearInterval(iv);
  }, [pct]);

  const r = 52;
  const circ = 2 * Math.PI * r;
  const color = pct >= 90 ? "#f59e0b" : pct >= 80 ? "#10b981" : pct >= 60 ? "#f97316" : "#ef4444";

  return (
    <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`Accuracy ${pct} percent`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="9" className="text-muted" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (circ * shown) / 100}
          className="transition-all"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold">{pct}%</span>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Accuracy</span>
      </div>
    </div>
  );
}

export function SummaryView({
  result,
  scenario,
  hasNext,
  onRetry,
  onNext,
  onDashboard,
}: {
  result: ScenarioResult;
  scenario: Scenario;
  hasNext: boolean;
  onRetry: () => void;
  onNext: () => void;
  onDashboard: () => void;
}) {
  const badge = result.badgeUnlocked ? badgeById(result.badgeUnlocked) : undefined;
  const grade =
    result.accuracy >= 90
      ? "MASTERED"
      : result.accuracy >= 80
        ? "PASS — SOP CLEAN"
        : result.accuracy >= 60
          ? "CONDITIONAL PASS"
          : "RETRAIN REQUIRED";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="rounded-xl border bg-card/70 p-5">
        <div className="flex flex-wrap items-center gap-5">
          <AccuracyRing pct={result.accuracy} />
          <div className="min-w-0 flex-1">
            <Badge variant="outline" className="font-mono text-[10px]">
              {scenario.code} · DEBRIEF
            </Badge>
            <h1 className="mt-1.5 text-xl font-bold tracking-tight">{scenario.title}</h1>
            <p
              className={cn(
                "mt-1 text-sm font-semibold",
                result.accuracy >= 80 ? "text-emerald-500" : "text-amber-500",
              )}
            >
              {grade}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-emerald-500" /> +{result.xpAwarded} XP
              </span>
              <span className="flex items-center gap-1">
                <Timer className="h-3 w-3" /> {Math.floor(result.durationSec / 60)}:
                {String(result.durationSec % 60).padStart(2, "0")}
              </span>
              <span>
                {result.earned}/{result.total} PTS · HINTS {result.hintsUsed}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border bg-background/50 p-3 font-mono text-[11px]">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Base XP</p>
            <p className="font-bold">{Math.round((scenario.xpBase * result.accuracy) / 100)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Speed bonus</p>
            <p className={cn("font-bold", result.speedBonus > 0 ? "text-emerald-500" : "text-muted-foreground")}>
              +{result.speedBonus}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="font-bold text-emerald-500">{result.xpAwarded} XP</p>
          </div>
        </div>
      </div>

      {badge && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
          <span className="text-3xl" aria-hidden>{badge.icon}</span>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
              <Trophy className="h-4 w-4" /> Badge unlocked — {badge.name}
            </p>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80">{badge.description}</p>
          </div>
        </div>
      )}

      {/* mistakes */}
      <div className="rounded-xl border bg-card/70 p-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
          {result.mistakes.length === 0 ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          {result.mistakes.length === 0
            ? "Clean run — zero SOP deviations"
            : `Coaching notes (${result.mistakes.length})`}
        </h2>
        {result.mistakes.length === 0 ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Every dialogue, decision and Altéa entry matched best practice. The Duty Supervisor
            has nothing to add.
          </p>
        ) : (
          <ul className="space-y-2">
            {result.mistakes.map((m, i) => (
              <li key={i} className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2">
                <p className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                  {m.title} {m.pointsLost > 0 && `· −${m.pointsLost} PTS`}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{m.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* rule references */}
      <div className="rounded-xl border bg-card/70 p-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
          <BookOpenText className="h-4 w-4 text-emerald-500" /> IATA / GACA / SAPS references
        </h2>
        <div className="space-y-2">
          {scenario.debriefRules.map((r, i) => (
            <div key={i} className="rounded-md border bg-background/50 px-3 py-2">
              <p className="text-[11px] font-semibold">
                {r.source} <span className="font-mono text-[10px] text-muted-foreground">— {r.ref}</span>
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <ChecklistWidget scenario={scenario} />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="outline" className="gap-1.5" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" /> Retry scenario
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5" onClick={onDashboard}>
            <Home className="h-4 w-4" /> Dashboard
          </Button>
          {hasNext && (
            <Button className="gap-1.5" onClick={onNext}>
              Next module <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
