"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/use-speech";
import { Square, Volume2 } from "lucide-react";

export function SpeakButton({
  text,
  label = "Read aloud",
  compact = false,
  className,
}: {
  text: string;
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const { supported, speaking, speak, stop } = useSpeech();

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size={compact ? "icon" : "sm"}
      onClick={() => (speaking ? stop() : speak(text))}
      aria-label={speaking ? "Stop reading" : label}
      title={speaking ? "Stop reading" : label}
      className={cn(
        "shrink-0 text-muted-foreground hover:text-emerald-500",
        compact ? "h-6 w-6" : "h-6 gap-1 px-2 text-[10px]",
        className,
      )}
    >
      {speaking ? <Square className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
      {!compact && <span>{speaking ? "Stop" : "Listen"}</span>}
    </Button>
  );
}
