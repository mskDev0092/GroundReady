"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/types";
import { CATEGORY_ORDER, SCENARIOS, isUnlocked } from "@/data/scenarios";
import type { ScenarioCategory, ScenarioProgress } from "@/lib/types";
import { Lock, Play, RotateCcw, Star } from "lucide-react";

export function ScenariosView({
  progress,
  onStart,
}: {
  progress: Record<string, ScenarioProgress>;
  onStart: (id: string) => void;
}) {
  const [filter, setFilter] = useState<ScenarioCategory | "all">("all");

  const list = useMemo(
    () => (filter === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.category === filter)),
    [filter],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Scenario Catalog</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          IATA 2026 · GACA · SAPS SOPs — five counter-to-gate drills. Modules unlock in order.
        </p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as ScenarioCategory | "all")}>
        <TabsList className="h-9 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          {CATEGORY_ORDER.map((c) => (
            <TabsTrigger key={c} value={c} className="text-xs">
              {CATEGORY_META[c].label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((s) => {
          const p = progress[s.id];
          const unlocked = isUnlocked(s, progress);
          const meta = CATEGORY_META[s.category];
          return (
            <div
              key={s.id}
              className={cn(
                "flex flex-col rounded-xl border bg-card/60 p-4 transition",
                unlocked && "hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.07)]",
                !unlocked && "opacity-75",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {meta.short} · M{s.moduleNo}
                  </Badge>
                  <span className="flex items-center gap-0.5" aria-label={`difficulty ${s.difficulty}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < s.difficulty ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
                        )}
                      />
                    ))}
                  </span>
                </div>
                {p?.completed ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      p.bestAccuracy >= 90
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-600"
                        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
                    )}
                  >
                    {p.bestAccuracy >= 90 ? "MASTERED" : `BEST ${p.bestAccuracy}%`}
                  </Badge>
                ) : unlocked ? (
                  <Badge variant="outline" className="text-[10px]">NEW</Badge>
                ) : (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>

              <h3 className="mt-3 text-[15px] font-semibold leading-tight">{s.title}</h3>
              <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                {s.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {s.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {s.minutes} MIN · {s.xpBase} XP
                </span>
                {unlocked ? (
                  <Button size="sm" className="h-7 gap-1 text-[11px]" onClick={() => onStart(s.id)}>
                    {p?.completed ? <RotateCcw className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    {p?.completed ? "Replay" : "Start"}
                  </Button>
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    Finish Module {s.moduleNo - 1} to unlock
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
