"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogueFeed } from "./DialogueFeed";
import { PassengerPanel } from "./PassengerPanel";
import { Terminal, type TermLine } from "./Terminal";
import { ActionBar } from "./ActionBar";
import { ChecklistWidget } from "./ChecklistWidget";
import { SpeakButton } from "./SpeakButton";
import { sfx } from "@/lib/sound";
import { useUserStore } from "@/store/useUserStore";
import {
  commandPoints,
  evaluateEntry,
  GENERIC_COMMANDS,
  type CommandAttemptState,
} from "@/lib/altea";
import { scenarioMaxPoints } from "@/data/scenarios";
import { buildScenarioResult } from "@/lib/scoring";
import type {
  ChatMessage,
  DecisionOption,
  DialogueOption,
  MistakeEntry,
  Scenario,
  ScenarioResult,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Clock, Flag, Gauge, Star, Wand2, X } from "lucide-react";

type Phase = "briefing" | "running" | "done";

const BOOT: TermLine[] = [
  { kind: "ok", text: "ALTÉA DCS — TRAINING SANDBOX v4.2" },
  { kind: "output", text: "CARRIER PK  STATION LHE  DATE 24OCT" },
  { kind: "sys", text: "TYPE HELP FOR THE COMMAND LIST · TAB COMPLETES" },
];

