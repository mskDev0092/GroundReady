"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  GLOSSARY_CATEGORY_LABELS,
  searchGlossary,
  termOfTheDay,
} from "@/data/glossary";
import { getScenario } from "@/data/scenarios";
import type { GlossaryCategory } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";
import {
  ArrowRight,
  BookOpenText,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const CATEGORY_STYLE: Record<GlossaryCategory, string> = {
  DGR: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  IGOM: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  IATA: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  SAPS: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  DCS: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export function GlossaryView({ onStartScenario }: { onStartScenario: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");

  const list = useMemo(() => searchGlossary(query, category), [query, category]);
  const daily = useMemo(() => termOfTheDay(), []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <BookOpenText className="h-5 w-5 text-emerald-500" /> Jargon Buster
        </h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Every acronym, code and rule name in plain language. No experience needed — search a
          word, read the one-line meaning, then see how it is used on shift. Tap{" "}
          <span className="font-semibold text-foreground">Listen</span> to hear it read aloud.
        </p>
      </div>

      {/* term of the day */}
      <div className="flex flex-wrap items-start gap-3 rounded-xl border bg-gradient-to-br from-emerald-500/10 via-card to-card p-4">
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Term of the day
          </p>
          <p className="mt-0.5 text-sm font-bold">
            {daily.term}{" "}
            <span className="font-normal text-muted-foreground">— {daily.expansion}</span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{daily.plain}</p>
        </div>
        <SpeakButton text={`${daily.term}. ${daily.expansion}. ${daily.plain} ${daily.example}`} />
      </div>

      {/* search + filters */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a word, code or meaning…"
            className="h-9 pl-8 pr-8 text-xs"
            aria-label="Search glossary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            All · {GLOSSARY.length}
          </FilterChip>
          {GLOSSARY_CATEGORIES.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {GLOSSARY_CATEGORY_LABELS[c]}
            </FilterChip>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border bg-card/40 p-10 text-center">
          <Search className="mx-auto h-6 w-6 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-semibold">No term matches</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a shorter word — for example “dry ice”, “LMC” or “SSR”.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((item) => {
            const scenario = item.scenarioId ? getScenario(item.scenarioId) : undefined;
            return (
              <article key={item.id} className="flex flex-col rounded-xl border bg-card/60 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold leading-tight">{item.term}</h2>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      {item.expansion}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("shrink-0 text-[9px] uppercase", CATEGORY_STYLE[item.category])}
                  >
                    {item.category}
                  </Badge>
                </div>

                <p className="mt-2 flex-1 text-xs leading-relaxed">{item.plain}</p>

                <div className="mt-2 rounded-md border bg-background/50 px-2.5 py-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    On shift
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {item.example}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <SpeakButton text={`${item.term}. ${item.expansion}. ${item.plain} ${item.example}`} />
                  {scenario && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 gap-1 px-2 text-[10px] text-emerald-600 dark:text-emerald-400"
                      onClick={() => onStartScenario(scenario.id)}
                    >
                      Practise <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[10px] font-medium transition",
        active
          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-card/50 text-muted-foreground hover:border-emerald-500/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
