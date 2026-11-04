"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/hooks/use-toast";
import { sfx } from "@/lib/sound";
import { getScenario } from "@/data/scenarios";
import { BADGES } from "@/data/gamification";
import {
  ACADEMY_QUESTIONS,
  ACADEMY_TRACKS,
  dailySeed,
  overallAccuracy,
  pickDrill,
  trackProgress,
  TRACK_META,
} from "@/data/academy";
import type { AcademyQuestion, AcademyTrack } from "@/lib/types";
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Flame,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

type DrillTrack = AcademyTrack | "all";

interface Drill {
  questions: AcademyQuestion[];
  index: number;
  selected: number | null;
  results: { question: AcademyQuestion; correct: boolean }[];
  xp: number;
  combo: number;
  bestCombo: number;
  lastXp: number;
  track: DrillTrack;
  label: string;
}

const DIFFICULTY_LABEL = ["", "Foundation", "Operational", "Expert"];

export function AcademyView({ onStartScenario }: { onStartScenario: (id: string) => void }) {
  const academy = useUserStore((state) => state.academy);
  const soundEnabled = useUserStore((state) => state.soundEnabled);
  const recordAcademyAnswer = useUserStore((state) => state.recordAcademyAnswer);
  const completeAcademyDrill = useUserStore((state) => state.completeAcademyDrill);
  const { toast } = useToast();
  const [drill, setDrill] = useState<Drill | null>(null);

  const play = useCallback(
    (fn: () => void) => {
      if (soundEnabled) fn();
    },
    [soundEnabled],
  );

  const totalCorrect = ACADEMY_TRACKS.reduce(
    (sum, track) => sum + trackProgress(academy, track).correct,
    0,
  );
  const accuracy = overallAccuracy(academy);
  const dailyDone = academy.lastPlayed
    ? new Date(academy.lastPlayed).toDateString() === new Date().toDateString()
    : false;

  const tracks = useMemo(
    () =>
      ACADEMY_TRACKS.map((track) => ({
        track,
        meta: TRACK_META[track],
        progress: trackProgress(academy, track),
      })),
    [academy],
  );

  const recommended = useMemo(
    () =>
      [...tracks].sort((a, b) => a.progress.mastery - b.progress.mastery)[0]?.track ?? "DGR",
    [tracks],
  );

  function startDrill(track: DrillTrack, label: string, seed = Date.now()) {
    const questions = pickDrill(track, 10, seed);
    if (questions.length === 0) return;
    setDrill({
      questions,
      index: 0,
      selected: null,
      results: [],
      xp: 0,
      combo: 0,
      bestCombo: 0,
      lastXp: 0,
      track,
      label,
    });
  }

  function choose(optionIndex: number) {
    if (!drill || drill.selected !== null) return;
    const question = drill.questions[drill.index];
    const correct = optionIndex === question.answer;
    const outcome = recordAcademyAnswer(question.id, correct);

    play(correct ? sfx.correct : sfx.wrong);

    if (outcome.newBadges.length > 0) {
      play(sfx.badge);
      toast({
        title:
          outcome.newBadges.length === 1 ? "Badge unlocked" : `${outcome.newBadges.length} badges unlocked`,
        description: outcome.newBadges
          .map((id) => BADGES.find((b) => b.id === id)?.name)
          .filter(Boolean)
          .join(" · "),
      });
    } else if (outcome.combo > 0 && outcome.combo % 5 === 0) {
      play(sfx.badge);
      toast({
        title: `${outcome.combo} in a row!`,
        description: "Answer streak intact — keep it going for the Perfect Ten badge.",
      });
    }

    setDrill((current) =>
      current
        ? {
            ...current,
            selected: optionIndex,
            results: [...current.results, { question, correct }],
            xp: current.xp + outcome.xpAwarded,
            combo: outcome.combo,
            bestCombo: Math.max(current.bestCombo, outcome.combo),
            lastXp: outcome.xpAwarded,
          }
        : current,
    );

    if (drill.index === drill.questions.length - 1) {
      completeAcademyDrill();
      play(sfx.success);
    }
  }

  function nextQuestion() {
    setDrill((current) =>
      current
        ? {
            ...current,
            index: Math.min(current.index + 1, current.questions.length - 1),
            selected: null,
          }
        : current,
    );
  }

  /* Keyboard: 1–4 select an answer, Enter/Space continues to the next question. */
  useEffect(() => {
    if (!drill || drill.results.length === drill.questions.length) return;
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }
      if (drill!.selected === null) {
        const optionCount = drill!.questions[drill!.index].options.length;
        const pressed = Number(event.key);
        if (Number.isInteger(pressed) && pressed >= 1 && pressed <= optionCount) {
          event.preventDefault();
          choose(pressed - 1);
        }
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        nextQuestion();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drill, choose, nextQuestion]);

  if (drill) {
    const question = drill.questions[drill.index];
    const done = drill.results.length === drill.questions.length && drill.selected !== null;
    const correctCount = drill.results.filter((result) => result.correct).length;

    if (done) {
      const pct = Math.round((correctCount / drill.questions.length) * 100);
      const missed = drill.results.filter((result) => !result.correct);
      return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <div className="rounded-xl border bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              {pct >= 80 ? <Trophy className="h-7 w-7" /> : <Target className="h-7 w-7" />}
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
              {drill.label} complete
            </p>
            <h2 className="mt-1 text-2xl font-bold">{pct}% accuracy</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {correctCount}/{drill.questions.length} correct · +{drill.xp} XP · best combo{" "}
              {drill.bestCombo}
            </p>
            <div className="mx-auto mt-4 max-w-xs">
              <Progress value={pct} className="h-2" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {pct >= 90
                ? "Outstanding — this is check-in ready knowledge."
                : pct >= 70
                  ? "Solid. Review the misses below, then drill again."
                  : "Good start. Read every explanation before the next attempt."}
            </p>
          </div>

          {missed.length > 0 && (
            <div className="rounded-xl border bg-card/60 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <BookOpenCheck className="h-4 w-4 text-amber-500" />
                Review — {missed.length} to revisit
              </h3>
              <div className="mt-3 space-y-3">
                {missed.map(({ question: missedQuestion }) => (
                  <div key={missedQuestion.id} className="rounded-lg border bg-background/60 p-3">
                    <p className="text-xs font-semibold leading-snug">{missedQuestion.question}</p>
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                      ✓ {missedQuestion.options[missedQuestion.answer]}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {missedQuestion.explanation}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground/80">
                      {missedQuestion.reference}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              className="gap-1.5"
              onClick={() => startDrill(drill.track, drill.label, Date.now() + 1)}
            >
              <RotateCcw className="h-4 w-4" /> Drill again
            </Button>
            <Button variant="outline" onClick={() => setDrill(null)}>
              Back to gym
            </Button>
          </div>
        </div>
      );
    }

    const isCorrect = drill.selected !== null && drill.selected === question.answer;

    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card/70 px-3 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              {drill.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Question {drill.index + 1}/{drill.questions.length}
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-amber-500">
              <Flame className="h-3.5 w-3.5" /> {drill.combo}
            </span>
            <span className="flex items-center gap-1 text-emerald-500">
              <Zap className="h-3.5 w-3.5" /> +{drill.xp} XP
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-[11px]"
              onClick={() => setDrill(null)}
            >
              Exit
            </Button>
          </div>
        </div>

        <Progress
          value={Math.round((drill.index / drill.questions.length) * 100)}
          className="h-1.5"
        />

        <div className="rounded-xl border bg-card/60 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
            >
              {TRACK_META[question.track].icon} {TRACK_META[question.track].short}
            </Badge>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {question.topic}
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {DIFFICULTY_LABEL[question.difficulty]}
            </span>
          </div>

          <h2 className="mt-3 text-base font-semibold leading-snug">{question.question}</h2>

          <div className="mt-4 space-y-2">
            {question.options.map((option, index) => {
              const chosen = drill.selected === index;
              const revealCorrect = drill.selected !== null && index === question.answer;
              const revealWrong = chosen && index !== question.answer;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(index)}
                  disabled={drill.selected !== null}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition",
                    drill.selected === null &&
                      "hover:border-emerald-500/60 hover:bg-emerald-500/5",
                    revealCorrect && "border-emerald-500/60 bg-emerald-500/10",
                    revealWrong && "border-rose-500/60 bg-rose-500/10",
                    !revealCorrect && !revealWrong && "bg-background/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]",
                      revealCorrect && "border-emerald-500 text-emerald-600",
                      revealWrong && "border-rose-500 text-rose-600",
                    )}
                  >
                    {revealCorrect ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : revealWrong ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                  {drill.selected === null && (
                    <kbd className="ml-auto mt-0.5 hidden h-5 w-5 shrink-0 items-center justify-center rounded border bg-muted font-mono text-[10px] text-muted-foreground/70 sm:flex">
                      {index + 1}
                    </kbd>
                  )}
                </button>
              );
            })}
          </div>

          {drill.selected !== null && (
            <div
              role="status"
              aria-live="polite"
              className={cn(
                "mt-4 rounded-lg border p-3",
                isCorrect
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-amber-500/40 bg-amber-500/10",
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold",
                  isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
                )}
              >
                {isCorrect
                  ? drill.lastXp > 0
                    ? `Correct — +${drill.lastXp} XP`
                    : "Correct — already mastered, no repeat XP"
                  : "Not quite — read the rule"}
              </p>
              <p className="mt-1 text-xs leading-relaxed">{question.explanation}</p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                {question.reference}
              </p>
              {question.scenarioId && getScenario(question.scenarioId) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-7 gap-1 text-[11px]"
                  onClick={() => onStartScenario(question.scenarioId as string)}
                >
                  <Play className="h-3 w-3" /> Practise in scenario
                </Button>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-[10px] text-muted-foreground">
              {drill.selected === null
                ? "Choose one answer — keys 1–4 work too"
                : "Explanation unlocked — press Enter to continue"}
            </p>
            <Button
              size="sm"
              className="gap-1.5"
              disabled={drill.selected === null}
              onClick={nextQuestion}
            >
              {drill.index === drill.questions.length - 1 ? (
                <>
                  See results <Trophy className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Next question <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="rounded-xl border bg-gradient-to-br from-emerald-500/10 via-card to-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Knowledge Gym
            </p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Brain className="h-6 w-6 text-emerald-500" /> Drill the rules. Build the reflex.
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {ACADEMY_QUESTIONS.length} scenario-linked questions across IATA DGR, IGOM ramp
              operations, passenger standards and SAPS/PCAA procedure. Every answer explains the
              rule — so a mistake becomes a lesson.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-emerald-500">{academy.xp}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Gym XP
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat icon={<Target className="h-3.5 w-3.5 text-emerald-500" />} label="Answered" value={`${academy.answered.length}/${ACADEMY_QUESTIONS.length}`} />
          <MiniStat icon={<CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />} label="Correct" value={`${totalCorrect}`} />
          <MiniStat icon={<Sparkles className="h-3.5 w-3.5 text-violet-500" />} label="Accuracy" value={`${accuracy}%`} />
          <MiniStat icon={<Flame className="h-3.5 w-3.5 text-rose-500" />} label="Best combo" value={`${academy.bestCombo}`} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button className="gap-1.5" onClick={() => startDrill("all", "Quick 10", Date.now())}>
            <Play className="h-4 w-4" /> Quick 10
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => startDrill("all", "Daily 10", dailySeed())}
          >
            <Sparkles className="h-4 w-4" /> Daily 10
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => startDrill(recommended, `${TRACK_META[recommended].short} focus`, Date.now())}
          >
            <Target className="h-4 w-4" /> Focus: {TRACK_META[recommended].label}
          </Button>
          {dailyDone && (
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400">
              ✓ Practised today
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tracks.map(({ track, meta, progress }) => (
          <div key={track} className="flex flex-col rounded-xl border bg-card/60 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {meta.icon}
                </span>
                <div>
                  <h2 className="text-sm font-semibold leading-tight">{meta.label}</h2>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {meta.short} · {progress.correct}/{progress.total} mastered
                  </p>
                </div>
              </div>
              {progress.mastery >= 75 ? (
                <Badge className="border border-amber-500/30 bg-amber-500/15 text-[10px] text-amber-600" variant="outline">
                  MASTERED
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  {progress.mastery}%
                </Badge>
              )}
            </div>

            <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
              {meta.description}
            </p>

            <Progress value={progress.mastery} className="mt-3 h-1.5" />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>{progress.answered} attempted</span>
              <span>{progress.accuracy}% accuracy</span>
            </div>

            <Button
              size="sm"
              variant={track === recommended ? "default" : "outline"}
              className="mt-3 h-7 gap-1 self-start text-[11px]"
              onClick={() => startDrill(track, `${meta.short} drill`, Date.now())}
            >
              <Play className="h-3 w-3" /> Drill {meta.short}
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card/40 p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <BookOpenCheck className="h-4 w-4 text-emerald-500" /> How the gym works
        </h2>
        <div className="mt-2 grid gap-2 text-xs leading-relaxed text-muted-foreground sm:grid-cols-3">
          <p>
            <span className="font-semibold text-foreground">First correct answer</span> earns full
            XP. Re-answering a question you already knew earns nothing — mastery, not grinding.
          </p>
          <p>
            <span className="font-semibold text-foreground">Streaks</span> build the Perfect Ten
            badge. A wrong answer resets the combo but still teaches the rule.
          </p>
          <p>
            <span className="font-semibold text-foreground">Track badges</span> unlock at 12
            correct answers. The Academy Graduate badge needs all four tracks.
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
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