export function SimView({
  scenario,
  soundEnabled,
  onFinish,
  onQuit,
}: {
  scenario: Scenario;
  soundEnabled: boolean;
  onFinish: (result: ScenarioResult) => void;
  onQuit: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [stepIdx, setStepIdx] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [earned, setEarned] = useState(0);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [cmdStates, setCmdStates] = useState<Record<string, CommandAttemptState>>({});
  const [pendingIdx, setPendingIdx] = useState(0);
  const [termLines, setTermLines] = useState<TermLine[]>([]);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const coachMode = useUserStore((state) => state.coachMode);
  const toggleCoachMode = useUserStore((state) => state.toggleCoachMode);

  const startedAt = useRef<number>(Date.now());
  const msgId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);
  /* live score mirrors — closures passed to timers always read these */
  const earnedRef = useRef(0);
  const mistakesRef = useRef<MistakeEntry[]>([]);
  const hintsRef = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const play = useCallback(
    (fn: () => void) => {
      if (soundEnabled) fn();
    },
    [soundEnabled],
  );

  const later_ = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      if (mounted.current) fn();
    }, ms);
    timers.current.push(t);
  }, []);

  const pushMsg = useCallback((from: ChatMessage["from"], text: string, tone?: ChatMessage["tone"]) => {
    msgId.current += 1;
    const id = `m${msgId.current}`;
    setMessages((prev) => [...prev, { id, from, text, tone }]);
  }, []);

  const pushLines = useCallback((ls: TermLine[]) => {
    setTermLines((prev) => [...prev, ...ls]);
  }, []);

  const step = scenario.steps[stepIdx];
  const total = useMemo(() => scenarioMaxPoints(scenario), [scenario]);

  /* ------------------------------- step flow ------------------------------- */

  const finish = useCallback(() => {
      const result = buildScenarioResult(scenario, {
        earned: earnedRef.current,
        hintsUsed: hintsRef.current,
        mistakes: mistakesRef.current,
        durationSec: Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000)),
      });
      setPhase("done");
      play(sfx.success);
      later_(() => onFinish(result), 900);
    },
    [scenario, play, later_, onFinish]
  );

  const enterStep = useCallback(
    (idx: number) => {
      if (idx >= scenario.steps.length) {
        finish();
        return;
      }
      setStepIdx(idx);
      setBusy(false);
      const s = scenario.steps[idx];
      if (s.type === "dialogue") {
        setHintText(null);
        s.passengerLines.forEach((line, i) => {
          later_(() => pushMsg("passenger", line), 500 + i * 750);
        });
      } else if (s.type === "decision") {
        setHintText(null);
        later_(() => pushMsg("system", s.situation), 450);
      } else {
        setPendingIdx(0);
        later_(() => pushMsg("system", s.intro), 400);
        setTermLines((prev) => (prev.length === 0 ? BOOT : prev));
      }
    },
    [scenario, finish, later_, pushMsg],
  );

  const begin = useCallback(() => {
    startedAt.current = Date.now();
    earnedRef.current = 0;
    mistakesRef.current = [];
    hintsRef.current = 0;
    setPhase("running");
    pushMsg("system", `SHIFT LOG — ${scenario.code} · ${scenario.title}. ${scenario.briefing}`);
    later_(() => enterStep(0), 800);
  }, [scenario, pushMsg, later_, enterStep]);

  const recordMistake = useCallback(
    (m: MistakeEntry) => {
      mistakesRef.current = [...mistakesRef.current, m];
      setMistakes(mistakesRef.current);
    },
    [],
  );

  const advance = useCallback(() => {
    setBusy(true);
    later_(() => enterStep(stepIdx + 1), 1000);
  }, [enterStep, stepIdx, later_]);

  const chooseOption = useCallback(
    (
      option: { points: number; text: string; feedback: string; consequence?: string; best?: boolean },
      from: ChatMessage["from"],
      stepId: string,
      stepPrompt: string,
      bestPoints: number,
    ) => {
      if (busy) return;
      setBusy(true);
      pushMsg("trainee", option.text);
      earnedRef.current += option.points;
      setEarned(earnedRef.current);

      const ok = option.best === true;
      const decent = option.points >= bestPoints * 0.5;
      play(ok ? sfx.correct : sfx.wrong);
      pushMsg("coach", option.feedback, ok ? "ok" : decent ? "warn" : "bad");

      if (option.points < bestPoints) {
        recordMistake({
          stepId,
          title: stepPrompt,
          detail:
            option.text.length > 90
              ? `${option.text.slice(0, 90)}…`
              : option.text,
          pointsLost: bestPoints - option.points,
        });
      }

      const delay = 900;
      later_(() => {
        if (option.consequence) {
          pushMsg(from, option.consequence);
        }
      }, delay);
      later_(() => advance(), delay + (option.consequence ? 1200 : 300));
    },
    [busy, pushMsg, play, recordMistake, later_, advance],
  );

  const onChooseDialogue = useCallback(
    (o: DialogueOption) => {
      if (!step || step.type !== "dialogue") return;
      const best = Math.max(...step.options.map((x) => x.points));
      chooseOption(o, "passenger", step.id, step.prompt, best);
    },
    [step, chooseOption],
  );

  const onChooseDecision = useCallback(
    (o: DecisionOption) => {
      if (!step || step.type !== "decision") return;
      const best = Math.max(...step.options.map((x) => x.points));
      chooseOption(o, "system", step.id, step.prompt, best);
    },
    [step, chooseOption],
  );

  /* ------------------------------- terminal ------------------------------- */

  const cmdKey = (stepId: string, idx: number) => `${stepId}:${idx}`;

  const onHint = useCallback(() => {
    if (!step || step.type !== "terminal") return;
    const c = step.commands[pendingIdx];
    if (!c) return;
    const key = cmdKey(step.id, pendingIdx);
    setRevealed((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    hintsRef.current += 1;
    setHintsUsed(hintsRef.current);
    setCmdStates((prev) => ({
      ...prev,
      [key]: { attempts: prev[key]?.attempts ?? 0, hintUsed: true, done: false },
    }));
    setHintText(c.display);
  }, [step, pendingIdx]);

  const extraPatterns = useMemo(() => {
    return scenario.steps
      .filter((s) => s.type === "terminal" && (!step || s.id !== step.id))
      .flatMap((s) =>
        s.type === "terminal"
          ? s.commands.map((cmd) => ({ cmd, label: `${s.id.replace(/^(s\d+-[dt]\d+)$/, "another task")}` }))
          : [],
      );
  }, [scenario.steps, step]);

  const onTerminalSubmit = useCallback(
    (raw: string, coach = false) => {
      if (!step || step.type !== "terminal") return;
      const upper = raw.toUpperCase().replace(/\s+/g, "");

      if (upper === "CLEAR") {
        setTermLines(BOOT);
        return;
      }

      pushLines([{ kind: "input", text: raw }]);

      if (upper === "HELP") {
        const lines: TermLine[] = [
          { kind: "ok", text: "COMMANDS FOR THIS TASK:" },
          ...step.commands.map((c) => ({ kind: "output" as const, text: `  ${c.display.padEnd(38, " ")} — ${c.hint}` })),
          { kind: "sys", text: "ALSO AVAILABLE:" },
          ...GENERIC_COMMANDS.slice(0, 4).map((g) => ({
            kind: "output" as const,
            text: `  ${g.display.padEnd(38, " ")} — ${g.description}`,
          })),
        ];
        pushLines(lines);
        return;
      }

      const pending = step.commands[pendingIdx];
      if (!pending) return;
      const later = step.commands.slice(pendingIdx + 1);
      const outcome = evaluateEntry(raw, pending, later, extraPatterns);

      if (outcome.kind === "ok") {
        const key = cmdKey(step.id, pendingIdx);
        const base = cmdStates[key] ?? { attempts: 0, hintUsed: false, done: false };
        const st = coach ? { ...base, hintUsed: true } : base;
        const pts = commandPoints(pending, st);
        setCmdStates((prev) => ({ ...prev, [key]: { ...st, done: true } }));
        earnedRef.current += pts;
        setEarned(earnedRef.current);
        setHintText(null);
        play(sfx.correct);
        pushLines([
          ...pending.output.map((t) => ({ kind: "output" as const, text: t })),
          ...(coach
            ? [
                {
                  kind: "sys" as const,
                  text: "COACH TYPED THE ENTRY — POINTS REDUCED. THE LEARNING IS THE POINT.",
                },
              ]
            : []),
          { kind: "ok", text: pts === pending.points ? `ACCEPTED (+${pts} PTS)` : `ACCEPTED WITH PENALTY (+${pts}/${pending.points} PTS)` },
        ]);
        const nextIdx = pendingIdx + 1;
        if (nextIdx >= step.commands.length) {
          pushLines([{ kind: "sys", text: "— ALL ENTRIES COMPLETE — PROCEED AT THE COUNTER —" }]);
          later_(() => advance(), 1000);
        } else {
          setPendingIdx(nextIdx);
        }
        return;
      }

      // failures
      play(sfx.wrong);
      const lines: TermLine[] = [{ kind: "error", text: outcome.message }];
      if (outcome.kind === "invalid") {
        if (outcome.suggestion) {
          lines.push({ kind: "sys", text: `DID YOU MEAN: ${outcome.suggestion.display} ?` });
        }
        if ((cmdStates[cmdKey(step.id, pendingIdx)]?.attempts ?? 0) >= 0 && pending.errorHint) {
          lines.push({ kind: "sys", text: `HINT: ${pending.errorHint}` });
        }
        setCmdStates((prev) => {
          const key = cmdKey(step.id, pendingIdx);
          const st = prev[key] ?? { attempts: 0, hintUsed: false, done: false };
          return { ...prev, [key]: { ...st, attempts: st.attempts + 1 } };
        });
        recordMistake({
          stepId: step.id,
          title: "Altéa entry error",
          detail: `Entered "${raw}" — ${outcome.message.slice(0, 80)}`,
          pointsLost: 0,
        });
      } else {
        lines.push({ kind: "sys", text: "HINT: FOLLOW THE TASK SEQUENCE AT THE TOP." });
        recordMistake({
          stepId: step.id,
          title: "Command sequence error",
          detail: `Entered "${raw}" — ${outcome.message.slice(0, 80)}`,
          pointsLost: 0,
        });
      }
      pushLines(lines);
    },
    [step, pendingIdx, extraPatterns, cmdStates, play, pushLines, later_, advance, recordMistake],
  );

  /** Guided coach: type the pending command for the trainee, at a point penalty. */
  const onCoachFill = useCallback(() => {
    if (!step || step.type !== "terminal" || busy || phase !== "running") return;
    const command = step.commands[pendingIdx];
    if (!command) return;
    hintsRef.current += 1;
    setHintsUsed(hintsRef.current);
    play(sfx.keypress);
    onTerminalSubmit(command.display, true);
  }, [step, pendingIdx, busy, phase, play, onTerminalSubmit]);

  /* ------------------------------- derived ------------------------------- */

  const progressPct = Math.round((stepIdx / scenario.steps.length) * 100);
  const vocab = useMemo(() => {
    if (!step || step.type !== "terminal") return [];
    return [...step.commands.map((c) => c.display), "HELP", "CLEAR"];
  }, [step]);
  const pendingCmd = step?.type === "terminal" ? step.commands[pendingIdx] : undefined;
  const revealedKey = step?.type === "terminal" ? cmdKey(step.id, pendingIdx) : "";
  const pendingShown = step?.type === "terminal" ? revealed.has(revealedKey) : false;
  const dialogueStep = step?.type === "dialogue" && !busy ? step : null;

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-3">
      {/* sim header */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card/70 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">{scenario.code}</Badge>
          <p className="truncate text-sm font-semibold">{scenario.title}</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {mmss}</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /> {earned}/{total} PTS</span>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 gap-1 px-2 text-[11px]",
              coachMode ? "text-emerald-500 hover:text-emerald-400" : "text-muted-foreground",
            )}
            onClick={toggleCoachMode}
            aria-pressed={coachMode}
            title="Guided Coach Mode — highlights the best answer and can type commands for you"
          >
            <Wand2 className="h-3 w-3" /> Coach {coachMode ? "ON" : "OFF"}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-[11px] text-muted-foreground" onClick={onQuit}>
            <X className="h-3 w-3" /> Quit
          </Button>
        </div>
      </div>

      <div className="grid gap-3 tall:lg:h-[calc(100vh-11.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* LEFT — passenger + dialogue */}
        <div className="flex min-h-0 flex-col gap-3">
          <div className="rounded-lg border bg-card/70 p-3">
            <PassengerPanel
              passenger={scenario.passenger}
              baggage={scenario.baggage}
              documents={scenario.documents}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card/40 p-3">
            <DialogueFeed
              messages={messages}
              step={dialogueStep}
              onChoose={onChooseDialogue}
              disabled={busy}
              coachMode={coachMode}
            />
          </div>
        </div>

        {/* RIGHT — terminal + actions */}
        <div className="flex min-h-0 flex-col gap-3">
          <div className={cn("min-h-[240px] tall:lg:min-h-0 tall:lg:flex-[5]", step?.type === "terminal" ? "" : "opacity-70")}>
            <Terminal
              lines={termLines}
              vocab={vocab}
              onSubmit={onTerminalSubmit}
              disabled={step?.type !== "terminal" || busy || phase !== "running"}
              pendingHint={hintText ?? undefined}
            />
          </div>

          <div className="lg:flex-none">
            <ActionBar
              title={
                step?.type === "decision"
                  ? "Counter Actions — choose your procedure"
                  : step?.type === "terminal"
                    ? "DCS Task — type the commands in the terminal"
                    : "Counter Dialogue — choose your response"
              }
              options={step?.type === "decision" ? step.options : undefined}
              onChoose={onChooseDecision}
              disabled={busy || phase !== "running"}
              hintText={pendingShown && pendingCmd ? `TARGET ENTRY: ${pendingCmd.display}` : undefined}
              onHint={step?.type === "terminal" ? onHint : undefined}
              hintDisabled={!pendingCmd || Boolean(cmdStates[revealedKey]?.done)}
              onCoachFill={step?.type === "terminal" ? onCoachFill : undefined}
              coachFillDisabled={!pendingCmd || busy || phase !== "running"}
              coachMode={coachMode}
              progressPct={progressPct}
              stepLabel={`STEP ${Math.min(stepIdx + 1, scenario.steps.length)}/${scenario.steps.length}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[10px] text-muted-foreground">
                  {step?.prompt}
                </p>
                <ChecklistWidget scenario={scenario} />
              </div>
            </ActionBar>
          </div>
        </div>
      </div>

      {/* briefing dialog */}
      <Dialog open={phase === "briefing"} onOpenChange={(o) => !o && onQuit()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Flag className="h-4 w-4 text-emerald-500" />
              {scenario.code} — {scenario.title}
            </DialogTitle>
            <DialogDescription className="text-left text-xs leading-relaxed">
              {scenario.briefing}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SpeakButton
              text={`${scenario.title}. ${scenario.briefing}. Objectives: ${scenario.objectives.join(". ")}`}
              label="Read the briefing aloud"
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              LISTEN WHILE YOU READ
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Objectives
            </p>
            <ul className="space-y-1">
              {scenario.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Gauge className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                  {o}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                {"★".repeat(scenario.difficulty)}
              </Badge>
              <span>BASE XP {scenario.xpBase}</span>
              <span>· PAR {scenario.minutes}:00</span>
              <span>· SPEED BONUS +10%</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={onQuit}>
              Back
            </Button>
            <Button size="sm" className="gap-1.5" onClick={begin}>
              Begin Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
