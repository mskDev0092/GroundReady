"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SCENARIOS } from "@/data/scenarios";
import type { ViewName } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Brain,
  Keyboard,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
  Volume2,
  Wand2,
} from "lucide-react";

const TOUR_STEPS = 4;

export function OnboardingDialog({
  open,
  onComplete,
  onNavigate,
  onStartScenario,
}: {
  open: boolean;
  onComplete: () => void;
  onNavigate: (view: ViewName) => void;
  onStartScenario: (id: string) => void;
}) {
  const [step, setStep] = useState(0);

  function finish() {
    onComplete();
    setStep(0);
  }

  function goTo(view: ViewName) {
    finish();
    onNavigate(view);
  }

  function startFirstShift() {
    const first = SCENARIOS[0];
    finish();
    if (first) onStartScenario(first.id);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) finish();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOUR_STEPS }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  index <= step ? "bg-emerald-500" : "bg-muted",
                )}
              />
            ))}
          </div>
          <DialogTitle className="mt-2 flex items-center gap-2 text-base">
            {step === 0 && <Sparkles className="h-4 w-4 text-emerald-500" />}
            {step === 1 && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
            {step === 2 && <Trophy className="h-4 w-4 text-amber-500" />}
            {step === 3 && <Play className="h-4 w-4 text-emerald-500" />}
            {step === 0 && "Welcome to GroundReady"}
            {step === 1 && "You are never stuck"}
            {step === 2 && "Earn as you learn"}
            {step === 3 && "Choose your first move"}
          </DialogTitle>
          <DialogDescription className="text-left text-xs leading-relaxed">
            {step === 0 &&
              "No aviation experience needed. GroundReady teaches the words, the rules and the reflexes one small step at a time — at your pace, on any phone."}
            {step === 1 &&
              "Guided Coach Mode is ON by default. It helps you choose, types commands for you, and reads text aloud."}
            {step === 2 &&
              "Every answer, drill and scenario earns XP. Levels, badges and streaks track your progress — but a wrong answer is data, not failure."}
            {step === 3 &&
              "Pick whichever feels easiest. You can move between all three at any time."}
          </DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="grid gap-2">
            <TourRow
              icon={<BookOpenText className="h-4 w-4 text-sky-500" />}
              title="1 · Learn the words"
              text="The Jargon Buster explains DGR, FOD, PNR and every other code in plain language."
            />
            <TourRow
              icon={<Brain className="h-4 w-4 text-violet-500" />}
              title="2 · Drill the rules"
              text="The Knowledge Gym asks short questions, explains every answer, and revisits your mistakes."
            />
            <TourRow
              icon={<Play className="h-4 w-4 text-emerald-500" />}
              title="3 · Run a shift"
              text="Scenario practice puts you at the counter and the terminal with a coach beside you."
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-2">
            <TourRow
              icon={<Wand2 className="h-4 w-4 text-emerald-500" />}
              title="Coach picks the best answer"
              text="In guided mode the strongest option is highlighted, so you learn the SOP before being tested."
            />
            <TourRow
              icon={<Keyboard className="h-4 w-4 text-amber-500" />}
              title="“Do it for me” in the terminal"
              text="Stuck on an Altéa command? Let the coach type it, then read what happened. Points are reduced, learning is not."
            />
            <TourRow
              icon={<Volume2 className="h-4 w-4 text-sky-500" />}
              title="Listen instead of reading"
              text="Tap Listen on a glossary term or gym question to hear it read aloud in clear English."
            />
            <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-700 dark:text-emerald-400">
              Ready for a real test? Turn Coach Mode off from the top bar or Settings.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-2">
            <TourRow
              icon={<Sparkles className="h-4 w-4 text-emerald-500" />}
              title="XP moves you up the ladder"
              text="Trainee T/A → Station Manager. Every drill, quiz and scenario adds XP."
            />
            <TourRow
              icon={<Trophy className="h-4 w-4 text-amber-500" />}
              title="24 badges to collect"
              text="Track badges reward 12 correct answers per subject; scenario badges reward a clean shift."
            />
            <TourRow
              icon={<ShieldCheck className="h-4 w-4 text-sky-500" />}
              title="Smart Review remembers your misses"
              text="A wrong gym answer is queued for review. Get it right later and it leaves the queue."
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              You can reset everything from Settings, or replay this tour whenever you want.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-2">
            <Button className="h-auto justify-start gap-3 px-3 py-3 text-left" onClick={startFirstShift}>
              <Play className="h-4 w-4 shrink-0" />
              <span>
                <span className="block text-sm font-semibold">Start a guided shift</span>
                <span className="block text-[11px] font-normal opacity-80">
                  Module 1 with the coach beside you — about 12 minutes.
                </span>
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto justify-start gap-3 px-3 py-3 text-left"
              onClick={() => goTo("academy")}
            >
              <Brain className="h-4 w-4 shrink-0 text-violet-500" />
              <span>
                <span className="block text-sm font-semibold">Try 10 quick questions</span>
                <span className="block text-[11px] font-normal text-muted-foreground">
                  A 3-minute drill with an explanation after each answer.
                </span>
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto justify-start gap-3 px-3 py-3 text-left"
              onClick={() => goTo("glossary")}
            >
              <BookOpenText className="h-4 w-4 shrink-0 text-sky-500" />
              <span>
                <span className="block text-sm font-semibold">Learn the words first</span>
                <span className="block text-[11px] font-normal text-muted-foreground">
                  Browse 40+ aviation terms with plain-English meanings.
                </span>
              </span>
            </Button>
          </div>
        )}

        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
          <div>
            {step > 0 ? (
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={finish}>
                Skip tour
              </Button>
            )}
          </div>
          {step < TOUR_STEPS - 1 && (
            <Button size="sm" className="gap-1" onClick={() => setStep(step + 1)}>
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TourRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background/50 px-3 py-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-semibold">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
