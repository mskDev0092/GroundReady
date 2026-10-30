"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage, DialogueOption, DialogueStep } from "@/lib/types";
import { Bot, Info, ShieldAlert, User } from "lucide-react";

const STYLE: Record<ChatMessage["from"], { bubble: string; icon: React.ReactNode; label: string }> = {
  passenger: {
    bubble: "bg-card border text-card-foreground rounded-tl-sm",
    icon: <User className="h-3.5 w-3.5" />,
    label: "Passenger",
  },
  system: {
    bubble: "bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 rounded-tl-sm",
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
    label: "System / SOP",
  },
  trainee: {
    bubble: "bg-emerald-600 text-emerald-50 rounded-tr-sm",
    icon: <Bot className="h-3.5 w-3.5" />,
    label: "You",
  },
  coach: {
    bubble:
      "border rounded-tl-sm bg-muted/50 " +
      "data-[tone=ok]:border-emerald-500/40 data-[tone=ok]:text-emerald-600 dark:data-[tone=ok]:text-emerald-400 " +
      "data-[tone=warn]:border-amber-500/40 data-[tone=warn]:text-amber-600 dark:data-[tone=warn]:text-amber-400 " +
      "data-[tone=bad]:border-red-500/40 data-[tone=bad]:text-red-600 dark:data-[tone=bad]:text-red-400",
    icon: <Info className="h-3.5 w-3.5" />,
    label: "Coach",
  },
};

export function DialogueFeed({
  messages,
  step,
  onChoose,
  disabled,
}: {
  messages: ChatMessage[];
  step: DialogueStep | null;
  onChoose: (o: DialogueOption) => void;
  disabled?: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, step]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 max-h-[42vh] tall:lg:max-h-none">
        {messages.map((m) => {
          const s = STYLE[m.from];
          return (
            <div
              key={m.id}
              className={cn("flex items-end gap-2", m.from === "trainee" && "flex-row-reverse")}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  m.from === "trainee"
                    ? "bg-emerald-600 text-emerald-50"
                    : m.from === "coach"
                      ? "bg-violet-500/15 text-violet-500"
                      : m.from === "system"
                        ? "bg-amber-500/15 text-amber-500"
                        : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {s.icon}
              </div>
              <div
                data-tone={m.tone}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed shadow-sm",
                  s.bubble,
                )}
              >
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                  {s.label}
                </p>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {step && (
        <div className="rounded-lg border bg-card/70 p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {step.prompt}
          </p>
          <div className="space-y-2">
            {step.options.map((o) => (
              <button
                key={o.id}
                disabled={disabled}
                onClick={() => onChoose(o)}
                className="w-full rounded-md border bg-background/60 px-3 py-2 text-left text-[13px] leading-snug transition hover:border-emerald-500/60 hover:bg-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {o.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
