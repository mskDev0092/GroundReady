"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/useUserStore";
import { DashboardView } from "./DashboardView";
import { ScenariosView } from "./ScenariosView";
import { SimView } from "./SimView";
import { SummaryView } from "./SummaryView";
import { AcademyView } from "./AcademyView";
import { GlossaryView } from "./GlossaryView";
import { OnboardingDialog } from "./OnboardingDialog";
import { BrandMark } from "./BrandMark";
import { getScenario, SCENARIOS } from "@/data/scenarios";
import { levelFromXp } from "@/data/gamification";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";
import type { AcademyTab, ViewName } from "@/lib/types";
import {
  BookOpenCheck,
  BookOpenText,
  Gauge,
  Home,
  LayoutGrid,
  Moon,
  Settings2,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Wand2,
  Zap,
} from "lucide-react";

const subscribeNoop = () => () => {};

const MOBILE_TABS = [
  { view: "dashboard", label: "Dashboard", icon: Home },
  { view: "scenarios", label: "Scenarios", icon: LayoutGrid },
  { view: "academy", label: "Gym", icon: BookOpenCheck },
  { view: "glossary", label: "Words", icon: BookOpenText },
] as const;

export function AppShell() {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [view, setView] = useState<ViewName>("dashboard");
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [simKey, setSimKey] = useState(0);
  const [tourRequested, setTourRequested] = useState(false);
  const [academyTab, setAcademyTab] = useState<AcademyTab>("gym");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const {
    xp,
    streak,
    badges,
    progress,
    academy,
    soundEnabled,
    coachMode,
    onboarded,
    traineeName,
    lastResult,
    newlyUnlocked,
    completeScenario,
    setLastResult,
    clearNewlyUnlocked,
    toggleSound,
    toggleCoachMode,
    completeOnboarding,
    replayOnboarding,
    resetAll,
  } = useUserStore();

  useEffect(() => {
    if (view !== "dashboard") clearNewlyUnlocked();
  }, [view, clearNewlyUnlocked]);

  /* First run: open the tour automatically once the client has hydrated. */
  const tourOpen = tourRequested || (mounted && !onboarded && xp === 0);

  const level = levelFromXp(xp);

  const startScenario = useCallback(
    (id: string) => {
      setScenarioId(id);
      setSimKey((k) => k + 1);
      setView("sim");
      window.scrollTo({ top: 0 });
    },
    [],
  );

  const finishScenario = useCallback(
    (result: Parameters<typeof completeScenario>[0]) => {
      const { newBadges } = completeScenario(result);
      if (newBadges.length > 0 && soundEnabled) sfx.badge();
      setView("summary");
      window.scrollTo({ top: 0 });
    },
    [completeScenario, soundEnabled],
  );

  const go = useCallback((v: ViewName) => {
    setView(v);
    window.scrollTo({ top: 0 });
  }, []);

  const openAcademy = useCallback(
    (tab: AcademyTab = "gym") => {
      setAcademyTab(tab);
      go("academy");
    },
    [go],
  );

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <BrandMark className="h-12 w-12" />
          <p className="font-mono text-xs text-muted-foreground">BOOTING GROUNDREADY…</p>
        </div>
      </div>
    );
  }

  const scenario = scenarioId ? getScenario(scenarioId) : undefined;
  const nextScenarioAfter =
    lastResult && SCENARIOS[SCENARIOS.findIndex((s) => s.id === lastResult.scenarioId) + 1];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* header */}
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 print:hidden">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-3">
          <button
            className="flex items-center gap-2.5"
            onClick={() => go("dashboard")}
            aria-label="GroundReady home"
          >
            <BrandMark className="h-8 w-8 drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]" />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-bold tracking-tight">
                Ground<span className="text-emerald-500">Ready</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Aviation Ground Operations Trainer
              </span>
            </span>
          </button>

          <nav className="flex items-center gap-1" aria-label="Main">
            <Button
              variant={view === "dashboard" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => go("dashboard")}
            >
              <Home className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button
              variant={view === "scenarios" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => go("scenarios")}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Scenarios</span>
            </Button>
            <Button
              variant={view === "academy" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => go("academy")}
            >
              <BookOpenCheck className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Gym</span>
            </Button>
            <Button
              variant={view === "glossary" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => go("glossary")}
            >
              <BookOpenText className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Words</span>
            </Button>
            <span className="mx-1 hidden h-5 w-px bg-border md:block" />
            <Badge
              variant="outline"
              className="hidden gap-1.5 border-emerald-500/40 bg-emerald-500/10 font-mono text-[10px] text-emerald-600 md:inline-flex dark:text-emerald-400"
            >
              <Gauge className="h-3 w-3" /> LVL {level.level} · {xp} XP · 🔥{streak}
            </Badge>
          </nav>

          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/40 bg-emerald-500/10 font-mono text-[10px] text-emerald-600 sm:hidden dark:text-emerald-400"
            >
              <Zap className="h-3 w-3" /> {xp}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => {
                toggleSound();
                toast({ title: soundEnabled ? "Sound off" : "Sound on" });
              }}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Settings">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">
                  Signed in as {traineeName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    replayOnboarding();
                    setTourRequested(true);
                  }}
                >
                  <Sparkles className="mr-2 h-3.5 w-3.5" /> Replay app tour
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={toggleCoachMode}>
                  <Wand2 className="mr-2 h-3.5 w-3.5" />
                  Guided coach: {coachMode ? "On" : "Off"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Reset all progress
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base">Reset all progress?</AlertDialogTitle>
                      <AlertDialogDescription className="text-xs">
                        XP, level, streak, badges and scenario history will be wiped. This cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="h-8 text-xs"
                        onClick={() => {
                          resetAll();
                          setView("dashboard");
                          toast({ title: "Progress reset", description: "Fresh shift, fresh start." });
                        }}
                      >
                        Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-24 pt-4 sm:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (scenarioId ?? "") + simKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {view === "dashboard" && (
              <DashboardView
                xp={xp}
                streak={streak}
                badges={badges}
                progress={progress}
                academy={academy}
                newlyUnlocked={newlyUnlocked}
                onClearNew={clearNewlyUnlocked}
                onStart={startScenario}
                onBrowse={() => go("scenarios")}
                onAcademy={() => openAcademy("gym")}
                onPaxPathway={() => openAcademy("pax")}
                onGlossary={() => go("glossary")}
                onTour={() => setTourRequested(true)}
              />
            )}
            {view === "scenarios" && (
              <ScenariosView progress={progress} onStart={startScenario} />
            )}
            {view === "academy" && (
              <AcademyView
                tab={academyTab}
                onTabChange={setAcademyTab}
                onStartScenario={startScenario}
                onGlossary={() => go("glossary")}
              />
            )}
            {view === "glossary" && (
              <GlossaryView onStartScenario={startScenario} />
            )}
            {view === "sim" && scenario && (
              <SimView
                key={simKey}
                scenario={scenario}
                soundEnabled={soundEnabled}
                onFinish={finishScenario}
                onQuit={() => go("scenarios")}
              />
            )}
            {view === "summary" && lastResult && (
              <SummaryView
                result={lastResult}
                scenario={getScenario(lastResult.scenarioId)!}
                hasNext={Boolean(nextScenarioAfter)}
                onRetry={() => startScenario(lastResult.scenarioId)}
                onNext={() => nextScenarioAfter && startScenario(nextScenarioAfter.id)}
                onDashboard={() => go("dashboard")}
                onAcademy={() => openAcademy("gym")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* mobile bottom nav */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:hidden print:hidden"
      >
        <div className="mx-auto grid w-full max-w-md grid-cols-4">
          {MOBILE_TABS.map(({ view: tabView, label, icon: Icon }) => {
            const active = view === tabView;
            return (
              <button
                key={tabView}
                type="button"
                onClick={() => go(tabView)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition",
                  active ? "text-emerald-500" : "text-muted-foreground",
                )}
              >
                {active && (
                  <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-emerald-500" />
                )}
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* sticky footer */}
      <footer className="mt-auto hidden border-t bg-card/50 sm:block print:hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-3 text-[10px] text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">GroundReady</span> — gamified
            ground-operations training for SAPS Traffic Assistants
          </p>
          <p className="font-mono">
            IATA DGR 67th Ed. (2026) · IGOM · TIMATIC · PCAA · TRAINING ONLY — NOT FOR OPERATIONAL USE
          </p>
        </div>
      </footer>

      <OnboardingDialog
        open={tourOpen}
        onComplete={() => {
          completeOnboarding();
          setTourRequested(false);
        }}
        onNavigate={(next) => go(next)}
        onStartScenario={startScenario}
      />
    </div>
  );
}
