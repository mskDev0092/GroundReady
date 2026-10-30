"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ActionIcon, DecisionOption } from "@/lib/types";
import {
  ClipboardCheck,
  Clock,
  Handshake,
  Lightbulb,
  ListOrdered,
  Lock,
  Megaphone,
  PhoneCall,
  Plane,
  Receipt,
  Scale,
  ScanSearch,
  ShieldAlert,
  Ticket,
  UserRound,
  UserPlus,
} from "lucide-react";

export function iconFor(icon: ActionIcon | undefined, className = "h-4 w-4") {
  const map: Record<ActionIcon, React.ReactNode> = {
    supervisor: <PhoneCall className={className} />,
    asf: <ShieldAlert className={className} />,
    emd: <Receipt className={className} />,
    timatic: <ScanSearch className={className} />,
    lrt: <Ticket className={className} />,
    "boarding-pass": <Ticket className={className} />,
    scale: <Scale className={className} />,
    megaphone: <Megaphone className={className} />,
    handshake: <Handshake className={className} />,
    clipboard: <ClipboardCheck className={className} />,
    plane: <Plane className={className} />,
    lock: <Lock className={className} />,
    volunteer: <UserPlus className={className} />,
    list: <ListOrdered className={className} />,
    clock: <Clock className={className} />,
  };
  return (icon && map[icon]) ?? <ClipboardCheck className={className} />;
}

export function ActionBar({
  title,
  options,
  onChoose,
  disabled,
  hintText,
  onHint,
  hintDisabled,
  progressPct,
  stepLabel,
  children,
}: {
  title: string;
  options?: DecisionOption[];
  onChoose?: (o: DecisionOption) => void;
  disabled?: boolean;
  hintText?: string;
  onHint?: () => void;
  hintDisabled?: boolean;
  progressPct: number;
  stepLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card/70 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">{stepLabel}</span>
          {onHint && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 gap-1 px-2 text-[10px] text-amber-500 hover:text-amber-400"
              onClick={onHint}
              disabled={hintDisabled}
            >
              <Lightbulb className="h-3 w-3" /> Hint
            </Button>
          )}
        </div>
      </div>
      <Progress value={progressPct} className="h-1" />
      {hintText && (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 font-mono text-[11px] text-amber-600 dark:text-amber-400">
          {hintText}
        </p>
      )}
      {options && (
        <div className="grid gap-2">
          {options.map((o) => (
            <Button
              key={o.id}
              disabled={disabled}
              onClick={() => onChoose?.(o)}
              variant="outline"
              className={cn(
                "h-auto justify-start gap-2.5 px-3 py-2.5 text-left text-[12.5px] leading-snug",
                "hover:border-emerald-500/60 hover:bg-emerald-500/5",
              )}
            >
              <span className="mt-0.5 shrink-0 text-emerald-500">
                {iconFor(o.icon)}
              </span>
              <span>{o.text}</span>
            </Button>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
