"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getScenario } from "@/data/scenarios";
import {
  PAX_MASTERY_THRESHOLD,
  PAX_MODULES,
  paxModuleProgress,
  paxPathwayProgress,
} from "@/data/pax";
import type { AcademyStats, PaxModuleCode } from "@/lib/types";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Flag,
  GraduationCap,
  Play,
  ShieldCheck,
  Target,
} from "lucide-react";

/**
 * AHM 1110 passenger pathway — a guided map of the 14 module syllabus.
 * Each card links to a dedicated drill and to the scenario that practises the
 * same competency. Training only; always read alongside current operator SOPs.
 */
export function PaxPathway({
  academy,
  onDrill,
  onStartScenario,
}: {
  academy: AcademyStats;
  onDrill: (code: PaxModuleCode) => void;
  onStartScenario: (id: string) => void;
}) {
  const pathway = useMemo(() => paxPathwayProgress(academy), [academy]);
  const [expanded, setExpanded] = useState<PaxModuleCode | null>(
    pathway.next?.code ?? null,
  );

  const nextProgress = pathway.next
    ? paxModuleProgress(academy, pathway.next.code)
    : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="rounded-xl border bg-gradient-to-br from-sky-500/10 via-card to-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              IATA AHM 1110 · Passenger Handling Pathway
            </p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Compass className="h-6 w-6 text-sky-500" /> From terminal door to aircraft door.
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              Fourteen modules, one pathway. Learn what each AHM designation covers, why it
              matters to a traffic assistant, and drill the rules that keep passengers safe and
              compliant.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-sky-500">{pathway.mastery}%</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Pathway mastery
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <PathStat
            icon={<Flag className="h-3.5 w-3.5 text-sky-500" />}
            label="Modules complete"
            value={`${pathway.completed}/${PAX_MODULES.length}`}
          />
          <PathStat
            icon={<Target className="h-3.5 w-3.5 text-emerald-500" />}
            label="Questions mastered"
            value={`${pathway.correct}/${pathway.total}`}
          />
          <PathStat
            icon={<BookOpenCheck className="h-3.5 w-3.5 text-violet-500" />}
            label="Attempted"
            value={`${pathway.answered}/${pathway.total}`}
          />
          <PathStat
            icon={<ShieldCheck className="h-3.5 w-3.5 text-amber-500" />}
            label="Step threshold"
            value={`${PAX_MASTERY_THRESHOLD}%`}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {pathway.next ? (
            <Button className="gap-1.5" onClick={() => onDrill(pathway.next!.code)}>
              <Play className="h-4 w-4" /> Continue: {pathway.next.code}
            </Button>
          ) : (
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              <GraduationCap className="h-4 w-4" /> Pathway complete — every module drilled
            </Badge>
          )}
          <p className="text-[11px] text-muted-foreground">
            {pathway.next
              ? `${nextProgress?.mastery ?? 0}% of ${pathway.next.code} mastered.`
              : "Replay any module to keep the reflexes sharp."}
          </p>
        </div>
      </div>

      {pathway.stages.map(({ stage, correct: stageCorrect, total: stageTotal, mastery: stageMastery }) => {
        const modules = pathway.modules.filter((entry) => entry.module.stage === stage);

        return (
          <section key={stage} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {stage}
              </h2>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground">
                {stageCorrect}/{stageTotal} · {stageMastery}%
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {modules.map(({ module, total, answered, correct, mastery, complete }) => {
                const isOpen = expanded === module.code;
                return (
                  <div
                    key={module.code}
                    className={cn(
                      "flex flex-col rounded-xl border bg-card/60 p-4 transition",
                      complete && "border-emerald-500/40 bg-emerald-500/5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden>
                          {module.icon}
                        </span>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-sky-600 dark:text-sky-400">
                            {module.code} · {module.track}
                          </p>
                          <h3 className="text-sm font-semibold leading-tight">{module.title}</h3>
                        </div>
                      </div>
                      {complete ? (
                        <Badge
                          variant="outline"
                          className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
                        >
                          <CheckCircle2 className="h-3 w-3" /> DONE
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          {mastery}%
                        </Badge>
                      )}
                    </div>

                    <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {module.covers}
                    </p>

                    <Progress value={mastery} className="mt-3 h-1.5" />
                    <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                      <span>
                        {correct}/{total} mastered
                      </span>
                      <span>{answered} attempted</span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant={complete ? "outline" : "default"}
                        className="h-7 gap-1 text-[11px]"
                        onClick={() => onDrill(module.code)}
                      >
                        <Play className="h-3 w-3" /> {complete ? "Replay drill" : "Drill module"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-[11px]"
                        onClick={() => setExpanded(isOpen ? null : module.code)}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? (
                          <>
                            Hide detail <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            Why it matters <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </Button>
                    </div>

                    {isOpen && (
                      <div className="mt-3 rounded-lg border bg-background/60 p-3">
                        <p className="text-[11px] leading-relaxed text-foreground">
                          <span className="font-semibold">What it tells a T/A: </span>
                          {module.tellsTA}
                        </p>
                        <ul className="mt-2 space-y-1">
                          {module.keyRules.map((rule) => (
                            <li
                              key={rule}
                              className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground"
                            >
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                        {module.scenarioIds.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {module.scenarioIds.map((scenarioId) => {
                              const scenario = getScenario(scenarioId);
                              if (!scenario) return null;
                              return (
                                <Button
                                  key={scenarioId}
                                  size="sm"
                                  variant="outline"
                                  className="h-7 gap-1 text-[10px]"
                                  onClick={() => onStartScenario(scenarioId)}
                                >
                                  <Play className="h-3 w-3" />
                                  {scenario.code} — {scenario.title}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="rounded-xl border bg-card/40 p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <BookOpenCheck className="h-4 w-4 text-sky-500" /> How the pathway works
        </h2>
        <div className="mt-2 grid gap-2 text-xs leading-relaxed text-muted-foreground sm:grid-cols-3">
          <p>
            <span className="font-semibold text-foreground">One step at a time.</span> Each module
            mixes new AHM questions with existing Knowledge Gym drills on the same competency.
          </p>
          <p>
            <span className="font-semibold text-foreground">Mastery, not clicks.</span> A module is
            complete at {PAX_MASTERY_THRESHOLD}% correct. Replaying it keeps the rule fresh.
          </p>
          <p>
            <span className="font-semibold text-foreground">Training only.</span> AHM 1110 is the
            syllabus map — the current operator manual, carrier rules and station SOP always win.
          </p>
        </div>
        <p className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
          <ArrowRight className="h-3 w-3" /> Use the Gym tab for free drills; use the pathway when
          you want a structured AHM walk-through.
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Local numbering may split PAX 09/10 or add PAX 15 — follow your operator&apos;s approved
          syllabus.
        </p>
      </div>
    </div>
  );
}

function PathStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background/50 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-0.5 font-mono text-sm font-bold">{value}</p>
    </div>
  );
}
