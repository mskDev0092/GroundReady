"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { autocomplete } from "@/lib/altea";
import { sfx } from "@/lib/sound";
import { TerminalSquare } from "lucide-react";

export interface TermLine {
  kind: "input" | "output" | "error" | "sys" | "ok";
  text: string;
}

const LINE_CLASS: Record<TermLine["kind"], string> = {
  input: "text-emerald-300",
  output: "text-emerald-100/90",
  ok: "text-emerald-400 font-semibold",
  error: "text-red-400 font-semibold",
  sys: "text-amber-400",
};

export function Terminal({
  lines,
  vocab,
  onSubmit,
  disabled,
  pendingHint,
}: {
  lines: TermLine[];
  vocab: string[];
  onSubmit: (entry: string) => void;
  disabled?: boolean;
  pendingHint?: string;
}) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines.length]);

  const suggestions = useMemo(() => {
    const q = value.toUpperCase().replace(/\s+/g, "");
    if (!q) return [];
    return vocab.filter((v) => v.toUpperCase().replace(/\s+/g, "").startsWith(q)).slice(0, 4);
  }, [value, vocab]);

  const submit = useCallback(
    (entry: string) => {
      const v = entry.trim();
      if (!v) return;
      setHistory((h) => [v, ...h].slice(0, 40));
      setHistIdx(-1);
      setValue("");
      onSubmit(v);
    },
    [onSubmit],
  );

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const res = autocomplete(value, vocab, !e.shiftKey);
      if (res) setValue(res.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const i = Math.min(histIdx + 1, history.length - 1);
        setHistIdx(i);
        setValue(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = histIdx - 1;
      if (i < 0) {
        setHistIdx(-1);
        setValue("");
      } else {
        setHistIdx(i);
        setValue(history[i]);
      }
    }
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-emerald-900/60 bg-[#04140d] shadow-[0_0_24px_rgba(16,185,129,0.06)]"
      onClick={() => !disabled && inputRef.current?.focus()}
      role="region"
      aria-label="Alteá DCS terminal"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-emerald-900/60 bg-[#061a11] px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400">
            <TerminalSquare className="h-3.5 w-3.5" />
            ALTÉA DCS — CMD MODE
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-700">SAPS · TRAINING INSTANCE</span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-3 py-2 font-mono text-[12px] leading-[1.45]"
      >
        {lines.map((l, i) => (
          <pre
            key={i}
            className={cn("whitespace-pre-wrap break-words", LINE_CLASS[l.kind])}
          >
            {l.kind === "input" ? `> ${l.text}` : l.text}
          </pre>
        ))}
        {disabled && (
          <pre className="whitespace-pre-wrap text-emerald-700">
            {"— TERMINAL IDLE — COMPLETE THE CURRENT STEP —"}
          </pre>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-emerald-900/60 bg-[#061a11] px-3 py-2">
        {suggestions.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setValue(s);
                  inputRef.current?.focus();
                }}
                className="rounded border border-emerald-800 bg-emerald-950/60 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-emerald-900/60"
              >
                {s}
              </button>
            ))}
            <span className="self-center font-mono text-[9px] text-emerald-800">TAB to complete</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-emerald-500">{">"}</span>
          <input
            ref={inputRef}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              setValue(e.target.value);
              sfx.keypress();
            }}
            onKeyDown={handleKey}
            placeholder={disabled ? "" : "type a command… (HELP for list)"}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="characters"
            aria-label="DCS command input"
            className="w-full bg-transparent font-mono text-[13px] text-emerald-200 caret-emerald-400 outline-none placeholder:text-emerald-900 disabled:cursor-not-allowed"
          />
        </div>
        {pendingHint && (
          <p className="mt-1 font-mono text-[10px] text-amber-500/90">PENDING: {pendingHint}</p>
        )}
      </div>
    </div>
  );
}
